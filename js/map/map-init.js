/* ================================================================
   Leaflet map bootstrap: base map, tile layer, and the custom
   panes used for in-flight aircraft / contrails / night overlay.
   ================================================================ */
/* ---------------- Map init ---------------- */
const map = L.map('map', {
  worldCopyJump: true,
  minZoom: 2,
  maxZoom: 18,
  zoomControl: true,
}).setView([20, 10], 2.3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

/* Dedicated pane, above the default marker pane (600), so in-flight aircraft
   always render on top of airport pin markers regardless of latitude-based
   marker ordering within a shared pane. */
map.createPane('planePane');
map.getPane('planePane').style.zIndex = 640;

/* Contrail pane sits just below the plane pane so trails render behind the
   aircraft icon but still above routes/pins. */
map.createPane('trailPane');
map.getPane('trailPane').style.zIndex = 635;
map.getPane('trailPane').style.pointerEvents = 'none';
// Soft/blurred edges on the contrail lines themselves, rather than
// achieving "softness" by displacing the trail geometry (which is what
// causes stray intersections between the two engine streaks).
map.getPane('trailPane').style.filter = 'blur(0.6px)';

/* Debug-only pane for runway/gate visualization (js/systems/runway-debug.js).
   Sits above the plane pane so debug graphics are never hidden by an
   aircraft icon, or by anything else on the map, while inspecting a
   runway/gate up close. Every layer drawn into this pane is a normal
   Leaflet layer added with real [lat,lon] coordinates (L.polyline /
   L.circleMarker / L.marker), so it reprojects correctly on its own with
   zoom/pan exactly like every other map layer — nothing here is manually
   positioned in screen pixels. */
map.createPane('runwayDebugPane');
map.getPane('runwayDebugPane').style.zIndex = 645; // above planePane (640)


