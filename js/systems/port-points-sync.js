/* ================================================================
   Global port points — server sync.
   ================================================================
   Port points placed via the Edit Port Points menu used to live only in
   this browser's localStorage (see save.js), which meant no other
   player, and not even this same player on a different device, ever saw
   them. This file replaces that with real shared server data:

     - loadPortPointsFromServer()  — GET, populates the in-memory
       `userPortPoints` object (js/state.js) that the rest of the game
       (taxi-graph.js, routes.js, the editor itself) already reads from.
       Called once at boot (see js/main.js) and is exactly how a player
       who joins later catches up on every point placed before they
       arrived.
     - postPortPointToServer()/deletePortPointFromServer() — used by
       js/systems/port-editor.js's addPortPoint()/removePortPoint(),
       which no longer touch `userPortPoints` until the server has
       actually confirmed the write.
     - A Socket.IO connection applies portPointAdded/portPointDeleted
       events live, for players already on the page when an admin makes a
       change — this is *in addition to* the GET above, not a substitute
       for it, since a client connecting after a point was added would
       otherwise never hear about it (see "Startup synchronization" in
       the spec this was built against).

   `userPortPoints` itself is still keyed by IATA -> array of
   { id, stopPoint: [lat, lon] }, exactly as before, so nothing in
   taxi-graph.js/routes.js/port-editor.js's rendering needs to change —
   only where that object gets populated from changes. */

/* Same-origin by default, since server/server.js serves the game's own
   static files — set this to an absolute URL (e.g.
   'https://your-deployed-server.example.com/api/port-points') if the
   frontend is ever hosted separately from the backend. */
const PORT_POINTS_API = '/api/port-points';

const ADMIN_TOKEN_STORAGE_KEY = 'aeroatlas_admin_token'; // player-specific credential, NOT global game data — localStorage is fine for this

function getAdminToken() {
  try { return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ''; } catch (e) { return ''; }
}

function setAdminToken(token) {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch (e) { /* storage unavailable — ignore */ }
}

/* Prompts once for the shared admin token and stores it for next time.
   This is a UI convenience only — the actual enforcement is the server
   rejecting the request if the token's wrong, exactly as if someone
   skipped this prompt entirely and called the API by hand. */
function promptForAdminToken() {
  const entered = window.prompt('Admin token required to edit port points:');
  if (entered) setAdminToken(entered.trim());
  return getAdminToken();
}

function pointToUserPortPoint(serverPoint) {
  return { id: serverPoint.id, stopPoint: [serverPoint.lat, serverPoint.lon] };
}

/* Merges one server point into the in-memory userPortPoints object (used
   both by the initial GET and by live socket events), re-rendering the
   editor and invalidating the taxi graph cache exactly the way the old
   local-only addPortPoint used to. */
function mergePortPointIntoState(serverPoint) {
  const iata = serverPoint.iata;
  if (!userPortPoints[iata]) userPortPoints[iata] = [];
  if (userPortPoints[iata].some(p => p.id === serverPoint.id)) return; // already have it
  userPortPoints[iata].push(pointToUserPortPoint(serverPoint));
  if (typeof invalidateTaxiGraphCache === 'function') invalidateTaxiGraphCache(iata);
  if (typeof refreshPortEditorMarkers === 'function') refreshPortEditorMarkers();
}

function removePortPointFromState(iata, id) {
  if (!userPortPoints[iata]) return;
  userPortPoints[iata] = userPortPoints[iata].filter(p => p.id !== id);
  if (!userPortPoints[iata].length) delete userPortPoints[iata];
  if (typeof invalidateTaxiGraphCache === 'function') invalidateTaxiGraphCache(iata);
  if (typeof refreshPortEditorMarkers === 'function') refreshPortEditorMarkers();
}

/* ---------------- GET: catch up on everything that already exists ---------------- */
async function loadPortPointsFromServer() {
  const response = await fetch(PORT_POINTS_API);
  if (!response.ok) throw new Error('Could not load port points');
  const serverPoints = await response.json();
  serverPoints.forEach(mergePortPointIntoState);
  return serverPoints;
}

/* ---------------- POST/DELETE: admin-only writes ----------------
   Both throw on failure (including a 401 from a missing/stale admin
   token) rather than silently no-op-ing, so port-editor.js's callers can
   decide how to surface that to the person clicking — and, per spec,
   never mark a point as saved locally until the server has actually
   confirmed it. */
async function postPortPointToServer(iata, lat, lon) {
  let token = getAdminToken();
  if (!token) token = promptForAdminToken();
  const response = await fetch(PORT_POINTS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify({ iata, lat, lon }),
  });
  if (response.status === 401) {
    setAdminToken(''); // stale/wrong token — clear it so the next attempt re-prompts instead of failing silently forever
    throw new Error('Admin token was missing or incorrect — port point was not saved.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Port point could not be saved.');
  }
  return response.json();
}

async function deletePortPointFromServer(id) {
  let token = getAdminToken();
  if (!token) token = promptForAdminToken();
  const response = await fetch(`${PORT_POINTS_API}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': token },
  });
  if (response.status === 401) {
    setAdminToken('');
    throw new Error('Admin token was missing or incorrect — port point was not deleted.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Port point could not be deleted.');
  }
  return response.json();
}

/* ---------------- Real-time: live updates for already-open sessions ---------------- */
function initPortPointsRealtime() {
  if (typeof io !== 'function') return; // Socket.IO client script not present — GET-on-load still works fine without it
  const socket = io();
  socket.on('portPointAdded', (point) => mergePortPointIntoState(point));
  socket.on('portPointDeleted', ({ id, iata }) => removePortPointFromState(iata, id));
  // Fired after an admin hits "Import Real Airport Stands" -> reload
  // (see requestPortPointsReload below) once the OSM importer has
  // written new points to server/data/port-points.json on disk. Every
  // connected client — including the admin's own browser — just re-runs
  // the same GET-on-load merge it already does at boot; mergePortPointIntoState
  // skips anything it already has, so this is safe to receive repeatedly.
  socket.on('portPointsReloaded', () => {
    loadPortPointsFromServer().catch(e =>
      console.error('[aeroatlas] Could not re-sync port points after reload:', e.message)
    );
  });
}

/* ---------------- Admin: pick up points the OSM importer wrote to disk ----------------
   Tells the server to re-read server/data/port-points.json (the OSM
   importer, run separately via IMPORT_REAL_PORT_POINTS.bat, writes
   straight to that file and has no way to reach this running server
   process on its own) and broadcasts portPointsReloaded so every
   connected client, including this one, re-syncs. Throws the same way
   postPortPointToServer/deletePortPointFromServer do, so the caller
   (port-editor.js's "Import Real Airport Stands" button) can surface a
   real error instead of silently doing nothing. */
async function requestPortPointsReload() {
  let token = getAdminToken();
  if (!token) token = promptForAdminToken();
  const response = await fetch(`${PORT_POINTS_API}/reload`, {
    method: 'POST',
    headers: { 'x-admin-token': token },
  });
  if (response.status === 401) {
    setAdminToken('');
    throw new Error('Admin token was missing or incorrect — could not reload.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Server could not reload port points from disk.');
  }
  const body = await response.json();
  await loadPortPointsFromServer(); // pull the (possibly larger) set into this browser too
  return body; // { ok: true, count }
}

/* ---------------- One-time migration ----------------
   Moves any points this browser already had locally (from the old
   localStorage-only save, captured into window._legacyLocalPortPoints by
   save.js before it stopped writing userPortPoints into the save file)
   up to the server, skipping any whose id the server already has. Only
   actually does anything if an admin token is set, since the server
   rejects the writes otherwise — for anyone else it's a silent no-op, not
   an error, since a non-admin browser having stale local points isn't
   something the player needs to be bothered about. */
async function migrateLocalPortPointsToServer() {
  const legacy = window._legacyLocalPortPoints;
  if (!legacy || typeof legacy !== 'object') return;
  const token = getAdminToken();
  if (!token) return;

  const knownIds = new Set();
  Object.values(userPortPoints).forEach(list => list.forEach(p => knownIds.add(p.id)));

  for (const iata of Object.keys(legacy)) {
    const list = legacy[iata];
    if (!Array.isArray(list)) continue;
    for (const p of list) {
      if (!p || knownIds.has(p.id) || !Array.isArray(p.stopPoint) || p.stopPoint.length !== 2) continue;
      try {
        const saved = await postPortPointToServer(iata, p.stopPoint[0], p.stopPoint[1]);
        mergePortPointIntoState(saved);
      } catch (e) {
        console.warn('[aeroatlas] Could not migrate a local port point to the server:', e.message);
        return; // stop on the first failure (e.g. bad token) rather than repeatedly prompting
      }
    }
  }
}

/* Called once from js/main.js at boot: load the shared world state first,
   then upload anything this browser had locally that the server doesn't
   know about yet, then start listening for live updates. */
async function initGlobalPortPoints() {
  try {
    await loadPortPointsFromServer();
  } catch (e) {
    console.error('[aeroatlas] Could not load global port points from the server:', e.message);
  }
  try {
    await migrateLocalPortPointsToServer();
  } catch (e) {
    console.error('[aeroatlas] Port point migration failed:', e.message);
  }
  initPortPointsRealtime();
}
