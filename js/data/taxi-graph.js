/* ================================================================
   Ground objects (gates / parking positions / taxiways / taxilanes /
   runway exits) + taxi-graph pathfinding — REAL DATA ONLY, plus
   whatever the player has manually placed via the Edit Port Points
   menu (js/systems/port-editor.js, backed by the `userPortPoints`
   global declared in state.js).
   ================================================================
   Reads whatever AIRPORT_GROUND_DATA has for an airport. As of right now
   that's nothing for any of the 254 airports — the OSM importer
   (build-osm-ground-data.mjs) hasn't been run against a live Overpass
   endpoint yet (this sandbox has no network access to it; see the
   conversation this shipped in). Every function below is written to
   handle that honestly: no taxiways/taxilanes/parking data -> no taxi
   graph -> no path -> the aircraft's arrival simply ends at the runway
   rollout point, exactly like before this file existed. Nothing here
   invents a gate, a parking stand, or a taxiway to fill the gap.

   Per spec: there are NO predefined port points. The only parking
   positions this file ever returns are real OSM data (currently none)
   plus whatever the player has explicitly placed for that airport
   through the Edit Port Points menu — the list starts empty and only
   ever contains points the player created themselves. */

const GRAPH_SNAP_TOLERANCE_M = 5;   // per spec: small tolerance, connectivity only
const PARKING_CONNECT_TOLERANCE_M = 100; // parking position -> nearest taxiway/taxilane
const RUNWAY_EXIT_SNAP_TOLERANCE_M = 30; // rollout end -> nearest known runway exit (exact-vertex case)
const RUNWAY_CONNECT_TOLERANCE_M = 250; // rollout/liftoff/threshold -> nearest taxiway edge, general case (see _nearestEdgeConnection)

/* Live-read (not cached), so flipping window.AEROATLAS_TAXI_DEBUG = true
   in devtools console takes effect on the very next pathfinding call —
   no reload needed. Logs exactly why a taxi path did/didn't connect:
   graph size, which snap tolerance succeeded (or that none did), and the
   resulting waypoint count — the fastest way to tell "no path found" (a
   coverage/tolerance problem) apart from "found a path but it's not
   being drawn" (a rendering problem), from just the browser console. */
function _taxiDebugEnabled() { return (typeof window !== 'undefined') && !!window.AEROATLAS_TAXI_DEBUG; }
function _taxiDebugLog(...args) { if (_taxiDebugEnabled()) console.log('[taxi]', ...args); }

function _haversineMetersLocal(a, b) {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function _pointToSegmentMeters(p, a, b) {
  const lat0 = (a[0] + b[0]) * Math.PI / 360;
  const mPerDegLat = 111320, mPerDegLon = 111320 * Math.cos(lat0);
  const P = [p[1] * mPerDegLon, p[0] * mPerDegLat];
  const A = [a[1] * mPerDegLon, a[0] * mPerDegLat];
  const B = [b[1] * mPerDegLon, b[0] * mPerDegLat];
  const ABx = B[0] - A[0], ABy = B[1] - A[1];
  const APx = P[0] - A[0], APy = P[1] - A[1];
  const abLenSq = ABx * ABx + ABy * ABy;
  let t = abLenSq > 0 ? (APx * ABx + APy * ABy) / abLenSq : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = A[0] + ABx * t, cy = A[1] + ABy * t;
  const dx = P[0] - cx, dy = P[1] - cy;
  return Math.sqrt(dx * dx + dy * dy);
}

/* Public: every ground object this airport has — real OSM data (empty
   for every airport right now) merged with whatever the player has
   placed via the Edit Port Points menu. `parkingPositions` elements are
   returned as the SAME object references every call (never rebuilt),
   which matters: the taxi graph (below) keys its per-parking-position
   graph node on that exact object identity, so a point created through
   the editor plugs into pathfinding exactly like a real one would. */
function groundObjectsForAirport(iata) {
  const entry = _groundDataByIata.get(iata);
  const base = entry
    ? {
        gates: entry.gates || [],
        parkingPositions: entry.parkingPositions || [],
        taxiways: entry.taxiways || [],
        taxilanes: entry.taxilanes || [],
        runwayExits: entry.runwayExits || [],
      }
    : { gates: [], parkingPositions: [], taxiways: [], taxilanes: [], runwayExits: [] };

  // Real taxiway/taxilane geometry fetched live from OpenStreetMap (see
  // js/data/osm-taxiway-fetch.js) — merged in the same way as the
  // player's port points below: these ARE real data the moment they're
  // fetched, not a separate "fetched" tier the pathfinder treats
  // differently.
  const fetchedTaxiways = (typeof fetchedTaxiwaysForAirport === 'function') ? fetchedTaxiwaysForAirport(iata) : null;
  if (fetchedTaxiways) {
    if (fetchedTaxiways.taxiways && fetchedTaxiways.taxiways.length) base.taxiways = base.taxiways.concat(fetchedTaxiways.taxiways);
    if (fetchedTaxiways.taxilanes && fetchedTaxiways.taxilanes.length) base.taxilanes = base.taxilanes.concat(fetchedTaxiways.taxilanes);
  }

  const userPoints = (typeof userPortPoints !== 'undefined' && userPortPoints[iata]) ? userPortPoints[iata] : null;
  if (userPoints && userPoints.length) {
    base.parkingPositions = base.parkingPositions.concat(userPoints);
  }
  return base;
}

/* Public: the ONE parking position used as the "primary" one where a
   single stand is needed (e.g. the old single-gate splice). First in
   the combined list (real OSM data first, then player-created points in
   creation order), since query/cache order is stable. Returns null if
   this airport has no parking positions at all yet (real or
   player-created) — the expected state for every airport until the
   player creates one via the Edit Port Points menu. */
function primaryParkingPositionForAirport(iata) {
  const { parkingPositions } = groundObjectsForAirport(iata);
  return parkingPositions.length ? parkingPositions[0] : null;
}

/* ---------------- Route-creator "dots" ----------------
   The clickable ground stand(s) shown during route creation (routes.js)
   for the player to park at — the "red dot" the aircraft actually sits
   on between flights. There is NO fallback here: if this airport has no
   parking positions (real OSM data or player-created — see
   groundObjectsForAirport above), this returns an empty list, and
   routes.js skips the dot-picking step for that airport entirely
   (exactly like it already does for airports with no runway data). The
   player creates points for an airport via the Edit Port Points menu
   (js/systems/port-editor.js); this function starts returning them the
   moment they exist, no other code needs to change. `dot.real` tells
   callers whether this dot is backed by graph data (i.e. it has a node
   in the taxi graph and pathfinding can be attempted); `dot.stopPoint`
   is always the [lat, lon] to use. */
function dotsForAirport(iata) {
  const { parkingPositions } = groundObjectsForAirport(iata);
  return (parkingPositions || [])
    .filter(pp => pp.stopPoint)
    .map(pp => ({ stopPoint: pp.stopPoint, real: true, ref: pp }));
}

/* Public: the single dot used as the default/primary stand for an
   airport — first of dotsForAirport's list. Returns null for an airport
   with no parking positions yet. */
function primaryDotForAirport(iata) {
  const dots = dotsForAirport(iata);
  return dots.length ? dots[0] : null;
}

/* ---------------- Taxi graph ----------------
   Built once per airport, cached. Nodes: every vertex of every real
   taxiway/taxilane, merged within GRAPH_SNAP_TOLERANCE_M so nearby OSM
   vertices from different ways count as one intersection, plus one node
   per parking position. Edges: consecutive vertices along each way's own
   real geometry, plus a short connector from each parking position to
   the nearest taxiway/taxilane edge within PARKING_CONNECT_TOLERANCE_M
   (never force-connected beyond that). */
const _taxiGraphCache = new Map();

function _buildTaxiGraph(iata) {
  const { taxiways, taxilanes, parkingPositions, runwayExits } = groundObjectsForAirport(iata);
  const nodes = [];
  const edges = [];

  function findOrCreateNode(pos, type) {
    for (let i = 0; i < nodes.length; i++) {
      if (_haversineMetersLocal(pos, [nodes[i].lat, nodes[i].lon]) <= GRAPH_SNAP_TOLERANCE_M) return nodes[i].id;
    }
    const id = `N${nodes.length}`;
    nodes.push({ id, lat: pos[0], lon: pos[1], type });
    return id;
  }

  function addWayEdges(way, type) {
    const geom = way.geometry;
    if (!geom || geom.length < 2) return;
    for (let i = 0; i < geom.length - 1; i++) {
      const fromId = findOrCreateNode(geom[i], type);
      const toId = findOrCreateNode(geom[i + 1], type);
      if (fromId === toId) continue;
      edges.push({ from: fromId, to: toId, distanceM: _haversineMetersLocal(geom[i], geom[i + 1]), geometry: [geom[i], geom[i + 1]] });
    }
  }
  (taxiways || []).forEach(tw => addWayEdges(tw, 'TAXIWAY_INTERSECTION'));
  (taxilanes || []).forEach(tl => addWayEdges(tl, 'TAXILANE_INTERSECTION'));

  const parkingNodeById = new Map();
  (parkingPositions || []).forEach(pp => {
    if (!pp.stopPoint) return;
    const id = `N${nodes.length}`;
    nodes.push({ id, lat: pp.stopPoint[0], lon: pp.stopPoint[1], type: 'PARKING_POSITION' });
    parkingNodeById.set(pp, id);

    let best = null;
    edges.slice().forEach(edge => {
      const d = _pointToSegmentMeters(pp.stopPoint, edge.geometry[0], edge.geometry[1]);
      if (d <= PARKING_CONNECT_TOLERANCE_M && (!best || d < best.dist)) best = { dist: d, edge };
    });
    if (best) {
      const dFrom = _haversineMetersLocal(pp.stopPoint, best.edge.geometry[0]);
      const dTo = _haversineMetersLocal(pp.stopPoint, best.edge.geometry[1]);
      const targetNodeId = dFrom <= dTo ? best.edge.from : best.edge.to;
      edges.push({ from: id, to: targetNodeId, distanceM: Math.min(dFrom, dTo), geometry: [pp.stopPoint, dFrom <= dTo ? best.edge.geometry[0] : best.edge.geometry[1]] });
    }
  });

  return { nodes, edges, parkingNodeById, runwayExits: runwayExits || [] };
}

function taxiGraphForAirport(iata) {
  if (!_taxiGraphCache.has(iata)) _taxiGraphCache.set(iata, _buildTaxiGraph(iata));
  return _taxiGraphCache.get(iata);
}

/* Public: called whenever a port point is added/removed for an airport
   (js/systems/port-editor.js) so the next pathfinding call rebuilds the
   graph from the current set of points instead of serving a stale one. */
function invalidateTaxiGraphCache(iata) {
  _taxiGraphCache.delete(iata);
}

function _nearestGraphNode(graph, pos, toleranceM) {
  let best = null;
  graph.nodes.forEach(n => {
    const d = _haversineMetersLocal(pos, [n.lat, n.lon]);
    if (d <= toleranceM && (!best || d < best.dist)) best = { dist: d, id: n.id };
  });
  return best ? best.id : null;
}

/* A more forgiving way to connect an arbitrary point (a computed runway
   rollout/liftoff point, which is a straight-line extrapolation along
   the centerline and so essentially never lands exactly on an existing
   taxiway vertex) to the graph: find the nearest real taxiway/taxilane
   EDGE within toleranceM (not just an existing vertex), then connect to
   whichever of that edge's two endpoints is closer — the same snap-to-
   nearest-endpoint approach _buildTaxiGraph already uses for parking
   positions above, just applied on demand for a query point instead of
   being baked into the graph. Never invents a coordinate: the entry/exit
   point used is always one of the edge's two REAL vertices. */
function _nearestEdgeConnection(graph, pos, toleranceM) {
  let best = null;
  graph.edges.forEach(edge => {
    const d = _pointToSegmentMeters(pos, edge.geometry[0], edge.geometry[1]);
    if (d <= toleranceM && (!best || d < best.dist)) best = { dist: d, edge };
  });
  if (!best) return null;
  const dFrom = _haversineMetersLocal(pos, best.edge.geometry[0]);
  const dTo = _haversineMetersLocal(pos, best.edge.geometry[1]);
  return dFrom <= dTo ? best.edge.from : best.edge.to;
}

/* Same idea as _nearestEdgeConnection, but against a runway's WHOLE
   length (threshold to far end) rather than one single query point.
   This is the fix for a real, physically-obvious gap: a runway's actual
   exit taxiway can branch off anywhere along its length — a couple
   hundred meters down for a rapid-exit taxiway, or much farther for a
   90-degree turnoff near the far end — never reliably right at the
   threshold itself. Searching only within toleranceM of a single fixed
   point (the threshold, or one arbitrary computed rollout point) misses
   every real exit that isn't coincidentally near that one spot, even
   when the taxiway network is otherwise right there and well within
   reach of the runway as a whole. Checking every graph node's distance
   to the full runway SEGMENT instead finds whichever real taxiway
   vertex the runway actually meets, wherever along its length that is —
   matching how the aircraft would really roll down the runway and turn
   off at the first available exit. */
function _nearestNodeAlongSegment(graph, a, b, toleranceM) {
  let best = null;
  graph.nodes.forEach(n => {
    const d = _pointToSegmentMeters([n.lat, n.lon], a, b);
    if (d <= toleranceM && (!best || d < best.dist)) best = { dist: d, id: n.id };
  });
  return best ? best.id : null;
}

/* Resolves the graph node a query should path from/to. `query` is either
   a single [lat, lon] point (a dot, or any arbitrary point with no
   natural "length" to search along) or a `{ a, b }` pair of [lat, lon]
   points describing a runway's full threshold-to-far-end extent — always
   the shape to prefer when a runway is involved (see
   _nearestNodeAlongSegment above for why). Cheapest/most common case
   first: an exact nearby vertex (RUNWAY_EXIT_SNAP_TOLERANCE_M, common
   when a query point happens to coincide with a mapped junction), then
   falling back to the much more generous RUNWAY_CONNECT_TOLERANCE_M
   search — against the whole runway length when a segment was given,
   or just the one point otherwise. */
function _resolveConnectionNode(graph, query) {
  if (query && typeof query === 'object' && !Array.isArray(query) && query.a && query.b) {
    return _nearestGraphNode(graph, query.a, RUNWAY_EXIT_SNAP_TOLERANCE_M)
      || _nearestGraphNode(graph, query.b, RUNWAY_EXIT_SNAP_TOLERANCE_M)
      || _nearestNodeAlongSegment(graph, query.a, query.b, RUNWAY_CONNECT_TOLERANCE_M);
  }
  return _nearestGraphNode(graph, query, RUNWAY_EXIT_SNAP_TOLERANCE_M)
    || _nearestEdgeConnection(graph, query, RUNWAY_CONNECT_TOLERANCE_M);
}

function _dijkstra(graph, fromId, toId) {
  const adjacency = new Map();
  graph.edges.forEach(e => {
    if (!adjacency.has(e.from)) adjacency.set(e.from, []);
    if (!adjacency.has(e.to)) adjacency.set(e.to, []);
    adjacency.get(e.from).push({ to: e.to, cost: e.distanceM, edge: e });
    adjacency.get(e.to).push({ to: e.from, cost: e.distanceM, edge: e });
  });
  const dist = new Map([[fromId, 0]]);
  const prev = new Map();
  const visited = new Set();
  const queue = new Set([fromId]);
  while (queue.size) {
    let u = null, best = Infinity;
    queue.forEach(n => { const d = dist.get(n) ?? Infinity; if (d < best) { best = d; u = n; } });
    if (u === null) break;
    queue.delete(u);
    if (u === toId) break;
    visited.add(u);
    (adjacency.get(u) || []).forEach(({ to, cost, edge }) => {
      if (visited.has(to)) return;
      const alt = (dist.get(u) ?? Infinity) + cost;
      if (alt < (dist.get(to) ?? Infinity)) { dist.set(to, alt); prev.set(to, { node: u, edge }); queue.add(to); }
    });
  }
  if (!dist.has(toId)) return null;
  const edgesOut = [];
  let cur = toId;
  while (cur !== fromId) {
    const step = prev.get(cur);
    if (!step) return null;
    edgesOut.unshift(step.edge);
    cur = step.node;
  }
  return edgesOut;
}

/* Real geographic waypoints from a connection query — either a single
   point (e.g. an arbitrary computed point) or a `{ a, b }` runway
   threshold-to-far-end segment (preferred whenever a runway is involved
   — see _resolveConnectionNode) — to a SPECIFIC parking-position object
   (as stored in groundObjectsForAirport's parkingPositions — see
   dotsForAirport's `ref` field), following the real taxiway/taxilane
   graph. Returns null if there's no usable graph, no path, or nothing
   connects within tolerance — callers must fall back to a straight line
   in that case, never invent one. */
function taxiPathToParkingPosition(iata, fromQuery, pp) {
  const graph = taxiGraphForAirport(iata);
  if (!pp) { _taxiDebugLog(iata, 'no parking-position object given — nothing to path to'); return null; }
  if (!graph.nodes.length) { _taxiDebugLog(iata, `graph has 0 nodes (no taxiway/taxilane data fetched/present for ${iata} yet) — falling back to a straight line`); return null; }
  const parkingNodeId = graph.parkingNodeById.get(pp);
  if (!parkingNodeId) { _taxiDebugLog(iata, 'this parking position has no graph node (unexpected — should always be added in _buildTaxiGraph)'); return null; }

  const startNodeId = _resolveConnectionNode(graph, fromQuery);
  if (!startNodeId) {
    _taxiDebugLog(iata, `could not connect the starting point/runway ${JSON.stringify(fromQuery)} to any taxiway/taxilane within ${RUNWAY_CONNECT_TOLERANCE_M}m — graph has ${graph.nodes.length} nodes / ${graph.edges.length} edges, but none close enough. Falling back to a straight line.`);
    return null;
  }

  const pathEdges = _dijkstra(graph, startNodeId, parkingNodeId);
  if (!pathEdges || !pathEdges.length) {
    _taxiDebugLog(iata, `connected both ends to the graph (start node ${startNodeId}, parking node ${parkingNodeId}) but they're in disconnected parts of the taxiway network — no path exists between them in the fetched data. Falling back to a straight line.`);
    return null;
  }

  // Flatten edge geometries into an ordered waypoint list, respecting
  // travel direction and dropping consecutive duplicate points.
  const waypoints = [];
  let cursor = startNodeId;
  pathEdges.forEach(edge => {
    const forward = edge.from === cursor;
    const geom = forward ? edge.geometry : [...edge.geometry].reverse();
    geom.forEach(pt => {
      const last = waypoints[waypoints.length - 1];
      if (!last || last[0] !== pt[0] || last[1] !== pt[1]) waypoints.push(pt);
    });
    cursor = forward ? edge.to : edge.from;
  });
  _taxiDebugLog(iata, `found a taxiway-following path: ${waypoints.length} waypoints across ${pathEdges.length} graph edges (graph: ${graph.nodes.length} nodes / ${graph.edges.length} edges).`);
  return waypoints;
}

/* Public: real geographic waypoints from a connection query (point or
   runway segment — see taxiPathToParkingPosition) to this airport's
   primary parking position. Thin wrapper for callers that just want
   "the" default stand. */
function taxiPathToParking(iata, fromQuery) {
  return taxiPathToParkingPosition(iata, fromQuery, primaryParkingPositionForAirport(iata));
}

/* Public: same idea as taxiPathToParking, but for an arbitrary dot (see
   dotsForAirport above) — correctly pathfinds to THAT SPECIFIC dot (via
   its `ref`, the underlying parking-position object) rather than always
   the primary/first one, so this works correctly once an airport has
   more than one port point. `fromQuery` is either a single [lat, lon]
   point or a `{ a, b }` runway segment — always pass the runway segment
   when a runway is involved (see _resolveConnectionNode for why: a real
   runway exit can be anywhere along the runway's length, not reliably
   near any one fixed point on it). Usable in either direction. Only
   ever returns a real, graph-following path when `dot.real` is true and
   it actually has a connecting taxiway/taxilane within
   PARKING_CONNECT_TOLERANCE_M — an isolated point with no nearby
   taxiway data has no edges to path through, so this returns null and
   callers fall back to a straight line, same as every other "no ground
   data yet" fallback in this codebase. */
function taxiPathToDot(iata, fromQuery, dot) {
  if (!dot || !dot.real || !dot.ref) return null;
  return taxiPathToParkingPosition(iata, fromQuery, dot.ref);
}

/* Public: waypoints FROM a dot TO some connection query (e.g. a
   departure runway's threshold-to-far-end segment) — the reverse of
   taxiPathToDot, built by reusing the same (direction-agnostic) graph
   search and flipping the result, since taxiway/taxilane edges are
   walkable in either direction. */
function taxiPathFromDot(iata, dot, toQuery) {
  const forward = taxiPathToDot(iata, toQuery, dot);
  return forward ? [...forward].reverse() : null;
}

/* ---------------- Runway exit point ----------------
   Where an aircraft actually leaves the runway — the real, physical exit
   — is wherever a real taxiway/taxilane meets it, which is data, not a
   formula: it can be right near the threshold, dead in the middle of a
   long runway, or almost at the far end, depending entirely on how that
   specific airport is laid out. A fixed assumed distance (e.g. "1200m
   past touchdown") is a reasonable placeholder when there's no real data
   to go on, but once real taxiway geometry exists for an airport, using
   it instead — rather than forcing the taxi line through the assumed
   point regardless — is what makes the taxi-in line connect from
   wherever really makes sense along the runway, with no artificial
   straight "backtrack" segment between an assumed point and the real
   connection dominating the line. */

/* Point on segment a-b nearest to p, in real [lat, lon] coordinates
   (not just the distance — see _pointToSegmentMeters for that), using
   the same local equirectangular approximation. */
function _projectPointOntoSegmentGeo(p, a, b) {
  const lat0 = (a[0] + b[0]) * Math.PI / 360;
  const mPerDegLat = 111320, mPerDegLon = 111320 * Math.cos(lat0);
  const P = [p[1] * mPerDegLon, p[0] * mPerDegLat];
  const A = [a[1] * mPerDegLon, a[0] * mPerDegLat];
  const B = [b[1] * mPerDegLon, b[0] * mPerDegLat];
  const ABx = B[0] - A[0], ABy = B[1] - A[1];
  const APx = P[0] - A[0], APy = P[1] - A[1];
  const abLenSq = ABx * ABx + ABy * ABy;
  let t = abLenSq > 0 ? (APx * ABx + APy * ABy) / abLenSq : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = A[0] + ABx * t, cy = A[1] + ABy * t;
  const dx = P[0] - cx, dy = P[1] - cy;
  const distM = Math.sqrt(dx * dx + dy * dy);
  return { point: [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])], distM, t };
}

/* Public: the real point along a runway's own centerline (threshold to
   far end) where a real taxiway/taxilane actually connects to it, within
   RUNWAY_CONNECT_TOLERANCE_M — the runway's true physical exit, found
   from data. `afterPoint` (optional, e.g. the landing touchdown point)
   restricts the search to connections at or past that point along the
   runway's own direction of travel — an aircraft can't realistically
   exit behind where it touched down, so a taxiway that happens to meet
   the runway before that point is never a valid landing exit, however
   close it is. Returns null if there's no graph or nothing valid
   connects close enough, so callers know to fall back to an assumed
   fixed distance. */
function nearestRunwayExitPoint(iata, runway, afterPoint) {
  const graph = taxiGraphForAirport(iata);
  if (!graph.nodes.length) return null;
  const minT = afterPoint ? _projectPointOntoSegmentGeo(afterPoint, runway.threshold, runway.farEnd).t : 0;
  let best = null;
  graph.nodes.forEach(n => {
    const proj = _projectPointOntoSegmentGeo([n.lat, n.lon], runway.threshold, runway.farEnd);
    if (proj.t < minT) return; // behind afterPoint along the runway — not a valid exit
    if (proj.distM <= RUNWAY_CONNECT_TOLERANCE_M && (!best || proj.distM < best.distM)) best = proj;
  });
  return best ? best.point : null;
}

/* Public: resolves the point to actually use as a runway's taxi
   connection — the real, data-found exit point when one exists (see
   nearestRunwayExitPoint — `afterPoint`, e.g. the landing point, is
   forwarded straight through), otherwise `fallbackPoint` (whatever
   fixed-distance assumption the caller already computed, e.g.
   getRunwayRolloutEndPoint's result, or the bare threshold for a
   departure). Centralizes the "prefer real data over an assumption"
   choice so every caller (routes.js's preview, tickets.js's publish,
   runway-debug.js's reference overlay) makes it the same way. */
function resolveRunwayExitPoint(iata, runway, fallbackPoint, afterPoint) {
  const graphExit = nearestRunwayExitPoint(iata, runway, afterPoint);
  if (graphExit) {
    _taxiDebugLog(iata, `runway ${runway.id}: found a real taxiway connection along the runway itself at [${graphExit[0].toFixed(5)}, ${graphExit[1].toFixed(5)}] — using it instead of the fixed-distance fallback.`);
    return graphExit;
  }
  return fallbackPoint;
}
