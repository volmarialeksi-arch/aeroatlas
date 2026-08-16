/* ================================================================
   Real taxiway/taxilane geometry, fetched live from OpenStreetMap via
   the public Overpass API — from the PLAYER'S own browser, at runtime.
   ================================================================
   (This sandbox's own tools can't reach overpass-api.de to test this
   end-to-end — its network egress allowlist doesn't include OSM/
   Overpass hosts — but that's a restriction on the sandbox used to
   build this, not on the game itself: a normal browser running
   index.html makes this fetch() the same as any other website would,
   with the player's own normal internet access.)

   This is what makes "follows the airport's taxiways" literally true
   rather than aspirational: js/data/taxi-graph.js already builds a real
   graph from whatever taxiways/taxilanes an airport has and finds the
   shortest path through it with Dijkstra (= "the most direct route")
   — the only thing that was ever missing was the taxiway geometry
   itself, since AIRPORT_GROUND_DATA ships with none. This file fetches
   it, in the exact {id, geometry:[[lat,lon],...]} shape
   js/data/airport-ground-data.js already uses for taxiways/taxilanes,
   and taxi-graph.js's groundObjectsForAirport merges it straight in as
   real data — every downstream system (dots, taxi pathfinding,
   published routes) treats it exactly like real ground-truth data,
   because once fetched, it is.

   Fetched once per airport per browser and cached in localStorage (a
   taxiway layout doesn't change session to session), and never blocks
   route creation: it's kicked off in the background the moment an
   airport becomes relevant (home airport when creating a route,
   destination once picked, or an airport selected in the port editor —
   see routes.js/port-editor.js), and whatever's already drawn on screen
   gets upgraded from a straight line to the real taxiway path the
   moment the fetch resolves. If the fetch fails (offline, Overpass
   down/rate-limited, CORS blocked, etc.) route creation keeps working
   exactly as it already did — straight-line fallback, never blocked,
   never invented. */

const OSM_TAXIWAY_CACHE_VERSION = 2; // bumped: bbox now covers the whole airport footprint, not just runway extents
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const OVERPASS_FETCH_TIMEOUT_MS = 20000;
const OSM_BBOX_PAD_KM = 4; // generous: must comfortably reach the terminal/apron area, not just the runway strip
const TAXIWAY_RETRY_BACKOFF_MS = 20000; // don't hammer a failing/rate-limited Overpass more than once per ~20s per airport

const _fetchedGroundDataByIata = new Map(); // iata -> { taxiways, taxilanes } (SUCCESS ONLY — see fetchTaxiwaysForAirport)
const _taxiwayFetchPromises = new Map();     // iata -> in-flight Promise (dedupes concurrent callers)
const _taxiwayFetchListeners = new Set();    // fn(iata) fired whenever a fetch settles (success OR failure) so UI can update
const _taxiwayFetchStatus = new Map();       // iata -> { status: 'loading'|'success'|'failed', wayCount, lastAttemptMs, error }

/* Public: subscribe to "a taxiway fetch for this airport just settled"
   (success or failure) so a caller (routes.js, port-editor.js) can
   upgrade whatever it's already drawn, or update a status indicator. */
function onTaxiwayDataUpdated(fn) { _taxiwayFetchListeners.add(fn); }

/* Public: current fetch status for an airport, for a visible in-game
   indicator — never requires opening devtools to know why a taxi line
   is (or isn't) following real taxiways. `{ status: 'idle' }` if never
   requested yet. */
function taxiwayFetchStatus(iata) {
  return _taxiwayFetchStatus.get(iata) || { status: 'idle' };
}

function _taxiwayCacheKey(iata) { return `aeroatlas_osm_taxiways_v${OSM_TAXIWAY_CACHE_VERSION}_${iata}`; }

function _loadCachedTaxiways(iata) {
  try {
    const raw = localStorage.getItem(_taxiwayCacheKey(iata));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.taxiways) || !Array.isArray(parsed.taxilanes)) return null;
    return parsed;
  } catch (e) { return null; }
}

function _saveCachedTaxiways(iata, data) {
  try { localStorage.setItem(_taxiwayCacheKey(iata), JSON.stringify(data)); } catch (e) { /* storage full/unavailable — just skip caching */ }
}

/* Bounding box covering this airport's whole footprint — every runway
   threshold/far-end coordinate (already-known real data, see runways.js)
   PLUS the airport's own real reference coordinate (its lat/lon in
   AIRPORTS), all padded generously.

   Why the reference coordinate matters: a runway-only bbox (what this
   used to be — just the threshold/far-end extents plus a small pad) can
   miss the terminal/apron/gate area entirely at a real hub, since
   runways are routinely several km from the terminal they serve — the
   taxiway segments actually leading to the gates would then simply never
   be fetched, and pathfinding would correctly (but unhelpfully) fail to
   find a connected route and fall back to a straight line. Anchoring the
   box on the airport's own coordinate too, not just the runways, makes
   that failure mode far less likely regardless of how the runways happen
   to be laid out relative to the terminal.

   Returns null only if this airport has no runway data at all AND isn't
   in the airport list either — nothing real to query around. */
function _airportTaxiwayBBox(iata) {
  const dirs = (typeof runwaysForAirport === 'function') ? runwaysForAirport(iata) : [];
  const apEntry = (typeof markerByCode !== 'undefined' && markerByCode[iata]) ? markerByCode[iata].ap : null;
  let south = Infinity, north = -Infinity, west = Infinity, east = -Infinity;
  dirs.forEach(d => {
    [d.threshold, d.farEnd].forEach(pt => {
      if (!pt) return;
      south = Math.min(south, pt[0]); north = Math.max(north, pt[0]);
      west = Math.min(west, pt[1]); east = Math.max(east, pt[1]);
    });
  });
  if (apEntry) {
    south = Math.min(south, apEntry.lat); north = Math.max(north, apEntry.lat);
    west = Math.min(west, apEntry.lon); east = Math.max(east, apEntry.lon);
  }
  if (!isFinite(south)) return null;
  const midLat = (south + north) / 2;
  const padLat = OSM_BBOX_PAD_KM / 111.32;
  const padLon = OSM_BBOX_PAD_KM / (111.32 * Math.max(0.15, Math.cos(midLat * Math.PI / 180)));
  return { south: south - padLat, west: west - padLon, north: north + padLat, east: east + padLon };
}

function _overpassQuery(bbox) {
  const bboxStr = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  return `[out:json][timeout:25];(way["aeroway"="taxiway"](${bboxStr});way["aeroway"="taxilane"](${bboxStr}););out geom;`;
}

/* Turns a raw Overpass response into our {id, geometry} shape. Only
   real `out geom;` coordinates ever end up here — nothing synthesized. */
function _parseOverpassElements(json) {
  const taxiways = [];
  const taxilanes = [];
  (json && Array.isArray(json.elements) ? json.elements : []).forEach(el => {
    if (el.type !== 'way' || !Array.isArray(el.geometry) || el.geometry.length < 2) return;
    const geometry = el.geometry
      .filter(pt => pt && typeof pt.lat === 'number' && typeof pt.lon === 'number')
      .map(pt => [pt.lat, pt.lon]);
    if (geometry.length < 2) return;
    const entry = { id: `osm-${el.id}`, geometry };
    if (el.tags && el.tags.aeroway === 'taxilane') taxilanes.push(entry);
    else taxiways.push(entry); // 'taxiway' and any other taxiway-ish aeroway value the query could return
  });
  return { taxiways, taxilanes };
}

async function _fetchFromOverpass(bbox) {
  const query = _overpassQuery(bbox);
  let lastError = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), OVERPASS_FETCH_TIMEOUT_MS) : null;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'data=' + encodeURIComponent(query),
        signal: controller ? controller.signal : undefined,
      });
      if (timer) clearTimeout(timer);
      if (!res.ok) {
        lastError = new Error(`Overpass ${endpoint} responded ${res.status}`);
        if (typeof _taxiDebugLog === 'function') _taxiDebugLog(`${endpoint} -> HTTP ${res.status}, trying next mirror if any`);
        continue;
      }
      const json = await res.json();
      const parsed = _parseOverpassElements(json);
      if (typeof _taxiDebugLog === 'function') {
        _taxiDebugLog(`${endpoint} -> OK, ${(json.elements || []).length} raw elements, parsed to ${parsed.taxiways.length + parsed.taxilanes.length} ways`);
      }
      return parsed;
    } catch (e) {
      if (timer) clearTimeout(timer);
      lastError = e; // try the next mirror
      if (typeof _taxiDebugLog === 'function') _taxiDebugLog(`${endpoint} -> ${e && e.name === 'AbortError' ? 'timed out' : (e && e.message) || e}, trying next mirror if any`);
    }
  }
  throw lastError || new Error('All Overpass endpoints failed');
}

/* Public: fetch (or reuse cached/in-flight) taxiway+taxilane geometry
   for one airport. ALWAYS resolves — never rejects — so callers never
   need a .catch(): on any failure (offline, timeout, CORS, rate limit,
   no runway data to build a query from) it resolves to
   { taxiways: [], taxilanes: [] } and the rest of the game simply keeps
   using its existing straight-line fallback, exactly as if this file
   weren't here.

   Failure is NOT cached permanently, unlike success — a CORS hiccup,
   rate limit, or dropped connection on one attempt shouldn't mean this
   airport is stuck falling back to straight lines for the rest of the
   browser session with no way to recover. Once TAXIWAY_RETRY_BACKOFF_MS
   has passed since a failed attempt, the next call actually retries
   against Overpass again instead of just replaying the old failure. Use
   taxiwayFetchStatus(iata) for a live status a UI can show the player,
   and onTaxiwayDataUpdated to be notified when a status changes. */
function fetchTaxiwaysForAirport(iata) {
  if (_fetchedGroundDataByIata.has(iata)) return Promise.resolve(_fetchedGroundDataByIata.get(iata));
  if (_taxiwayFetchPromises.has(iata)) return _taxiwayFetchPromises.get(iata);

  const prior = _taxiwayFetchStatus.get(iata);
  if (prior && prior.status === 'failed' && (Date.now() - prior.lastAttemptMs) < TAXIWAY_RETRY_BACKOFF_MS) {
    return Promise.resolve({ taxiways: [], taxilanes: [] }); // too soon to retry — don't hammer a struggling endpoint
  }

  const cached = _loadCachedTaxiways(iata);
  if (cached) {
    _fetchedGroundDataByIata.set(iata, cached);
    _taxiwayFetchStatus.set(iata, { status: 'success', wayCount: cached.taxiways.length + cached.taxilanes.length, lastAttemptMs: Date.now() });
    if (typeof invalidateTaxiGraphCache === 'function') invalidateTaxiGraphCache(iata);
    if (typeof _taxiDebugLog === 'function') _taxiDebugLog(iata, `using cached OSM data: ${cached.taxiways.length} taxiways, ${cached.taxilanes.length} taxilanes.`);
    return Promise.resolve(cached);
  }

  const bbox = _airportTaxiwayBBox(iata);
  if (!bbox) {
    _taxiwayFetchStatus.set(iata, { status: 'failed', lastAttemptMs: Date.now(), error: 'no bbox (no runway data, airport not found)' });
    if (typeof _taxiDebugLog === 'function') _taxiDebugLog(iata, 'no bbox could be built (no runway data and airport not found) — nothing to fetch.');
    return Promise.resolve({ taxiways: [], taxilanes: [] });
  }
  if (typeof _taxiDebugLog === 'function') _taxiDebugLog(iata, `fetching OSM taxiways/taxilanes, bbox = ${JSON.stringify(bbox)}`);
  _taxiwayFetchStatus.set(iata, { status: 'loading', lastAttemptMs: Date.now() });
  _taxiwayFetchListeners.forEach(fn => { try { fn(iata); } catch (e) { /* ignore */ } });

  const promise = _fetchFromOverpass(bbox)
    .then(data => {
      _fetchedGroundDataByIata.set(iata, data);
      _saveCachedTaxiways(iata, data);
      _taxiwayFetchStatus.set(iata, { status: 'success', wayCount: data.taxiways.length + data.taxilanes.length, lastAttemptMs: Date.now() });
      if (typeof invalidateTaxiGraphCache === 'function') invalidateTaxiGraphCache(iata);
      if (typeof _taxiDebugLog === 'function') _taxiDebugLog(iata, `Overpass fetch succeeded: ${data.taxiways.length} taxiways, ${data.taxilanes.length} taxilanes.`);
      _taxiwayFetchListeners.forEach(fn => {
        try { fn(iata); } catch (e) { /* a listener's own bug shouldn't break the others */ }
      });
      return data;
    })
    .catch((err) => {
      const empty = { taxiways: [], taxilanes: [] };
      _taxiwayFetchStatus.set(iata, { status: 'failed', lastAttemptMs: Date.now(), error: String((err && err.message) || err) });
      // Always visible, not gated behind the debug flag — a silent
      // straight-line fallback caused by a fetch failure is exactly the
      // kind of thing that shouldn't require knowing to flip a flag first.
      console.warn(`[taxi] ${iata}: Overpass fetch failed, falling back to straight lines for this airport (will retry automatically in ${Math.round(TAXIWAY_RETRY_BACKOFF_MS / 1000)}s).`, err);
      _taxiwayFetchListeners.forEach(fn => {
        try { fn(iata); } catch (e) { /* ignore */ }
      });
      return empty;
    })
    .finally(() => { _taxiwayFetchPromises.delete(iata); });

  _taxiwayFetchPromises.set(iata, promise);
  return promise;
}

/* Public: whatever's been fetched (or cached from a previous session)
   for this airport so far, synchronously — null if nothing yet (still
   in flight, or never requested). Used by taxi-graph.js's
   groundObjectsForAirport to merge into the real data set, and by the
   port editor to draw a reference overlay of the real taxiways. */
function fetchedTaxiwaysForAirport(iata) {
  return _fetchedGroundDataByIata.get(iata) || null;
}
