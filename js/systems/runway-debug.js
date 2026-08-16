/* ================================================================
   Runway/gate/taxi DEBUG visualization — REAL DATA.
   ================================================================
   Draws every airport's real runway centerlines, thresholds, runway IDs,
   and (once real OSM data exists for an airport — see
   js/data/taxi-graph.js) taxiways, taxilanes, parking positions, gates,
   and runway exits, directly onto the Leaflet map (in the dedicated
   runwayDebugPane — see map-init.js). No coordinate here is generated;
   every line/marker is built directly from real [lat, lon] data.

   AIRPORT_GROUND_DATA itself ships with empty taxiway/taxilane/parking/
   gate arrays for all 254 airports — that data only ever exists once
   js/data/osm-taxiway-fetch.js has actually fetched it live from
   OpenStreetMap for a given airport. Historically this fetch was only
   ever kicked off by the route creator (routes.js) or the port editor
   (port-editor.js), i.e. only for whichever specific airports the player
   happened to click into — so this debug view showed a full taxiway
   network at, say, HEL (if the player had opened it in the port editor
   earlier that session) and nothing but bare runway centerlines
   everywhere else, which looked like "it only works at some airports"
   even though the drawing code itself was always airport-agnostic. Fixed
   by having enableRunwayDebug() below kick off the same fetch for every
   one of the 254 airports itself (throttled, not all at once — see
   _kickOffAllAirportTaxiwayFetches) the first time debug is turned on,
   and by live-patching each airport's own layer group in place as its
   fetch resolves (see the onTaxiwayDataUpdated subscription below) —
   so every airport ends up drawn exactly the same way, on the same
   timeline, the very first time this is enabled, and airports the
   player already visited (cached in localStorage from a prior session)
   still show up instantly as before.

   Toggled from Settings -> "Show runways (debug)". Built once (all ~250
   airports) and cached as a single L.layerGroup containing one
   sub-layerGroup per airport, so toggling on/off after the first time is
   just add/removeLayer — no rebuild cost — while still allowing any
   single airport's sub-group to be refreshed in place when its real
   taxiway data arrives. */

const RUNWAY_DEBUG_COLORS = {
  centerline: '#4fd1c5',
  threshold: '#f2b33d',
  gate: '#7ea8ff',
  taxiway: '#c084fc',
  taxilane: '#f472b6',
  parking: '#34d399',
  runwayExit: '#fbbf24',
};

let _runwayDebugLayerGroup = null; // built lazily on first enable, then cached
let _runwayDebugAirportGroups = new Map(); // iata -> L.layerGroup, one per airport, each a sub-layer of _runwayDebugLayerGroup
let _runwayDebugEnabled = false;
let _runwayDebugFetchesKicked = false; // true once we've queued a background OSM taxiway fetch for every airport (only ever done once per browser session)
const RUNWAY_DEBUG_FETCH_CONCURRENCY = 6; // a handful at a time, not all 254 at once — be polite to the public Overpass endpoints

function _runwayStripKey(d) {
  // Every physical strip yields two reciprocal directions sharing the same
  // pair of endpoints — de-dupe on that pair so each strip's centerline is
  // only drawn once, not twice.
  return [d.threshold.join(','), d.farEnd.join(',')].sort().join('|');
}

function _buildRunwayDebugLayersForAirport(ap) {
  const layers = [];
  const directions = runwaysForAirport(ap.iata);
  const ground = (typeof groundObjectsForAirport === 'function') ? groundObjectsForAirport(ap.iata) : { gates: [], parkingPositions: [], taxiways: [], taxilanes: [], runwayExits: [] };

  const drawnStrips = new Set();
  directions.forEach(d => {
    const key = _runwayStripKey(d);
    if (drawnStrips.has(key)) return;
    drawnStrips.add(key);
    layers.push(L.polyline([d.threshold, d.farEnd], {
      pane: 'runwayDebugPane',
      color: RUNWAY_DEBUG_COLORS.centerline,
      weight: 4,
      opacity: 0.85,
      dashArray: '10,6',
      interactive: false,
    }));
  });

  directions.forEach(d => {
    const marker = L.circleMarker(d.threshold, {
      pane: 'runwayDebugPane',
      radius: 6,
      color: RUNWAY_DEBUG_COLORS.threshold,
      weight: 2,
      fillColor: RUNWAY_DEBUG_COLORS.threshold,
      fillOpacity: 0.9,
      interactive: false,
    });
    marker.bindTooltip(`${d.id} · hdg ${Math.round(d.heading)}°`, {
      permanent: true,
      direction: 'top',
      offset: [0, -6],
      className: 'runway-debug-tooltip',
    });
    layers.push(marker);
  });

  // Taxiways — real OSM way geometry, unsimplified.
  (ground.taxiways || []).forEach(tw => {
    if (!tw.geometry || tw.geometry.length < 2) return;
    layers.push(L.polyline(tw.geometry, {
      pane: 'runwayDebugPane', color: RUNWAY_DEBUG_COLORS.taxiway, weight: 3, opacity: 0.8, interactive: false,
    }).bindTooltip(`TAXIWAY: ${tw.ref || tw.osmId}`, { permanent: false, className: 'runway-debug-tooltip' }));
  });

  // Taxilanes — real OSM way geometry.
  (ground.taxilanes || []).forEach(tl => {
    if (!tl.geometry || tl.geometry.length < 2) return;
    layers.push(L.polyline(tl.geometry, {
      pane: 'runwayDebugPane', color: RUNWAY_DEBUG_COLORS.taxilane, weight: 2, opacity: 0.7, dashArray: '2,5', interactive: false,
    }).bindTooltip(`TAXILANE: ${tl.ref || tl.osmId}`, { permanent: false, className: 'runway-debug-tooltip' }));
  });

  // Runway exits — real intersection points between existing runway
  // geometry and a real OSM taxiway (computed by the OSM importer, never
  // by this file).
  (ground.runwayExits || []).forEach(exit => {
    if (!exit.coordinate) return;
    layers.push(L.circleMarker(exit.coordinate, {
      pane: 'runwayDebugPane', radius: 5, color: RUNWAY_DEBUG_COLORS.runwayExit, weight: 2, fillColor: RUNWAY_DEBUG_COLORS.runwayExit, fillOpacity: 0.9, interactive: false,
    }).bindTooltip(`EXIT: ${exit.runway}`, { permanent: false, className: 'runway-debug-tooltip' }));
  });

  // Parking positions — real OSM stop points (never a gate coordinate).
  (ground.parkingPositions || []).forEach(pp => {
    if (!pp.stopPoint) return;
    layers.push(L.circleMarker(pp.stopPoint, {
      pane: 'runwayDebugPane', radius: 6, color: RUNWAY_DEBUG_COLORS.parking, weight: 2, fillColor: RUNWAY_DEBUG_COLORS.parking, fillOpacity: 0.9, interactive: false,
    }).bindTooltip(`PARKING: ${pp.ref || pp.osmId}`, { permanent: false, className: 'runway-debug-tooltip' }));
  });

  // Gates — real OSM terminal/passenger position, metadata only, never
  // used as an aircraft stop coordinate (see js/data/taxi-graph.js).
  (ground.gates || []).forEach(g => {
    layers.push(L.circleMarker([g.lat, g.lon], {
      pane: 'runwayDebugPane', radius: 5, color: RUNWAY_DEBUG_COLORS.gate, weight: 2, fillColor: RUNWAY_DEBUG_COLORS.gate, fillOpacity: 0.9, interactive: false,
    }).bindTooltip(`GATE: ${g.ref || g.osmId}`, { permanent: false, className: 'runway-debug-tooltip runway-debug-tooltip-gate' }));
  });

  return layers;
}

function _buildAllRunwayDebugLayers() {
  const group = L.layerGroup();
  _runwayDebugAirportGroups = new Map();
  AIRPORTS.forEach(ap => {
    const airportGroup = L.layerGroup();
    _buildRunwayDebugLayersForAirport(ap).forEach(l => airportGroup.addLayer(l));
    _runwayDebugAirportGroups.set(ap.iata, airportGroup);
    group.addLayer(airportGroup);
  });
  return group;
}

/* Re-draws exactly one airport's debug layers from whatever ground data
   is currently known for it (real OSM taxiways/taxilanes if fetched by
   now, still nothing if not) and swaps them into that airport's existing
   sub-layerGroup in place — cheap, and doesn't touch any other airport's
   layers or require rebuilding/re-adding the whole ~250-airport group. */
function _rebuildAirportDebugGroup(ap) {
  let airportGroup = _runwayDebugAirportGroups.get(ap.iata);
  if (!airportGroup) {
    airportGroup = L.layerGroup();
    _runwayDebugAirportGroups.set(ap.iata, airportGroup);
    if (_runwayDebugLayerGroup) _runwayDebugLayerGroup.addLayer(airportGroup);
  } else {
    airportGroup.clearLayers();
  }
  _buildRunwayDebugLayersForAirport(ap).forEach(l => airportGroup.addLayer(l));
}

/* Queues fetchTaxiwaysForAirport (js/data/osm-taxiway-fetch.js) for
   every one of the 254 airports, a few at a time rather than all at
   once, so this debug view ends up showing real taxiway/taxilane
   geometry for every airport that has it on OpenStreetMap — not just
   whichever airports the player happened to visit via the route creator
   or port editor first (which is the actual reason this used to look
   like it "only worked" at a handful of airports). Airports already
   fetched/cached (from an earlier session, or from the player using the
   route creator/port editor) resolve instantly via that function's own
   cache and cost nothing extra here. Only ever queued once per browser
   session. */
function _kickOffAllAirportTaxiwayFetches() {
  if (_runwayDebugFetchesKicked) return;
  if (typeof fetchTaxiwaysForAirport !== 'function' || typeof AIRPORTS === 'undefined') return;
  _runwayDebugFetchesKicked = true;
  const queue = AIRPORTS.map(ap => ap.iata);
  let idx = 0;
  function next() {
    if (idx >= queue.length) return;
    const iata = queue[idx++];
    fetchTaxiwaysForAirport(iata).finally(next);
  }
  for (let i = 0; i < RUNWAY_DEBUG_FETCH_CONCURRENCY; i++) next();
}

/* Whenever ANY airport's taxiway fetch settles — whether it's this
   file's own bulk fetch above, or one kicked off independently by the
   route creator/port editor — refresh just that one airport's debug
   layers in place, so real taxiway/taxilane geometry appears on the
   debug view live as it arrives, with no need to toggle debug off and
   back on. Subscribed unconditionally (not just while enabled): updating
   a layerGroup that isn't currently on the map is free, and it means
   airport groups built later (or the very first enable, if some fetches
   already resolved before that) are current immediately rather than
   racing the fetch. */
if (typeof onTaxiwayDataUpdated === 'function') {
  onTaxiwayDataUpdated((iata) => {
    if (!_runwayDebugLayerGroup) return; // nothing built yet — the eventual first build will read current data anyway
    const ap = (typeof AIRPORTS !== 'undefined') ? AIRPORTS.find(a => a.iata === iata) : null;
    if (ap) _rebuildAirportDebugGroup(ap);
  });
}

function enableRunwayDebug() {
  if (_runwayDebugEnabled) return;
  if (!_runwayDebugLayerGroup) _runwayDebugLayerGroup = _buildAllRunwayDebugLayers();
  _runwayDebugLayerGroup.addTo(map);
  _runwayDebugEnabled = true;
  _kickOffAllAirportTaxiwayFetches();
}
function disableRunwayDebug() {
  if (!_runwayDebugEnabled) return;
  if (_runwayDebugLayerGroup) map.removeLayer(_runwayDebugLayerGroup);
  _runwayDebugEnabled = false;
}
function setRunwayDebugEnabled(on) {
  if (on) enableRunwayDebug(); else disableRunwayDebug();
}
function isRunwayDebugEnabled() { return _runwayDebugEnabled; }

const runwayDebugToggleEl = document.getElementById('runwayDebugToggle');
if (runwayDebugToggleEl) {
  runwayDebugToggleEl.addEventListener('change', () => setRunwayDebugEnabled(runwayDebugToggleEl.checked));
}

/* ---------------- Manual verification helper: Helsinki-Vantaa (HEL/EFHK) ----------------
   Not called automatically anymore. Runway points are only ever shown now
   during active route creation (see "Route-creator clickable runway
   points" below) or via the Settings "Show runways" toggle — never forced
   on by default. This function is kept as a console-callable sanity
   check (run `initRunwayDebugBootTest()` in devtools any time) for
   re-verifying the real HEL geometry against the map/satellite imagery. */
function initRunwayDebugBootTest() {
  console.log('[RUNWAY DEBUG] map:', !!map, 'AIRPORTS:', typeof AIRPORTS !== 'undefined' ? AIRPORTS.length : 'undefined');
  if (typeof AIRPORTS === 'undefined' || !AIRPORTS.length) {
    console.log('[RUNWAY DEBUG] ABORT — AIRPORTS not loaded.');
    return;
  }

  const hel = AIRPORTS.find(a => a.iata === 'HEL');
  console.log('[RUNWAY DEBUG] test airport HEL:', hel);
  const helDirections = hel ? runwaysForAirport('HEL') : [];
  console.log('[RUNWAY DEBUG] HEL runways (real data):', helDirections.length, helDirections);

  enableRunwayDebug(); // whole map, not just HEL — unconditional for this verification step
  if (runwayDebugToggleEl) runwayDebugToggleEl.checked = true;

  if (!hel || !helDirections.length) {
    console.log('[RUNWAY DEBUG] ABORT before fitBounds — no HEL ground data found.');
    return;
  }

  const allPoints = [];
  helDirections.forEach(d => { allPoints.push(d.threshold, d.farEnd); });
  map.fitBounds(L.latLngBounds(allPoints), { padding: [80, 80] });
  console.log('[RUNWAY DEBUG] map.fitBounds() executed over HEL — compare the three teal centerlines against Helsinki-Vantaa\'s real runways (04L/22R, 04R/22L, 15/33) on the satellite/tile layer.');
}

/* ---------------- Route-creator selection highlight ----------------
   Independent of the bulk "Show runways" toggle above — while the route
   creator's runway dropdowns are being used, this highlights exactly
   which runway is currently selected for departure/arrival (bright,
   thick, its own "DEPARTURE"/"ARRIVAL: <id> selected" label) so it's
   obvious which one you picked even with the bulk debug view switched
   off. Called from tickets.js on every runway <select> change.

/* For the ARRIVAL role, when `detailed` is true, this also draws the
   approach point (where final approach begins), the landing point (real
   touchdown point on the centerline), and a calculated taxi-route preview
   to a dot — the same points that get spliced into the aircraft's actual
   flight path at publish time (see tickets.js). `detailed` defaults to
   false: this extra layer is meant for genuinely inspection-y contexts
   (the ticket modal's route preview) where seeing the raw calculation is
   useful, not for the normal interactive "click a runway while drawing a
   route" flow, where it used to fire unconditionally and — being
   arrival-only, using whichever dot happens to be primary rather than
   the one actually picked, and never refreshed once a background OSM
   taxiway fetch resolves — looked like a stale, arrival-specific bug
   next to departure's plain (and always-live) taxi-line preview. The
   real functional taxi-out/taxi-in lines (routeDraft.depTaxiLine /
   arrTaxiLine, drawn by routes.js) are unaffected either way — this
   function has only ever been a reference overlay on top of them. */
const _runwayHighlightLayers = { dep: null, arr: null };
const RUNWAY_HIGHLIGHT_COLORS = { dep: '#4caf6d', arr: '#e4572e' };

function highlightRunwaySelection(role, iata, runwayId, ap, detailed, dot) {
  clearRunwayHighlight(role);
  if (!runwayId) return;
  const dir = runwayDirectionById(iata, runwayId);
  if (!dir) return;
  const color = RUNWAY_HIGHLIGHT_COLORS[role] || '#ffffff';
  const group = L.layerGroup();
  // The clicked point (dir.threshold — the only thing actually clickable
  // to pick a runway, see showDraftRunwayPoints below) is always the
  // line's start. For an ARRIVAL runway, the line ends at the runway's
  // midpoint rather than its physical far end: that's the same point
  // getRunwayRolloutEndPoint (js/data/runways.js) now assumes the
  // aircraft exits the runway at, so the highlight actually matches what
  // gets modeled/taxied, instead of implying the full runway length is
  // used every time. A departure runway's line still runs the full
  // strip — takeoff roll/liftoff distance is a separate, much shorter
  // concept (getRunwayLiftoffPoint) that this line was never meant to
  // represent either way.
  const lineEnd = role === 'arr' ? getRunwayMidpoint(dir) : dir.farEnd;
  group.addLayer(L.polyline([dir.threshold, lineEnd], {
    pane: 'runwayDebugPane',
    color,
    weight: 7,
    opacity: 0.9,
    interactive: false,
  }));
  const marker = L.circleMarker(dir.threshold, {
    pane: 'runwayDebugPane',
    radius: 9,
    color,
    weight: 3,
    fillColor: color,
    fillOpacity: 0.95,
    interactive: false,
  });
  marker.bindTooltip(`${role === 'dep' ? 'DEPARTURE' : 'ARRIVAL'}: ${dir.id} selected`, {
    permanent: true,
    direction: 'top',
    offset: [0, -10],
    className: 'runway-debug-tooltip runway-debug-tooltip-selected',
  });
  group.addLayer(marker);

  if (role === 'arr' && detailed) {
    const approachPoint = getRunwayApproachPoint(dir);
    const landingPoint = getRunwayLandingPoint(dir);
    const fallbackRolloutEnd = getRunwayRolloutEndPoint(dir, landingPoint);
    const rolloutEndPoint = (typeof resolveRunwayExitPoint === 'function')
      ? resolveRunwayExitPoint(iata, dir, fallbackRolloutEnd, landingPoint)
      : fallbackRolloutEnd;
    group.addLayer(L.polyline([approachPoint, dir.threshold], {
      pane: 'runwayDebugPane', color, weight: 2, opacity: 0.7, dashArray: '4,6', interactive: false,
    }));
    group.addLayer(L.circleMarker(approachPoint, {
      pane: 'runwayDebugPane', radius: 6, color, weight: 2, fillColor: '#ffffff', fillOpacity: 0.9, interactive: false,
    }).bindTooltip('APPROACH', { permanent: true, direction: 'top', className: 'runway-debug-tooltip' }));
    group.addLayer(L.circleMarker(landingPoint, {
      pane: 'runwayDebugPane', radius: 6, color, weight: 2, fillColor: color, fillOpacity: 1, interactive: false,
    }).bindTooltip('LANDING POINT', { permanent: true, direction: 'bottom', className: 'runway-debug-tooltip' }));

    // The calculated taxi route to a dot — real taxiway-graph waypoints if
    // this airport has real ground data, otherwise a straight-line
    // fallback (js/data/taxi-graph.js's dotsForAirport). Uses the actual
    // dot the draft has selected when the caller has one (so this matches
    // what will actually be published); falls back to the airport's
    // primary dot only when no specific selection is known yet.
    const previewDot = dot || ((typeof primaryDotForAirport === 'function') ? primaryDotForAirport(iata) : null);
    if (previewDot) {
      const taxiPath = (typeof buildGroundTaxiPoints === 'function')
        ? buildGroundTaxiPoints(iata, previewDot, rolloutEndPoint, 'in', dir)
        : [rolloutEndPoint, previewDot.stopPoint];
      if (taxiPath && taxiPath.length > 1) {
        group.addLayer(L.polyline(taxiPath, {
          pane: 'runwayDebugPane', color, weight: 4, opacity: 0.85, dashArray: '1,6', interactive: false,
        }));
        const gateStop = taxiPath[taxiPath.length - 1];
        group.addLayer(L.circleMarker(gateStop, {
          pane: 'runwayDebugPane', radius: 7, color, weight: 3, fillColor: '#ffffff', fillOpacity: 1, interactive: false,
        }).bindTooltip('CALCULATED TAXI ROUTE → DOT', { permanent: true, direction: 'right', className: 'runway-debug-tooltip' }));
      }
    }
  }

  group.addTo(map);
  _runwayHighlightLayers[role] = group;
}

function clearRunwayHighlight(role) {
  if (_runwayHighlightLayers[role]) {
    map.removeLayer(_runwayHighlightLayers[role]);
    _runwayHighlightLayers[role] = null;
  }
}
function clearAllRunwayHighlights() {
  clearRunwayHighlight('dep');
  clearRunwayHighlight('arr');
}

/* ---------------- Route-creator clickable runway points ----------------
   This is the ONLY place runway points are visible by default now — they
   appear at exactly the two airports involved in the route currently
   being drawn (routes.js), for exactly as long as route creation is
   active, and disappear the moment it ends (published or cancelled). The
   "Show runways" debug toggle above is a separate, independent, opt-in
   dev view of every airport at once; this is not that.

   Clicking one of these calls back into routes.js with the real runway
   `direction` the player picked (see runwaysForAirport in runways.js) —
   routes.js is responsible for what that selection actually does to the
   draft (taxi line, route start point, etc). This file only owns drawing
   the clickable points and their "you're hovering/picked this one" look. */
const _draftRunwayMarkers = { dep: [], arr: [] };

function showDraftRunwayPoints(role, iata, onPick) {
  clearDraftRunwayPoints(role);
  const directions = runwaysForAirport(iata);
  const color = RUNWAY_HIGHLIGHT_COLORS[role] || RUNWAY_DEBUG_COLORS.threshold;
  directions.forEach(dir => {
    const marker = L.circleMarker(dir.threshold, {
      pane: 'runwayDebugPane',
      radius: 8,
      color,
      weight: 2,
      fillColor: color,
      fillOpacity: 0.85,
      interactive: true,
    });
    marker.bindTooltip(`${dir.id} — click to ${role === 'dep' ? 'depart from' : 'land on'} this runway`, {
      direction: 'top',
      offset: [0, -8],
      className: 'runway-debug-tooltip',
    });
    marker.on('mouseover', () => marker.setStyle({ radius: 11 }));
    marker.on('mouseout', () => marker.setStyle({ radius: 8 }));
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      onPick(dir);
    });
    marker.addTo(map);
    _draftRunwayMarkers[role].push(marker);
  });
}

function clearDraftRunwayPoints(role) {
  _draftRunwayMarkers[role].forEach(m => map.removeLayer(m));
  _draftRunwayMarkers[role] = [];
}

function clearAllDraftRunwayPoints() {
  clearDraftRunwayPoints('dep');
  clearDraftRunwayPoints('arr');
}

/* ---------------- Route-creator clickable ground "dots" ----------------
   The parking-stand dots the player picks at the very start of route
   creation (departure) and right after choosing the arrival runway (the
   "red dot") — see js/data/taxi-graph.js's dotsForAirport for what a dot
   actually is (real parking data, which now includes anything the player
   placed via the Edit Port Points menu — there is no other fallback) and
   routes.js for how picking one drives the draft forward, and for how an
   airport with none skips this step entirely rather than showing nothing
   clickable. Departure dots are drawn green, matching the departure
   runway color; the arrival dot is drawn red/orange, matching the
   arrival runway color and the "red dot" the player was told to look
   for. */
const _draftDotMarkers = { dep: [], arr: [] };
const DOT_RADIUS = 9;

function showDraftDots(role, iata, onPick) {
  clearDraftDots(role);
  const dots = (typeof dotsForAirport === 'function') ? dotsForAirport(iata) : [];
  const color = RUNWAY_HIGHLIGHT_COLORS[role] || '#ffffff';
  dots.forEach((dot, idx) => {
    const marker = L.circleMarker(dot.stopPoint, {
      pane: 'runwayDebugPane',
      radius: DOT_RADIUS,
      color,
      weight: 2,
      fillColor: color,
      fillOpacity: 0.95,
      interactive: true,
    });
    const label = role === 'arr'
      ? 'Parking spot — click to land and park here'
      : (dots.length > 1 ? `Parking spot ${idx + 1} — click to depart from here` : 'Parking spot — click to depart from here');
    marker.bindTooltip(label, { direction: 'top', offset: [0, -10], className: 'runway-debug-tooltip' });
    marker.on('mouseover', () => marker.setStyle({ radius: DOT_RADIUS + 3 }));
    marker.on('mouseout', () => marker.setStyle({ radius: DOT_RADIUS }));
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      onPick(dot);
    });
    marker.addTo(map);
    _draftDotMarkers[role].push(marker);
  });
}

function clearDraftDots(role) {
  _draftDotMarkers[role].forEach(m => map.removeLayer(m));
  _draftDotMarkers[role] = [];
}

function clearAllDraftDots() {
  clearDraftDots('dep');
  clearDraftDots('arr');
}
