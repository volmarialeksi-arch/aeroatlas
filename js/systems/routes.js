/* ================================================================
   Route creation flow: click a destination, drag the outbound
   line into shape, pick its departure time (see the estimated
   arrival), then draw the return leg the same way and pick its
   departure time (which can't be earlier than the outbound
   flight's estimated arrival) before handing off to the
   ticket/schedule modal (tickets.js).
   ================================================================ */
/* ---------------- Route creation ----------------
   Flow:
   1. picking-departure-dot — select one of the dots (parking stands) at
      your own airport. This is where the aircraft actually sits between
      flights, and where the taxi-out to the runway will start from. If
      your airport has no runway data at all, there's nothing to taxi
      to/from, so this step (and the next) is skipped entirely and route
      creation drops straight into picking-destination, same as before
      runways existed in this game.
   2. picking-departure-runway — pick your airport's runway. The fastest
      taxi route from the dot you picked to this runway (following real
      taxiways when the airport has them, otherwise a straight line) is
      drawn immediately.
   3. picking-destination — click the airport you want to fly to (the
      "arrival field"). No flight line is drawn yet at this point.
   4. picking-arrival-runway — clicking the destination airport doesn't
      draw the flight line either: it just reveals that airport's
      clickable runway points. Pick the runway you want to land on. (If
      the destination has no runway data, this step and the next are
      skipped and the flow drops straight into adjusting with a plain
      airport-to-airport line, exactly like an airport with no runways
      always has.)
   5. picking-arrival-dot — select the red dot at the arrival airport —
      the stand where the aircraft will park and wait for its return
      flight. Selecting it is what finally computes the fastest route
      from the runway to that dot (following real taxiways when
      available) AND draws the flight line itself, moving the flow into
      adjusting.
   6. adjusting — drag the line to bend it into a custom path. Small handles
      sit on the line: drag a handle at an existing bend to move it, or drag
      the small dot at the middle of any segment to create a new bend there.
      Click "Done" when you're happy with it.
   7. outbound-time — pick the outbound departure time. The estimated
      arrival time (based on flight duration) is shown live.
   8. return-adjusting — draw/adjust the return leg exactly the same way as
      the outbound leg (starts as a straight line from the destination back
      home; drag it into shape). The return leg reuses the same two dots
      and the same two runways picked above — no need to pick them again.
      Click "Done" when you're happy with it.
   9. return-time — pick the return departure time. It can't be set earlier
      than the outbound flight's estimated arrival time.
   10. Ticket & schedule modal — set fares per direction, confirm the
      departure schedule, and lock in the route (tickets.js). */
let routeDraft = null;
const routeToolbar = document.getElementById('routeToolbar');
const routeToolbarHint = document.getElementById('routeToolbarHint');
const routeDistanceEl = document.getElementById('routeDistance');
const routeDistanceRow = document.getElementById('routeDistanceRow');
const routeToolbarBtns = document.getElementById('routeToolbarBtns');
const routeUndoBtn = document.getElementById('routeUndoBtn');
const routeCancelBtn = document.getElementById('routeCancelBtn');
const routeDoneBtn = document.getElementById('routeDoneBtn');

const routeTimePanel = document.getElementById('routeTimePanel');
const routeTimeLabel = document.getElementById('routeTimeLabel');
const routeTimeInput = document.getElementById('routeTimeInput');
const routeTimeEstimate = document.getElementById('routeTimeEstimate');
const routeTimeError = document.getElementById('routeTimeError');
const routeTimeBtns = document.getElementById('routeTimeBtns');
const routeTimeBackBtn = document.getElementById('routeTimeBackBtn');
const routeTimeCancelBtn = document.getElementById('routeTimeCancelBtn');
const routeTimeNextBtn = document.getElementById('routeTimeNextBtn');
const routeTaxiwayStatusEl = document.getElementById('routeTaxiwayStatus');

/* Live, visible "is real taxiway data available for this airport right
   now" indicator — never requires opening devtools to know why a taxi
   line is (or isn't) following real taxiways. Shows status for whichever
   airport is currently relevant to the draft's stage (home while picking
   a departure dot/runway, destination from the moment it's picked
   onward), and re-evaluates itself every time a background OSM fetch
   settles (see the onTaxiwayDataUpdated subscription below). */
function relevantTaxiwayIata() {
  if (!routeDraft) return null;
  const stage = routeDraft.stage;
  if (stage === 'return-picking-departure-runway') return routeDraft.destAp.iata;
  if (stage === 'return-picking-arrival-runway' || stage === 'return-picking-arrival-dot'
    || stage === 'return-adjusting' || stage === 'return-time') return routeDraft.homeAp.iata;
  if (routeDraft.destAp && stage !== 'picking-destination') return routeDraft.destAp.iata;
  return routeDraft.homeAp.iata;
}

function updateRouteTaxiwayStatus() {
  if (!routeTaxiwayStatusEl) return;
  const iata = relevantTaxiwayIata();
  if (!iata || typeof taxiwayFetchStatus !== 'function') {
    routeTaxiwayStatusEl.style.display = 'none';
    return;
  }
  const st = taxiwayFetchStatus(iata);
  routeTaxiwayStatusEl.classList.remove('loading', 'success', 'failed');
  if (st.status === 'loading') {
    routeTaxiwayStatusEl.textContent = `Checking OpenStreetMap for real taxiways at ${iata}…`;
    routeTaxiwayStatusEl.classList.add('loading');
  } else if (st.status === 'success') {
    routeTaxiwayStatusEl.textContent = st.wayCount > 0
      ? `${iata}: ${st.wayCount} real taxiway segment${st.wayCount === 1 ? '' : 's'} found — taxi lines follow them`
      : `${iata}: OpenStreetMap has no taxiways mapped here yet — using straight lines`;
    routeTaxiwayStatusEl.classList.add('success');
  } else if (st.status === 'failed') {
    routeTaxiwayStatusEl.textContent = `${iata}: couldn't reach OpenStreetMap (retrying automatically) — using straight lines for now`;
    routeTaxiwayStatusEl.classList.add('failed');
  } else {
    routeTaxiwayStatusEl.style.display = 'none';
    return;
  }
  routeTaxiwayStatusEl.style.display = '';
}

if (typeof onTaxiwayDataUpdated === 'function') {
  onTaxiwayDataUpdated(() => { updateRouteTaxiwayStatus(); if (typeof updatePortEditorTaxiwayStatus === 'function') updatePortEditorTaxiwayStatus(); });
}

const routeVertexIcon = L.divIcon({ className: 'route-vertex-handle', iconSize: [14, 14] });
const routeMidIcon = L.divIcon({ className: 'route-mid-handle', iconSize: [10, 10] });
const TAXI_LINE_STYLE = { pane: 'runwayDebugPane', color: '#f2b33d', weight: 3, opacity: 0.8, dashArray: '3,7', interactive: false };

function beginRouteCreation(uid, ap, marker) {
  if (typeof portEditState !== 'undefined' && portEditState) return; // can't draw a route while editing port points
  const f = fleet.find(x => x.uid === uid);
  if (!f) return;
  const type = getAircraftType(f.typeId);
  closeShop();
  infoPanel.classList.remove('visible');

  const homeHasRunways = runwaysForAirport(ap.iata).length > 0;
  const homeHasDots = homeHasRunways && (typeof dotsForAirport === 'function') && dotsForAirport(ap.iata).length > 0;

  routeDraft = {
    uid,
    typeId: f.typeId,
    homeAp: ap,
    homeMarker: marker,
    maxRangeNM: type.rangeMax,
    minRangeNM: type.rangeMin,
    stage: !homeHasRunways ? 'picking-destination' : (homeHasDots ? 'picking-departure-dot' : 'picking-departure-runway'),
    outPoints: [[ap.lat, ap.lon]], // always starts exactly under your airport's marker
    inPoints: [],
    destAp: null,
    destMarker: null,
    outBuilt: null,
    inBuilt: null,
    outDeparture: null,
    outArrivalMinutesRaw: null,
    retDeparture: null,
    retArrivalMinutesRaw: null,
    outPreviewLine: L.polyline([[ap.lat, ap.lon]], { color: '#f2b33d', weight: 3, opacity: 0.9 }).addTo(map)
      .on('click', onRouteLineClick),
    inPreviewLine: L.polyline([], { color: '#4fd1c5', weight: 3, opacity: 0.9, dashArray: '6,6' }).addTo(map)
      .on('click', onRouteLineClick),
    vertexHandles: [],
    midHandles: [],
    _overRange: false,
    _pendingDepartMinutesRaw: null,
    _pendingArrivalMinutesRaw: null,
    // Runway selection made by clicking a runway point directly on the map
    // (see onDraftDepartureRunwayClick/onDraftArrivalRunwayClick below) —
    // `departureRunway`/`arrivalRunway` hold the full direction object
    // (threshold/farEnd/heading/etc, from runways.js), the *Id fields hold
    // just the string id so the ticket modal's dropdowns (tickets.js) can
    // stay in sync with whatever was picked here. These are the OUTBOUND
    // leg's picks; the return leg gets its own separate picks below —
    // real airports don't necessarily depart and arrive on the same
    // runway both ways (wind direction changes, etc), so the return trip
    // is walked through the exact same way the outbound trip was, not
    // just assumed to reuse these.
    departureRunway: null,
    arrivalRunway: null,
    departureRunwayId: null,
    arrivalRunwayId: null,
    // The ground stands ("dots") picked while drawing the OUTBOUND leg —
    // see js/data/taxi-graph.js's dotsForAirport. `departureDot` (home)
    // is reused for the return leg's arrival (that's just where the
    // aircraft's actual home stand is); `arrivalDot` (destination) is
    // reused as the return leg's DEPARTURE point too — the aircraft is
    // sitting right there, having just landed, so there's nothing to
    // re-pick for that end. What genuinely gets re-picked for the return
    // leg is the runway at each end (below) and the arrival dot back
    // home (retArrivalDot) — see beginReturnRoutePicking.
    departureDot: null,
    arrivalDot: null,
    depTaxiLine: null,
    arrTaxiLine: null,
    // Return leg's own picks — deliberately separate fields from the
    // outbound ones above, filled in by beginReturnRoutePicking and its
    // click handlers once the outbound departure time is set.
    retDepartureRunway: null, // at destAp — where the return flight departs from
    retArrivalRunway: null,   // at homeAp — where the return flight lands
    retArrivalDot: null,      // at homeAp — where the aircraft parks after the return flight
    retDepTaxiLine: null,
    retArrTaxiLine: null,
  };
  routeToolbar.classList.add('visible');
  setRouteStageUI();

  if (homeHasRunways) {
    if (homeHasDots) {
      if (typeof showDraftDots === 'function') showDraftDots('dep', ap.iata, onPickDepartureDot);
    } else if (typeof showDraftRunwayPoints === 'function') {
      showDraftRunwayPoints('dep', ap.iata, onDraftDepartureRunwayClick);
    }
    // Kick off a real-taxiway fetch in the background (js/data/osm-taxiway-
    // fetch.js) — doesn't block the flow above at all, but if/when it
    // resolves, upgrades whatever taxi line is already drawn from a
    // straight line to the real taxiway path.
    if (typeof fetchTaxiwaysForAirport === 'function') {
      fetchTaxiwaysForAirport(ap.iata).then(() => refreshDraftTaxiLines());
    }
  }
}

/* Redraws depTaxiLine/arrTaxiLine (if their dot+runway are both already
   chosen) using whatever taxi-graph data is currently available — called
   once a background OSM taxiway fetch resolves, so a line drawn earlier
   as a straight-line fallback gets upgraded to the real taxiway path in
   place, with no user action needed. No-op if there's no active draft or
   nothing to redraw yet. */
function refreshDraftTaxiLines() {
  if (!routeDraft) return;
  if (routeDraft.departureRunway && routeDraft.departureDot) {
    if (routeDraft.depTaxiLine) map.removeLayer(routeDraft.depTaxiLine);
    const pts = buildGroundTaxiPoints(routeDraft.homeAp.iata, routeDraft.departureDot, routeDraft.departureRunway.threshold, 'out', routeDraft.departureRunway);
    routeDraft.depTaxiLine = L.polyline(pts, TAXI_LINE_STYLE).addTo(map);
  }
  if (routeDraft.arrivalRunway && routeDraft.arrivalDot && routeDraft.destAp) {
    if (routeDraft.arrTaxiLine) map.removeLayer(routeDraft.arrTaxiLine);
    const exitPoint = resolveArrivalExitPoint(routeDraft.destAp.iata, routeDraft.arrivalRunway);
    const pts = buildGroundTaxiPoints(routeDraft.destAp.iata, routeDraft.arrivalDot, exitPoint, 'in', routeDraft.arrivalRunway);
    routeDraft.arrTaxiLine = L.polyline(pts, TAXI_LINE_STYLE).addTo(map);
  }
}

/* Picking one of the dots at your own (departure) airport — the ground
   stand the aircraft sits on between flights, and the point the taxi-out
   to the runway starts from. Once picked, the dot markers are cleared and
   the departure runway points appear next. */
function onPickDepartureDot(dot) {
  if (!routeDraft || routeDraft.stage !== 'picking-departure-dot') return;
  routeDraft.departureDot = dot;
  if (typeof clearDraftDots === 'function') clearDraftDots('dep');
  routeDraft.stage = 'picking-departure-runway';
  setRouteStageUI(`Now select the runway you'll depart from at ${routeDraft.homeAp.iata}.`);
  if (typeof showDraftRunwayPoints === 'function') {
    showDraftRunwayPoints('dep', routeDraft.homeAp.iata, onDraftDepartureRunwayClick);
  }
}

/* Builds the ground taxi line for one end of a leg — from a dot to some
   ground reference point such as a runway threshold ('out': dot -> point,
   used for the departure taxi-out) or from that point back to a dot
   ('in': point -> dot, used for the arrival taxi-in after rollout) —
   following the real taxiway graph when available, otherwise falling
   back to a straight line between the two real points (same honesty rule
   as everywhere else in this codebase: never invent geometry that isn't
   backed by either real ground data or the real dot/point coordinates
   themselves). Shared with tickets.js, which uses this same function at
   publish time so the final simulated route matches what was previewed
   here. Dedupes the point where a real graph path already ends/starts
   exactly on the dot, so no zero-length segment gets baked into the
   route (which would otherwise produce a degenerate bearing there).

   `runway` (optional, the full direction object with .threshold/.farEnd
   from runways.js) — when given, pathfinding searches for a taxiway
   connection anywhere along the runway's WHOLE length, not just close to
   `point`. This matters a lot in practice: a runway's real exit taxiway
   can branch off anywhere along it, rarely right at the threshold or at
   one single computed point, so searching only near `point` misses real,
   perfectly-connected taxiway data more often than not. `point` itself
   is still exactly what gets drawn as this leg's fixed end (the actual
   threshold, or the actual computed rollout point) — only the *search*
   uses the fuller runway extent; if the taxiway network is found to
   connect somewhere else along the runway, a short straight connector
   segment from `point` to that connection is included automatically
   (it's just the first/last element of the returned array, exactly like
   the straight-line fallback below). */
function buildGroundTaxiPoints(iata, dot, point, legDirection /* 'out' = dot->point, 'in' = point->dot */, runway) {
  const samePoint = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
  const connectQuery = (runway && runway.threshold && runway.farEnd) ? { a: runway.threshold, b: runway.farEnd } : point;
  if (legDirection === 'out') {
    const real = (typeof taxiPathFromDot === 'function') ? taxiPathFromDot(iata, dot, connectQuery) : null;
    if (real && real.length) {
      const body = samePoint(real[0], dot.stopPoint) ? real.slice(1) : real;
      return [dot.stopPoint, ...body, point];
    }
    return [dot.stopPoint, point];
  }
  const real = (typeof taxiPathToDot === 'function') ? taxiPathToDot(iata, connectQuery, dot) : null;
  if (real && real.length) {
    const body = samePoint(real[real.length - 1], dot.stopPoint) ? real.slice(0, -1) : real;
    return [point, ...body, dot.stopPoint];
  }
  return [point, dot.stopPoint];
}

/* Clicking a runway point at the DEPARTURE airport, after the departure
   dot has been picked: locks in that runway as the departure runway and
   draws the fastest taxi line from the chosen dot to this runway's real
   threshold (following real taxiways when the airport has them). That
   threshold is the point route-drawing will start from (see
   onPickDestinationAirport). The clickable points then disappear — this
   is a one-time choice made at the very start, the same way you'd pick a
   gate before ever taxiing anywhere. */
function onDraftDepartureRunwayClick(direction) {
  if (!routeDraft || routeDraft.stage !== 'picking-departure-runway') return;
  routeDraft.departureRunway = direction;
  routeDraft.departureRunwayId = direction.id;
  if (routeDraft.depTaxiLine) map.removeLayer(routeDraft.depTaxiLine);
  const taxiPoints = routeDraft.departureDot
    ? buildGroundTaxiPoints(routeDraft.homeAp.iata, routeDraft.departureDot, direction.threshold, 'out', direction)
    : [[routeDraft.homeAp.lat, routeDraft.homeAp.lon], direction.threshold];
  routeDraft.depTaxiLine = L.polyline(taxiPoints, TAXI_LINE_STYLE).addTo(map);
  routeDraft.outPoints = [direction.threshold];
  if (typeof highlightRunwaySelection === 'function') {
    highlightRunwaySelection('dep', routeDraft.homeAp.iata, direction.id);
  }
  if (typeof clearDraftRunwayPoints === 'function') clearDraftRunwayPoints('dep');
  routeDraft.stage = 'picking-destination';
  setRouteStageUI(`Departure runway ${direction.id} selected. Now click the airport you want to fly to from ${routeDraft.homeAp.iata}.`);
}

/* Clicking a runway point at the DESTINATION airport: locks in that
   runway as the arrival runway. This alone does NOT draw anything yet —
   see the header flow comment: next comes picking the red dot (if this
   airport has any port points at all — see dotsForAirport), which is
   what actually computes and draws the taxi-in line and the flight line.
   Re-picking a different arrival runway later (once already in
   'adjusting'/beyond) is still allowed and just updates the selection and
   its taxi-in line, reusing whichever dot was already chosen. */
function onDraftArrivalRunwayClick(direction) {
  if (!routeDraft || !routeDraft.destAp) return;
  routeDraft.arrivalRunway = direction;
  routeDraft.arrivalRunwayId = direction.id;
  if (typeof highlightRunwaySelection === 'function') {
    highlightRunwaySelection('arr', routeDraft.destAp.iata, direction.id, routeDraft.destAp);
  }

  if (routeDraft.stage === 'picking-arrival-runway') {
    if (typeof clearDraftRunwayPoints === 'function') clearDraftRunwayPoints('arr');
    const destHasDots = (typeof dotsForAirport === 'function') && dotsForAirport(routeDraft.destAp.iata).length > 0;
    if (destHasDots) {
      routeDraft.stage = 'picking-arrival-dot';
      setRouteStageUI(`Now select the red dot at ${routeDraft.destAp.iata} — where you'll land and park.`);
      if (typeof showDraftDots === 'function') showDraftDots('arr', routeDraft.destAp.iata, onPickArrivalDot);
    } else {
      // No port points exist yet for this airport (none created via the
      // Edit Port Points menu) — nothing to click, so draw the flight
      // line straight away, same graceful fallback as an airport with no
      // runway data at all.
      finalizeArrivalAndDrawFlightLine(null);
    }
  } else {
    // Re-picking after the draft has already moved on: just refresh the
    // taxi-in line using whichever dot is already chosen.
    if (routeDraft.arrivalDot) {
      if (routeDraft.arrTaxiLine) map.removeLayer(routeDraft.arrTaxiLine);
      const exitPoint = resolveArrivalExitPoint(routeDraft.destAp.iata, direction);
      const taxiPoints = buildGroundTaxiPoints(routeDraft.destAp.iata, routeDraft.arrivalDot, exitPoint, 'in', direction);
      routeDraft.arrTaxiLine = L.polyline(taxiPoints, TAXI_LINE_STYLE).addTo(map);
    }
    setRouteStageUI(`Arrival runway ${direction.id} selected.`);
  }
}

/* The point an arrival taxi-in line connects from: the real runway exit
   found from taxiway data if one exists (see js/data/taxi-graph.js's
   resolveRunwayExitPoint — this is what makes the line connect from
   wherever really makes sense along the runway, not necessarily near the
   threshold), otherwise a fixed assumed distance past touchdown
   (getRunwayRolloutEndPoint). Never the bare threshold — an aircraft
   that's just landed doesn't taxi back to the very start of the runway
   it landed on. */
function resolveArrivalExitPoint(iata, direction) {
  const landingPoint = getRunwayLandingPoint(direction);
  const fallback = getRunwayRolloutEndPoint(direction, landingPoint);
  return (typeof resolveRunwayExitPoint === 'function') ? resolveRunwayExitPoint(iata, direction, fallback, landingPoint) : fallback;
}

/* Selecting the red dot at the destination airport — the ground stand
   where the aircraft will land, park, and wait for its return flight. */
function onPickArrivalDot(dot) {
  if (!routeDraft || routeDraft.stage !== 'picking-arrival-dot' || !routeDraft.arrivalRunway) return;
  if (typeof clearDraftDots === 'function') clearDraftDots('arr');
  finalizeArrivalAndDrawFlightLine(dot);
}

/* Shared by both onDraftArrivalRunwayClick (when the destination has no
   port points to pick from) and onPickArrivalDot (when it does): draws
   the taxi-in line (if a dot was given) and, having now got everything
   this leg needs (a departure point/runway and an arrival runway),
   finally draws the flight line and advances the draft into 'adjusting'. */
function finalizeArrivalAndDrawFlightLine(dot) {
  routeDraft.arrivalDot = dot;
  const direction = routeDraft.arrivalRunway;

  if (dot) {
    if (routeDraft.arrTaxiLine) map.removeLayer(routeDraft.arrTaxiLine);
    const exitPoint = resolveArrivalExitPoint(routeDraft.destAp.iata, direction);
    const taxiPoints = buildGroundTaxiPoints(routeDraft.destAp.iata, dot, exitPoint, 'in', direction);
    routeDraft.arrTaxiLine = L.polyline(taxiPoints, TAXI_LINE_STYLE).addTo(map);
  }

  const home = routeDraft.homeAp;
  const startPoint = routeDraft.departureRunway ? routeDraft.departureRunway.threshold : [home.lat, home.lon];
  const straight = [startPoint, direction.threshold];
  const built = buildSmoothRoute(straight);
  if (built.distanceNM <= 0 || built.distanceNM > routeDraft.maxRangeNM) {
    setRouteStageUI(`Too far for this aircraft (max ${routeDraft.maxRangeNM} NM). Cancel and choose a closer airport.`);
    return;
  }
  if (routeDraft.minRangeNM && built.distanceNM < routeDraft.minRangeNM) {
    setRouteStageUI(`Too short for this aircraft (min ${routeDraft.minRangeNM} NM). Cancel and choose a farther airport.`);
    return;
  }
  routeDraft.outPoints = straight;
  routeDraft.stage = 'adjusting';
  setRouteStageUI();
  renderRouteHandles();
}

function isPathStage(stage) { return stage === 'adjusting' || stage === 'return-adjusting'; }
function isTimeStage(stage) { return stage === 'outbound-time' || stage === 'return-time'; }

/* Which leg's points/preview-line the drag handles + Undo/Done act on,
   based on the current stage — 'adjusting' drives the outbound leg,
   'return-adjusting' drives the return leg (same drag-to-adjust flow). */
function activePoints() {
  if (!routeDraft) return null;
  if (routeDraft.stage === 'adjusting') return routeDraft.outPoints;
  if (routeDraft.stage === 'return-adjusting') return routeDraft.inPoints;
  return null;
}
function activePreviewLine() {
  if (!routeDraft) return null;
  if (routeDraft.stage === 'adjusting') return routeDraft.outPreviewLine;
  if (routeDraft.stage === 'return-adjusting') return routeDraft.inPreviewLine;
  return null;
}

function routeStageHints() {
  const home = routeDraft.homeAp.iata;
  const dest = routeDraft.destAp ? routeDraft.destAp.iata : 'the destination';
  return {
    'picking-departure-dot': `Select the dot at ${home} where your aircraft will park.`,
    'picking-departure-runway': `Select the runway you'll depart from at ${home}.`,
    'picking-destination': `Click the airport you want to fly to from ${home}. Range: ${routeDraft.minRangeNM}–${routeDraft.maxRangeNM} NM.`,
    'picking-arrival-runway': `Choose the runway you want to land on at ${dest}.`,
    'picking-arrival-dot': `Select the red dot at ${dest} — where you'll land and park.`,
    'adjusting': `Drag the outbound line to customize the route ${home} → ${dest}, then click Done.`,
    'outbound-time': `Pick the outbound departure time from ${home}.`,
    'return-picking-departure-runway': `Select the runway you'll depart from at ${dest} for the return flight.`,
    'return-picking-arrival-runway': `Select the runway you'll land on at ${home} for the return flight.`,
    'return-picking-arrival-dot': `Select the gate at ${home} where you'll park after the return flight.`,
    'return-adjusting': `Drag the return line to customize the route ${dest} → ${home}, then click Done.`,
    'return-time': `Pick the return departure time from ${dest}.`,
  };
}

function setRouteStageUI(overrideMsg) {
  if (!routeDraft) return;
  const stage = routeDraft.stage;
  routeToolbarHint.textContent = overrideMsg || routeStageHints()[stage] || '';
  updateRouteTaxiwayStatus();

  const pathVisible = isPathStage(stage);
  const timeVisible = isTimeStage(stage);
  routeDistanceRow.style.display = pathVisible ? 'flex' : 'none';
  routeToolbarBtns.style.display = pathVisible ? 'flex' : 'none';
  routeTimePanel.style.display = timeVisible ? 'flex' : 'none';
  routeTimeBtns.style.display = timeVisible ? 'flex' : 'none';

  if (pathVisible) {
    const pts = activePoints();
    routeUndoBtn.disabled = !(pts && pts.length > 2);
    updateRoutePreview();
  } else if (timeVisible) {
    renderTimeStage();
  }
}

/* ---- Draggable adjustment handles (shared by the outbound and return legs) ---- */
function midpointLatLng(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function clearRouteHandles() {
  if (!routeDraft) return;
  routeDraft.vertexHandles.forEach(m => map.removeLayer(m));
  routeDraft.midHandles.forEach(m => map.removeLayer(m));
  routeDraft.vertexHandles = [];
  routeDraft.midHandles = [];
}

function renderRouteHandles() {
  clearRouteHandles();
  if (!routeDraft || !isPathStage(routeDraft.stage)) return;
  const pts = activePoints();
  if (!pts) return;

  // A handle on every interior point (not the two airport endpoints) —
  // drag to move that bend in the route.
  for (let i = 1; i < pts.length - 1; i++) {
    const vm = L.marker(pts[i], { draggable: true, icon: routeVertexIcon, zIndexOffset: 500 }).addTo(map);
    vm.on('drag', (e) => {
      pts[i] = [e.latlng.lat, e.latlng.lng];
      updateRoutePreview();
    });
    vm.on('dragend', () => { setRouteStageUI(); renderRouteHandles(); });
    routeDraft.vertexHandles.push(vm);
  }

  // A small handle at the midpoint of every segment — drag it to create a
  // brand new bend right there.
  for (let i = 0; i < pts.length - 1; i++) {
    const segIndex = i;
    const mid = midpointLatLng(pts[i], pts[i + 1]);
    const mm = L.marker(mid, { draggable: true, icon: routeMidIcon, zIndexOffset: 400 }).addTo(map);
    mm.on('drag', (e) => {
      const preview = pts.slice(0, segIndex + 1).concat([[e.latlng.lat, e.latlng.lng]], pts.slice(segIndex + 1));
      const built = buildSmoothRoute(preview);
      activePreviewLine().setLatLngs(built.points);
    });
    mm.on('dragend', (e) => {
      pts.splice(segIndex + 1, 0, [e.latlng.lat, e.latlng.lng]);
      setRouteStageUI();
      renderRouteHandles();
    });
    routeDraft.midHandles.push(mm);
  }
}

/* Clicking anywhere along the active route line drops a new draggable
   control point exactly where you clicked, so the route can have as many
   bend points as needed instead of just the one midpoint handle per
   segment. Works for whichever leg (outbound/return) is currently being
   adjusted. */
function onRouteLineClick(e) {
  if (!routeDraft || !isPathStage(routeDraft.stage)) return;
  L.DomEvent.stopPropagation(e);
  const pts = activePoints();
  if (!pts) return;
  const clickPt = map.latLngToLayerPoint(e.latlng);
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = map.latLngToLayerPoint(pts[i]);
    const b = map.latLngToLayerPoint(pts[i + 1]);
    const d = L.LineUtil.pointToSegmentDistance(clickPt, a, b);
    if (d < bestDist) { bestDist = d; bestIdx = i; }
  }
  pts.splice(bestIdx + 1, 0, [e.latlng.lat, e.latlng.lng]);
  setRouteStageUI();
  renderRouteHandles();
}

function updateRoutePreview() {
  if (!routeDraft) return;
  const pts = activePoints();
  const line = activePreviewLine();
  if (!pts || !line) return;
  let dist = 0;
  if (pts.length >= 2) {
    const built = buildSmoothRoute(pts);
    line.setLatLngs(built.points);
    dist = built.distanceNM;
  } else {
    line.setLatLngs(pts);
  }
  const maxNM = routeDraft.maxRangeNM || 430;
  const minNM = routeDraft.minRangeNM || 0;
  const overRange = dist > maxNM || (dist > 0 && dist < minNM);
  routeDraft._overRange = isPathStage(routeDraft.stage) ? overRange : false;
  routeDistanceEl.textContent = `${dist.toFixed(1)} / ${maxNM} NM`;
  routeDistanceEl.classList.toggle('over', routeDraft._overRange);
  routeDoneBtn.disabled = !(isPathStage(routeDraft.stage) && !routeDraft._overRange);
}

/* Called from handleAirportMarkerClick when an airport pin is clicked while
   picking a destination (the "arrival field"). This does NOT draw a route
   line yet — it just locks in the destination airport, does a rough
   range sanity check (using the airport's own coordinate as a stand-in,
   since no arrival point is chosen yet), and reveals that airport's
   clickable runway points. The line only gets drawn once the red dot is
   picked afterward — see onPickArrivalDot, which is what actually
   advances the draft into 'adjusting'.

   If the destination has no real runway data at all, there's nothing to
   land on or taxi to, so the runway/dot steps are skipped entirely and
   the flight line is drawn straight away — the same graceful fallback
   this game has always used for the handful of airports with no ground
   data (see routes.js's stage-flow comment at the top of this file). */
function onPickDestinationAirport(ap, marker) {
  if (!routeDraft || routeDraft.stage !== 'picking-destination') return;
  if (ap.iata === routeDraft.homeAp.iata) return;
  const home = routeDraft.homeAp;
  const startPoint = routeDraft.departureRunway ? routeDraft.departureRunway.threshold : [home.lat, home.lon];
  const straight = [startPoint, [ap.lat, ap.lon]];
  const built = buildSmoothRoute(straight);
  if (built.distanceNM <= 0 || built.distanceNM > routeDraft.maxRangeNM) {
    setRouteStageUI(`Too far for this aircraft (max ${routeDraft.maxRangeNM} NM). Pick a closer airport.`);
    return;
  }
  if (routeDraft.minRangeNM && built.distanceNM < routeDraft.minRangeNM) {
    setRouteStageUI(`Too short for this aircraft (min ${routeDraft.minRangeNM} NM). Pick a farther destination.`);
    return;
  }

  routeDraft.destAp = ap;
  routeDraft.destMarker = marker;

  const destHasRunways = runwaysForAirport(ap.iata).length > 0;
  if (!destHasRunways) {
    // No runway data at this destination — fall straight into adjusting
    // with the plain airport-to-airport line, no dots/runways involved.
    routeDraft.outPoints = straight;
    routeDraft.stage = 'adjusting';
    setRouteStageUI();
    renderRouteHandles();
    return;
  }

  routeDraft.stage = 'picking-arrival-runway';
  setRouteStageUI(`Choose the runway you want to land on at ${ap.iata}.`);
  if (typeof showDraftRunwayPoints === 'function') showDraftRunwayPoints('arr', ap.iata, onDraftArrivalRunwayClick);
  if (typeof fetchTaxiwaysForAirport === 'function') {
    fetchTaxiwaysForAirport(ap.iata).then(() => refreshDraftTaxiLines());
  }
}

function handleAirportMarkerClick(ap, marker) {
  if (typeof portEditState !== 'undefined' && portEditState) {
    if (typeof onPortEditorAirportClick === 'function') onPortEditorAirportClick(ap, marker);
    return; // ignore route/info-panel clicks while the port editor is open
  }
  if (routeDraft) {
    if (routeDraft.stage === 'picking-destination' && ap.iata !== routeDraft.homeAp.iata) {
      onPickDestinationAirport(ap, marker);
    }
    return; // ignore other airport clicks while plotting a route
  }
  selectAirport(ap, marker);
}

routeUndoBtn.addEventListener('click', () => {
  if (!routeDraft || !isPathStage(routeDraft.stage)) return;
  const pts = activePoints();
  if (pts && pts.length > 2) {
    pts.splice(pts.length - 2, 1); // drop the most recently added bend
  }
  setRouteStageUI();
  renderRouteHandles();
});

routeCancelBtn.addEventListener('click', () => cancelRouteDraft());
routeTimeCancelBtn.addEventListener('click', () => cancelRouteDraft());

/* Locks in the outbound leg as currently drawn/adjusted, then moves on to
   picking its departure time. */
function finalizeOutboundLeg() {
  if (!routeDraft || routeDraft.stage !== 'adjusting' || !routeDraft.destAp) return;
  const outBuilt = buildSmoothRoute(routeDraft.outPoints);
  if (outBuilt.distanceNM <= 0 || outBuilt.distanceNM > routeDraft.maxRangeNM ||
      (routeDraft.minRangeNM && outBuilt.distanceNM < routeDraft.minRangeNM)) {
    setRouteStageUI(`Route is out of range for this aircraft (${routeDraft.minRangeNM}–${routeDraft.maxRangeNM} NM).`);
    return;
  }
  routeDraft.outBuilt = outBuilt;
  clearRouteHandles();
  routeDraft.stage = 'outbound-time';
  setRouteStageUI();
}

/* ---------------- Return-leg dot/runway picking ----------------
   Mirrors the outbound flow exactly, just starting from the destination
   instead of home: select the runway to depart from at the destination
   (the departure DOT there is never re-picked — the aircraft is sitting
   right where it landed, see routeDraft.arrivalDot), then select the
   runway to land on back home, then — if home has any port points —
   select which one to park at. Graceful fallbacks match the outbound
   flow too: no runway data at an airport skips that airport's picking
   step entirely, same as it always has for the outbound leg. */
function beginReturnRoutePicking() {
  const dest = routeDraft.destAp;
  routeDraft.retDepartureRunway = null;
  routeDraft.retArrivalRunway = null;
  routeDraft.retArrivalDot = null;
  routeDraft.inPoints = [];

  const destHasRunways = runwaysForAirport(dest.iata).length > 0;
  if (!destHasRunways) {
    beginReturnArrivalRunwayPicking();
    return;
  }
  routeDraft.stage = 'return-picking-departure-runway';
  setRouteStageUI(`Select the runway you'll depart from at ${dest.iata} for the return flight.`);
  if (typeof showDraftRunwayPoints === 'function') showDraftRunwayPoints('dep', dest.iata, onReturnDepartureRunwayClick);
}

function onReturnDepartureRunwayClick(direction) {
  if (!routeDraft || routeDraft.stage !== 'return-picking-departure-runway') return;
  routeDraft.retDepartureRunway = direction;
  const dest = routeDraft.destAp;
  if (routeDraft.retDepTaxiLine) map.removeLayer(routeDraft.retDepTaxiLine);
  const dot = routeDraft.arrivalDot; // reused: the aircraft is already sitting here, having just landed
  const taxiPoints = dot
    ? buildGroundTaxiPoints(dest.iata, dot, direction.threshold, 'out', direction)
    : [[dest.lat, dest.lon], direction.threshold];
  routeDraft.retDepTaxiLine = L.polyline(taxiPoints, TAXI_LINE_STYLE).addTo(map);
  if (typeof highlightRunwaySelection === 'function') highlightRunwaySelection('dep', dest.iata, direction.id);
  if (typeof clearDraftRunwayPoints === 'function') clearDraftRunwayPoints('dep');
  beginReturnArrivalRunwayPicking();
}

function beginReturnArrivalRunwayPicking() {
  const home = routeDraft.homeAp;
  const homeHasRunways = runwaysForAirport(home.iata).length > 0;
  if (!homeHasRunways) {
    finalizeReturnRunwaysAndDrawFlightLine(null);
    return;
  }
  routeDraft.stage = 'return-picking-arrival-runway';
  setRouteStageUI(`Select the runway you'll land on at ${home.iata} for the return flight.`);
  if (typeof showDraftRunwayPoints === 'function') showDraftRunwayPoints('arr', home.iata, onReturnArrivalRunwayClick);
}

function onReturnArrivalRunwayClick(direction) {
  if (!routeDraft || !routeDraft.homeAp) return;
  routeDraft.retArrivalRunway = direction;
  const home = routeDraft.homeAp;
  if (typeof highlightRunwaySelection === 'function') highlightRunwaySelection('arr', home.iata, direction.id, home);

  if (routeDraft.stage === 'return-picking-arrival-runway') {
    if (typeof clearDraftRunwayPoints === 'function') clearDraftRunwayPoints('arr');
    const homeHasDots = (typeof dotsForAirport === 'function') && dotsForAirport(home.iata).length > 0;
    if (homeHasDots) {
      routeDraft.stage = 'return-picking-arrival-dot';
      setRouteStageUI(`Select the gate at ${home.iata} where you'll park after the return flight.`);
      if (typeof showDraftDots === 'function') showDraftDots('arr', home.iata, onReturnArrivalDotPick);
    } else {
      finalizeReturnRunwaysAndDrawFlightLine(null);
    }
  } else {
    // Re-picking after the draft has already moved on: just refresh the
    // taxi-in line using whichever dot is already chosen.
    if (routeDraft.retArrivalDot) {
      if (routeDraft.retArrTaxiLine) map.removeLayer(routeDraft.retArrTaxiLine);
      const exitPoint = resolveArrivalExitPoint(home.iata, direction);
      const taxiPoints = buildGroundTaxiPoints(home.iata, routeDraft.retArrivalDot, exitPoint, 'in', direction);
      routeDraft.retArrTaxiLine = L.polyline(taxiPoints, TAXI_LINE_STYLE).addTo(map);
    }
    setRouteStageUI(`Arrival runway ${direction.id} selected.`);
  }
}

function onReturnArrivalDotPick(dot) {
  if (!routeDraft || routeDraft.stage !== 'return-picking-arrival-dot' || !routeDraft.retArrivalRunway) return;
  if (typeof clearDraftDots === 'function') clearDraftDots('arr');
  finalizeReturnRunwaysAndDrawFlightLine(dot);
}

/* Shared by beginReturnArrivalRunwayPicking (when home has no port
   points to pick from, or no runway data at all) and onReturnArrivalDotPick
   (when it does): draws the taxi-in line (if a dot and runway were both
   available) and, having now got everything the return leg needs, draws
   the return flight line and advances into 'return-adjusting' — the
   same drag-to-adjust step the outbound leg already went through. */
function finalizeReturnRunwaysAndDrawFlightLine(dot) {
  routeDraft.retArrivalDot = dot;
  const dest = routeDraft.destAp, home = routeDraft.homeAp;
  const direction = routeDraft.retArrivalRunway; // may be null — home might have no runway data at all

  if (dot && direction) {
    if (routeDraft.retArrTaxiLine) map.removeLayer(routeDraft.retArrTaxiLine);
    const exitPoint = resolveArrivalExitPoint(home.iata, direction);
    const taxiPoints = buildGroundTaxiPoints(home.iata, dot, exitPoint, 'in', direction);
    routeDraft.retArrTaxiLine = L.polyline(taxiPoints, TAXI_LINE_STYLE).addTo(map);
  }

  const startPoint = routeDraft.retDepartureRunway ? routeDraft.retDepartureRunway.threshold : [dest.lat, dest.lon];
  const endPoint = direction ? direction.threshold : [home.lat, home.lon];
  routeDraft.inPoints = [startPoint, endPoint];
  routeDraft.stage = 'return-adjusting';
  setRouteStageUI();
  renderRouteHandles();
}

/* Locks in the return leg as currently drawn/adjusted, then moves on to
   picking its departure time. */
function finalizeReturnLeg() {
  if (!routeDraft || routeDraft.stage !== 'return-adjusting') return;
  const inBuilt = buildSmoothRoute(routeDraft.inPoints);
  if (inBuilt.distanceNM <= 0 || inBuilt.distanceNM > routeDraft.maxRangeNM ||
      (routeDraft.minRangeNM && inBuilt.distanceNM < routeDraft.minRangeNM)) {
    setRouteStageUI(`Return route is out of range for this aircraft (${routeDraft.minRangeNM}–${routeDraft.maxRangeNM} NM).`);
    return;
  }
  routeDraft.inBuilt = inBuilt;
  clearRouteHandles();
  routeDraft.stage = 'return-time';
  setRouteStageUI();
}

routeDoneBtn.addEventListener('click', () => {
  if (!routeDraft) return;
  if (routeDraft.stage === 'adjusting') finalizeOutboundLeg();
  else if (routeDraft.stage === 'return-adjusting') finalizeReturnLeg();
});

/* ---------------- Departure-time steps (outbound-time / return-time) ----------------
   A clock time on its own doesn't say which calendar day it falls on, so
   times here are tracked as "raw" minutes on a single continuous timeline
   that starts at 0 the moment the outbound leg departs — e.g. an outbound
   departure at 11:00 is minute 660, and a 5-hour flight arrives at raw
   minute 960 (16:00 the same day). A return time typed in as a clock time
   is resolved onto that same timeline by resolveDepartureMinutes below: it
   assumes "today" (the outbound departure's day) unless that reading would
   fall before the reference minute, in which case it must mean tomorrow. */
function resolveDepartureMinutes(timeStr, referenceMinutesRaw) {
  const m = parseHHMM(timeStr);
  const refDayStart = Math.floor(referenceMinutesRaw / 1440) * 1440;
  let candidate = refDayStart + m;
  if (candidate < referenceMinutesRaw) candidate += 1440;
  return candidate;
}

function renderTimeStage() {
  if (!routeDraft) return;
  const isReturn = routeDraft.stage === 'return-time';
  const fromAp = isReturn ? routeDraft.destAp : routeDraft.homeAp;
  routeTimeLabel.textContent = isReturn ? `Return departure from ${fromAp.iata}` : `Outbound departure from ${fromAp.iata}`;
  const defaultVal = isReturn
    ? (routeDraft.retDeparture || formatClock(Math.round(routeDraft.outArrivalMinutesRaw || 0) % 1440))
    : (routeDraft.outDeparture || '08:00');
  routeTimeInput.value = defaultVal;
  refreshTimeEstimate();
}

function refreshTimeEstimate() {
  if (!routeDraft || !isTimeStage(routeDraft.stage)) return;
  const isReturn = routeDraft.stage === 'return-time';
  const distNM = isReturn ? routeDraft.inBuilt.distanceNM : routeDraft.outBuilt.distanceNM;
  const durationHours = legFlightTimeHours(distNM, getAircraftType(routeDraft.typeId));
  const timeStr = routeTimeInput.value || '00:00';

  let errorMsg = '';
  let departMinutesRaw;
  if (!isReturn) {
    departMinutesRaw = parseHHMM(timeStr);
  } else {
    departMinutesRaw = resolveDepartureMinutes(timeStr, routeDraft.outArrivalMinutesRaw);
    if (departMinutesRaw < routeDraft.outArrivalMinutesRaw) {
      errorMsg = `The return flight can't depart before the outbound flight arrives (${formatClock(Math.round(routeDraft.outArrivalMinutesRaw) % 1440)}).`;
    }
  }
  const arrivalMinutesRaw = departMinutesRaw + durationHours * 60;
  const arrivalClock = formatClock(Math.round(arrivalMinutesRaw) % 1440);
  const dayNote = Math.floor(arrivalMinutesRaw / 1440) > Math.floor(departMinutesRaw / 1440) ? ' (+1 day)' : '';
  routeTimeEstimate.textContent = `~${formatHoursMinutes(durationHours)} flight · estimated arrival ${arrivalClock}${dayNote}`;
  routeTimeError.textContent = errorMsg;
  routeTimeError.style.display = errorMsg ? 'block' : 'none';
  routeTimeNextBtn.disabled = !!errorMsg;

  routeDraft._pendingDepartMinutesRaw = departMinutesRaw;
  routeDraft._pendingArrivalMinutesRaw = arrivalMinutesRaw;
}

routeTimeInput.addEventListener('input', refreshTimeEstimate);

routeTimeBackBtn.addEventListener('click', () => {
  if (!routeDraft) return;
  if (routeDraft.stage === 'outbound-time') {
    routeDraft.stage = 'adjusting';
    setRouteStageUI();
    renderRouteHandles();
  } else if (routeDraft.stage === 'return-time') {
    routeDraft.stage = 'return-adjusting';
    setRouteStageUI();
    renderRouteHandles();
  }
});

routeTimeNextBtn.addEventListener('click', () => {
  if (!routeDraft || routeTimeNextBtn.disabled) return;
  const timeStr = routeTimeInput.value || '00:00';
  if (routeDraft.stage === 'outbound-time') {
    routeDraft.outDeparture = timeStr;
    routeDraft.outArrivalMinutesRaw = routeDraft._pendingArrivalMinutesRaw;
    beginReturnRoutePicking();
  } else if (routeDraft.stage === 'return-time') {
    routeDraft.retDeparture = timeStr;
    routeDraft.retArrivalMinutesRaw = routeDraft._pendingArrivalMinutesRaw;
    finalizeRouteDraft();
  }
});

function removeRouteDraftLayers() {
  if (!routeDraft) return;
  map.removeLayer(routeDraft.outPreviewLine);
  map.removeLayer(routeDraft.inPreviewLine);
  if (routeDraft.depTaxiLine) map.removeLayer(routeDraft.depTaxiLine);
  if (routeDraft.arrTaxiLine) map.removeLayer(routeDraft.arrTaxiLine);
  if (routeDraft.retDepTaxiLine) map.removeLayer(routeDraft.retDepTaxiLine);
  if (routeDraft.retArrTaxiLine) map.removeLayer(routeDraft.retArrTaxiLine);
  clearRouteHandles();
  if (typeof clearAllDraftRunwayPoints === 'function') clearAllDraftRunwayPoints();
  if (typeof clearAllDraftDots === 'function') clearAllDraftDots();
  if (typeof clearAllRunwayHighlights === 'function') clearAllRunwayHighlights();
}

function cancelRouteDraft() {
  if (!routeDraft) return;
  removeRouteDraftLayers();
  routeToolbar.classList.remove('visible');
  const ap = routeDraft.homeAp, marker = routeDraft.homeMarker;
  routeDraft = null;
  const entry = markerByCode[ap.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
}

function finalizeRouteDraft() {
  routeToolbar.classList.remove('visible');
  openTicketModal(routeDraft);
}


/* Smooth-route geometry builder — lives here because it's only ever
   invoked from the route-drawing flow above (the drag handles call
   it live as you adjust the line, and finalizeOutboundLeg/finalizeReturnLeg
   call it once more to lock in each leg's final path).
*/
function buildSmoothRoute(controlPoints) {
  if (controlPoints.length < 2) return { points: controlPoints.slice(), distanceNM: 0 };

  if (controlPoints.length === 2) {
    const [a, b] = controlPoints;
    const steps = 40;
    const points = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      points.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    return { points, distanceNM: pathLengthNM(points) };
  }

  const refLat = controlPoints.reduce((s, p) => s + p[0], 0) / controlPoints.length;
  const proj = makeProjector(refLat);
  let xy = controlPoints.map(proj.toXY);

  const ITERATIONS = 5;
  for (let it = 0; it < ITERATIONS; it++) {
    const next = [xy[0]];
    for (let i = 0; i < xy.length - 1; i++) {
      const p0 = xy[i], p1 = xy[i + 1];
      const q = [p0[0] * 0.75 + p1[0] * 0.25, p0[1] * 0.75 + p1[1] * 0.25];
      const r = [p0[0] * 0.25 + p1[0] * 0.75, p0[1] * 0.25 + p1[1] * 0.75];
      if (i === 0) next.push(r);              // keep the very first point pinned
      else if (i === xy.length - 2) next.push(q); // keep the very last point pinned
      else next.push(q, r);
    }
    next.push(xy[xy.length - 1]);
    xy = next;
  }

  const points = xy.map(proj.toLatLon);
  const distanceNM = pathLengthNM(points);
  return { points, distanceNM };
}

/* ---------------- Runway arrival-path splicing ----------------
   The actual approach/landing/rollout point construction now lives in
   js/data/runways.js (getRunwayApproachPoint / getRunwayLandingPoint /
   getRunwayRolloutEndPoint) and is spliced onto the end of the inbound
   leg directly in tickets.js's publish handler — see there for the
   up-to-date splice. (The old gate-based departure/arrival splicers that
   used to live here were removed: they depended on a generated fake gate
   position, and real gate data doesn't exist yet — see
   js/data/airport-ground-data.js. Per spec, the runway is only used for
   the final arrival phase; the departure leg still flies the plain drawn
   route.) */
