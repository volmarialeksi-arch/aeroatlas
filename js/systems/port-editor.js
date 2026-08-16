/* ================================================================
   Edit Port Points — manual parking-position editor.
   ================================================================
   Per spec: this game ships with NO predefined port points anywhere.
   `userPortPoints` (js/state.js) starts empty and is populated at boot
   from the server (js/systems/port-points-sync.js's
   loadPortPointsFromServer, called from js/main.js) and kept in sync
   afterward by that same file's Socket.IO listeners. It's picked up by
   js/data/taxi-graph.js's groundObjectsForAirport as a real parking
   position exactly as before — there is no separate "editor data" that
   then needs translating into "real" data; the moment a point exists
   here, it IS the data the rest of the game (route creation's dots, taxi
   pathfinding, the published route's ground phases) reads and uses.

   Port points are GLOBAL, shared game-world data — not this player's own
   save. addPortPoint()/removePortPoint() below send every change to the
   server first and only touch `userPortPoints` once that's confirmed;
   nothing here writes to localStorage any more (see
   js/systems/port-points-sync.js for the full read/write/realtime story,
   and server/README.md for the backend itself).

   Flow:
   1. picking-airport — click any airport on the map to edit its points.
   2. editing-airport — every existing point for that airport is shown as
      a clickable violet dot; click one to delete it. Click anywhere else
      on the map to drop a new point there. "Change airport" goes back to
      step 1; "Exit editing" leaves the editor entirely. */

const PORT_EDITOR_DOT_COLOR = '#a78bfa';
const PORT_EDITOR_DOT_RADIUS = 8;
const PORT_EDITOR_TAXIWAY_STYLE = { pane: 'runwayDebugPane', color: '#8fa3bf', weight: 2, opacity: 0.75, interactive: false };

let portEditState = null; // null | { mode: 'picking-airport' } | { mode: 'editing-airport', iata, ap, marker }
let _portEditorPointMarkers = []; // currently-rendered existing-point markers for the airport being edited
let _portEditorTaxiwayLayers = []; // real taxiway/taxilane reference lines for the airport being edited
let _taxiDebugActive = false;
let _taxiDebugLayers = []; // graph nodes/edges + snap point + final path, all drawn distinctly from the normal preview

const editPortToolbar = document.getElementById('editPortToolbar');
const editPortToolbarHint = document.getElementById('editPortToolbarHint');
const editPortChangeAirportBtn = document.getElementById('editPortChangeAirportBtn');
const editPortDoneBtn = document.getElementById('editPortDoneBtn');
const editPortDebugBtn = document.getElementById('editPortDebugBtn');
const editPortCopyAllBtn = document.getElementById('editPortCopyAllBtn');
const editPortImportRealBtn = document.getElementById('editPortImportRealBtn');
const editPortTaxiwayStatusEl = document.getElementById('editPortTaxiwayStatus');

function updatePortEditorTaxiwayStatus() {
  if (!editPortTaxiwayStatusEl) return;
  if (!portEditState || portEditState.mode !== 'editing-airport' || typeof taxiwayFetchStatus !== 'function') {
    editPortTaxiwayStatusEl.style.display = 'none';
    return;
  }
  const iata = portEditState.iata;
  const st = taxiwayFetchStatus(iata);
  editPortTaxiwayStatusEl.classList.remove('loading', 'success', 'failed');
  if (st.status === 'loading') {
    editPortTaxiwayStatusEl.textContent = `Checking OpenStreetMap for real taxiways at ${iata}…`;
    editPortTaxiwayStatusEl.classList.add('loading');
  } else if (st.status === 'success') {
    editPortTaxiwayStatusEl.textContent = st.wayCount > 0
      ? `${iata}: ${st.wayCount} real taxiway segment${st.wayCount === 1 ? '' : 's'} found (shown in grey below)`
      : `${iata}: OpenStreetMap has no taxiways mapped here yet`;
    editPortTaxiwayStatusEl.classList.add('success');
  } else if (st.status === 'failed') {
    editPortTaxiwayStatusEl.textContent = `${iata}: couldn't reach OpenStreetMap (retrying automatically)`;
    editPortTaxiwayStatusEl.classList.add('failed');
  } else {
    editPortTaxiwayStatusEl.style.display = 'none';
    return;
  }
  editPortTaxiwayStatusEl.style.display = '';
}

function openPortEditor() {
  // These two edit modes (drawing a route vs. editing port points) don't
  // mix — bail out of whichever route draft is in progress first, same
  // as a person can't sensibly do both at once.
  if (typeof routeDraft !== 'undefined' && routeDraft && typeof cancelRouteDraft === 'function') {
    cancelRouteDraft();
  }
  closeShop();
  if (typeof infoPanel !== 'undefined' && infoPanel) infoPanel.classList.remove('visible');

  portEditState = { mode: 'picking-airport' };
  clearPortEditorPointMarkers();
  editPortToolbar.classList.add('visible');
  updatePortEditorUI();
}

function closePortEditor() {
  portEditState = null;
  clearPortEditorPointMarkers();
  clearPortEditorTaxiwayLayers();
  clearTaxiDebugLayers();
  _taxiDebugActive = false;
  editPortToolbar.classList.remove('visible');
}

function updatePortEditorUI() {
  if (!portEditState) return;
  if (portEditState.mode === 'picking-airport') {
    editPortToolbarHint.textContent = 'Click an airport to edit its port points.';
    editPortChangeAirportBtn.style.display = 'none';
    editPortDebugBtn.style.display = 'none';
  } else {
    const count = (userPortPoints[portEditState.iata] || []).length;
    editPortToolbarHint.textContent =
      `Editing ${portEditState.iata} — click the map to add a point, or an existing dot to remove it. (${count} point${count === 1 ? '' : 's'})`;
    editPortChangeAirportBtn.style.display = '';
    editPortDebugBtn.style.display = '';
    editPortDebugBtn.textContent = _taxiDebugActive ? 'Hide taxi graph debug' : 'Show taxi graph debug';
  }
  updatePortEditorTaxiwayStatus();
}

/* Called from routes.js's handleAirportMarkerClick, which checks
   portEditState before doing anything route-related. */
function onPortEditorAirportClick(ap, marker) {
  if (!portEditState || portEditState.mode !== 'picking-airport') return;
  portEditState = { mode: 'editing-airport', iata: ap.iata, ap, marker };
  renderPortEditorPoints();
  renderPortEditorTaxiwayLayer();
  updatePortEditorUI();

  // Fetch real taxiway/taxilane geometry for this airport in the
  // background (js/data/osm-taxiway-fetch.js) so the player can see
  // exactly where the real taxiways run before placing a point near
  // one — points placed within ~100m of a real taxiway/taxilane connect
  // to it automatically (see js/data/taxi-graph.js), which is what lets
  // the taxi route actually follow it instead of falling back to a
  // straight line.
  if (typeof fetchTaxiwaysForAirport === 'function') {
    fetchTaxiwaysForAirport(ap.iata).then(() => {
      if (portEditState && portEditState.mode === 'editing-airport' && portEditState.iata === ap.iata) {
        renderPortEditorTaxiwayLayer();
        if (_taxiDebugActive) renderTaxiDebug();
      }
    });
  }
}

function clearPortEditorPointMarkers() {
  _portEditorPointMarkers.forEach(m => map.removeLayer(m));
  _portEditorPointMarkers = [];
}

function clearPortEditorTaxiwayLayers() {
  _portEditorTaxiwayLayers.forEach(l => map.removeLayer(l));
  _portEditorTaxiwayLayers = [];
}

/* Draws whatever real taxiway/taxilane geometry is currently known for
   the airport being edited (already fetched/cached, or real
   AIRPORT_GROUND_DATA if that ever ships) as a faint reference layer —
   purely visual, not interactive, so the player can see where to place
   a point for it to actually connect. Safe to call before a fetch has
   resolved (draws nothing yet; onPortEditorAirportClick re-calls this
   once it does). */
function renderPortEditorTaxiwayLayer() {
  clearPortEditorTaxiwayLayers();
  if (!portEditState || portEditState.mode !== 'editing-airport') return;
  if (typeof groundObjectsForAirport !== 'function') return;
  const { taxiways, taxilanes } = groundObjectsForAirport(portEditState.iata);
  [...(taxiways || []), ...(taxilanes || [])].forEach(way => {
    if (!way.geometry || way.geometry.length < 2) return;
    const line = L.polyline(way.geometry, PORT_EDITOR_TAXIWAY_STYLE).addTo(map);
    _portEditorTaxiwayLayers.push(line);
  });

  // Same z-order fix as renderTaxiDebug below — this reference layer is
  // added after the point dots, so without this it would sit on top of
  // them instead of the dots sitting on top of it.
  _portEditorPointMarkers.forEach(m => m.bringToFront());
}

function renderPortEditorPoints() {
  clearPortEditorPointMarkers();
  if (!portEditState || portEditState.mode !== 'editing-airport') return;
  const points = userPortPoints[portEditState.iata] || [];
  points.forEach(p => {
    const marker = L.circleMarker(p.stopPoint, {
      pane: 'runwayDebugPane',
      radius: PORT_EDITOR_DOT_RADIUS,
      color: PORT_EDITOR_DOT_COLOR,
      weight: 2,
      fillColor: PORT_EDITOR_DOT_COLOR,
      fillOpacity: 0.95,
      interactive: true,
    });
    marker.bindTooltip('Click to remove this port point', { direction: 'top', offset: [0, -10], className: 'runway-debug-tooltip' });
    marker.on('mouseover', () => marker.setStyle({ radius: PORT_EDITOR_DOT_RADIUS + 3 }));
    marker.on('mouseout', () => marker.setStyle({ radius: PORT_EDITOR_DOT_RADIUS }));
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e); // don't let this click also register as "add a point here" on the map handler below
      removePortPoint(portEditState.iata, p.id);
    });
    marker.addTo(map);
    _portEditorPointMarkers.push(marker);
  });
}

/* Sends the new point to the server and only adds it to userPortPoints /
   renders it once the server has actually confirmed the save (per spec:
   never mark a point as saved locally before that). The map click that
   triggered this stays responsive either way — a failure surfaces as an
   alert rather than silently doing nothing, since the alternative (a
   point that looks placed but wasn't) is worse. */
async function addPortPoint(iata, latlng) {
  let saved;
  try {
    saved = await postPortPointToServer(iata, latlng.lat, latlng.lng);
  } catch (e) {
    window.alert(e.message || 'Port point could not be saved.');
    return;
  }
  if (!userPortPoints[iata]) userPortPoints[iata] = [];
  userPortPoints[iata].push({ id: saved.id, stopPoint: [saved.lat, saved.lon] });
  if (typeof invalidateTaxiGraphCache === 'function') invalidateTaxiGraphCache(iata);
  renderPortEditorPoints();
  updatePortEditorUI();
  if (_taxiDebugActive) renderTaxiDebug();
}

/* Same server-confirmed-before-local-change approach as addPortPoint
   above — the dot stays on the map until the server confirms the delete,
   rather than disappearing optimistically and possibly reappearing on
   the next reload if the request had actually failed. */
async function removePortPoint(iata, id) {
  if (!userPortPoints[iata]) return;
  try {
    await deletePortPointFromServer(id);
  } catch (e) {
    window.alert(e.message || 'Port point could not be deleted.');
    return;
  }
  userPortPoints[iata] = userPortPoints[iata].filter(p => p.id !== id);
  if (!userPortPoints[iata].length) delete userPortPoints[iata];
  if (typeof invalidateTaxiGraphCache === 'function') invalidateTaxiGraphCache(iata);
  renderPortEditorPoints();
  updatePortEditorUI();
  if (_taxiDebugActive) renderTaxiDebug();
}

/* Re-renders whatever's currently on screen for the editor — used after
   a bulk change elsewhere (e.g. "Start New Game" wiping userPortPoints). */
function refreshPortEditorMarkers() {
  if (portEditState && portEditState.mode === 'editing-airport') renderPortEditorPoints();
}

map.on('click', (e) => {
  if (!portEditState || portEditState.mode !== 'editing-airport') return;
  addPortPoint(portEditState.iata, e.latlng);
});

editPortChangeAirportBtn.addEventListener('click', () => {
  portEditState = { mode: 'picking-airport' };
  clearPortEditorPointMarkers();
  clearPortEditorTaxiwayLayers();
  clearTaxiDebugLayers();
  _taxiDebugActive = false;
  updatePortEditorUI();
});

editPortDoneBtn.addEventListener('click', () => closePortEditor());

/* ================================================================
   Copy All — dump every current port point, across every airport, in a
   format that can be pasted straight into a permanent PORT_POINTS data
   file. Deliberately reads the WHOLE `userPortPoints` object, not just
   portEditState.iata — this is a full export, not a per-airport one, so
   it works the same whether the editor is mid-edit on one airport or
   just sitting on "pick an airport". */
function formatAllPortPointsForCopy() {
  const lines = [];
  Object.keys(userPortPoints).sort().forEach(iata => {
    (userPortPoints[iata] || []).forEach(p => {
      if (!p || !Array.isArray(p.stopPoint) || p.stopPoint.length !== 2) return;
      const [lat, lon] = p.stopPoint;
      lines.push(`  { lat: ${lat}, lon: ${lon}, iata: "${iata}" }`);
    });
  });
  const text = `const PORT_POINTS = [\n${lines.join(',\n')}\n];\n`;
  return { text, count: lines.length };
}

/* navigator.clipboard.writeText is the normal path, but it requires a
   secure context (https, or localhost) and can be unavailable/blocked —
   falls back to the classic hidden-textarea + execCommand('copy') trick
   so "Copy All" still works over a plain http:// LAN/deploy URL. */
async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through to the legacy method below */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

if (editPortCopyAllBtn) {
  editPortCopyAllBtn.addEventListener('click', async () => {
    const originalText = editPortCopyAllBtn.textContent;
    const { text, count } = formatAllPortPointsForCopy();
    const copied = await copyTextToClipboard(text);
    if (copied) {
      editPortCopyAllBtn.textContent = `✓ ${count} port point${count === 1 ? '' : 's'} copied`;
    } else {
      editPortCopyAllBtn.textContent = 'Copy failed — see console';
      console.error('[aeroatlas] Copy All: clipboard write failed; nothing was copied. The generated text was:\n' + text);
    }
    setTimeout(() => { editPortCopyAllBtn.textContent = originalText; }, 2200);
  });
}

/* ================================================================
   Import Real Airport Stands — this button deliberately does NOT make
   any internet requests itself. Real OpenStreetMap parking-position
   data has to be fetched by scripts/import-real-port-points.js running
   as a normal Node process on someone's own machine (double-click
   IMPORT_REAL_PORT_POINTS.bat in the project root) — a page loaded in a
   player's browser has no business reaching out to Overpass on its own,
   and this button is not a channel for running arbitrary commands on
   the server for anyone who happens to click it. All this does is:
     1. explain that to whoever clicked it, and
     2. once they've actually run the importer, offer to tell the
        already-running server "the file on disk changed, re-read it"
        (requestPortPointsReload in port-points-sync.js) so nobody has
        to restart the server just to see the new points. */
if (editPortImportRealBtn) {
  editPortImportRealBtn.addEventListener('click', async () => {
    const ranAlready = window.confirm(
      'Real airport stand data comes from OpenStreetMap and has to be ' +
      'downloaded by running the importer on your own computer — this ' +
      'button can\'t reach the internet on its own from inside the game.\n\n' +
      'To import real data:\n' +
      '1. Close this dialog.\n' +
      '2. In the AeroAtlas project folder, double-click:\n' +
      '   IMPORT_REAL_PORT_POINTS.bat\n' +
      '   (processes 10 airports per run, to avoid rate limits — just\n' +
      '   run it again to continue with the next 10, as many times as\n' +
      '   needed; or use IMPORT_NEXT_25_PORT_POINTS.bat for a bigger\n' +
      '   batch per run, or RETRY_FAILED_PORT_POINTS.bat to retry only\n' +
      '   airports that previously failed.)\n' +
      '3. Wait for each run to finish (it prints a summary and a report\n' +
      '   at server/data/port-point-import-report.json).\n\n' +
      'Click OK if you\'ve ALREADY run it and just want this server to ' +
      'pick up the new data now — Cancel just closes this dialog.'
    );
    if (!ranAlready) return;

    const originalText = editPortImportRealBtn.textContent;
    editPortImportRealBtn.textContent = 'Reloading…';
    editPortImportRealBtn.disabled = true;
    try {
      const { count } = await requestPortPointsReload();
      editPortImportRealBtn.textContent = `✓ Reloaded (${count} total)`;
      renderPortEditorPoints();
      updatePortEditorUI();
    } catch (e) {
      editPortImportRealBtn.textContent = 'Reload failed — see console';
      console.error('[aeroatlas] Import Real Airport Stands reload failed:', e.message);
    } finally {
      editPortImportRealBtn.disabled = false;
      setTimeout(() => { editPortImportRealBtn.textContent = originalText; }, 2500);
    }
  });
}

/* ================================================================
   Taxi graph debug mode — temporary diagnostic visualization.
   ================================================================
   Toggled by the "Show taxi graph debug" button, only while editing an
   airport. Renders, all at once and in a style deliberately unlike the
   normal amber-dashed taxi preview so there's no ambiguity about what's
   what:
   - every node in js/data/taxi-graph.js's built graph (cyan dots),
     colored slightly differently for taxiway vs. taxilane vs. parking
     nodes
   - every edge (thin cyan lines) — this is the raw graph the pathfinder
     searches, so if this doesn't visibly trace the real taxiways shown
     underneath by the reference overlay / OSM base tiles, the problem is
     upstream of pathfinding (fetch/bbox/parsing), not pathfinding itself
   - for the airport's first runway direction and first port point: the
     resolved snap/connection point (white bullseye) and the actual
     shortest path the pathfinder returns, drawn as a thick solid lime
     line with a distinct marker at every waypoint — if this bends
     wherever the cyan graph bends, the pathfinder and its rendering are
     both correct and the remaining question is only about fetch
     coverage for whatever airport/point produced a straight line. */
const TAXI_DEBUG_NODE_COLORS = {
  TAXIWAY_INTERSECTION: '#38bdf8',
  TAXILANE_INTERSECTION: '#0ea5e9',
  PARKING_POSITION: '#a78bfa',
};
const TAXI_DEBUG_EDGE_STYLE = { pane: 'runwayDebugPane', color: '#38bdf8', weight: 1.5, opacity: 0.6, interactive: false };
const TAXI_DEBUG_PATH_STYLE = { pane: 'runwayDebugPane', color: '#a3ff12', weight: 5, opacity: 0.95, interactive: false };

function clearTaxiDebugLayers() {
  _taxiDebugLayers.forEach(l => map.removeLayer(l));
  _taxiDebugLayers = [];
}

function renderTaxiDebug() {
  clearTaxiDebugLayers();
  if (!portEditState || portEditState.mode !== 'editing-airport') return;
  const iata = portEditState.iata;
  const graph = (typeof taxiGraphForAirport === 'function') ? taxiGraphForAirport(iata) : null;
  if (!graph) return;

  graph.edges.forEach(edge => {
    const line = L.polyline(edge.geometry, TAXI_DEBUG_EDGE_STYLE).addTo(map);
    _taxiDebugLayers.push(line);
  });
  graph.nodes.forEach(n => {
    const marker = L.circleMarker([n.lat, n.lon], {
      pane: 'runwayDebugPane', radius: 3, color: TAXI_DEBUG_NODE_COLORS[n.type] || '#38bdf8',
      weight: 1, fillColor: TAXI_DEBUG_NODE_COLORS[n.type] || '#38bdf8', fillOpacity: 0.9, interactive: false,
    }).addTo(map);
    _taxiDebugLayers.push(marker);
  });

  const dirs = (typeof runwaysForAirport === 'function') ? runwaysForAirport(iata) : [];
  const dot = (typeof dotsForAirport === 'function') ? dotsForAirport(iata)[0] : null;
  const summary = { iata, nodes: graph.nodes.length, edges: graph.edges.length, runway: dirs[0] ? dirs[0].id : null, hasDot: !!dot };

  if (dirs.length && dot && typeof getRunwayRolloutEndPoint === 'function' && typeof getRunwayLandingPoint === 'function') {
    const runway = dirs[0];
    const landingPoint = getRunwayLandingPoint(runway);
    const fallbackRolloutEnd = getRunwayRolloutEndPoint(runway, landingPoint);
    const rolloutEndPoint = (typeof resolveRunwayExitPoint === 'function')
      ? resolveRunwayExitPoint(iata, runway, fallbackRolloutEnd, landingPoint)
      : fallbackRolloutEnd;
    const path = (typeof taxiPathToDot === 'function') ? taxiPathToDot(iata, { a: runway.threshold, b: runway.farEnd }, dot) : null;

    const rolloutMarker = L.circleMarker(rolloutEndPoint, {
      pane: 'runwayDebugPane', radius: 7, color: '#ffffff', weight: 2, fillColor: '#000000', fillOpacity: 0.6, interactive: false,
    }).bindTooltip('Runway exit point (path start)', { permanent: false, direction: 'top', className: 'runway-debug-tooltip' }).addTo(map);
    _taxiDebugLayers.push(rolloutMarker);

    if (path && path.length) {
      const full = [rolloutEndPoint, ...path];
      const pathLine = L.polyline(full, TAXI_DEBUG_PATH_STYLE).addTo(map);
      _taxiDebugLayers.push(pathLine);
      full.forEach(pt => {
        const m = L.circleMarker(pt, {
          pane: 'runwayDebugPane', radius: 4, color: '#000000', weight: 1, fillColor: '#a3ff12', fillOpacity: 1, interactive: false,
        }).addTo(map);
        _taxiDebugLayers.push(m);
      });
      summary.pathWaypoints = full.length;
      summary.pathFound = true;
    } else {
      summary.pathFound = false;
    }
  }
  console.log('[taxi debug]', summary);

  // The debug edges/nodes above are added to the map (and therefore
  // stacked in the DOM) after the existing violet port-point dots, so
  // without this they'd render on top of those dots — a thin blue line
  // visibly cutting across a marker instead of the marker sitting on
  // top of it. Bringing the port-point dots back to front each time
  // keeps every connecting line looking like it terminates AT the dot
  // (dot on top, line underneath) rather than routing over/around it.
  _portEditorPointMarkers.forEach(m => m.bringToFront());
}

editPortDebugBtn.addEventListener('click', () => {
  _taxiDebugActive = !_taxiDebugActive;
  updatePortEditorUI();
  if (_taxiDebugActive) renderTaxiDebug();
  else clearTaxiDebugLayers();
});
