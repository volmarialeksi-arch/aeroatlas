/* ================================================================
   AeroAtlas backend — the minimal persistent server this project was
   missing. Before this file existed, the whole game was static
   HTML/CSS/JS with no server component at all, so "global" data (data
   every player should see) had nowhere to live except each individual
   browser's localStorage — which is exactly the bug this server fixes
   for port points.

   What this does:
     - Serves the game's existing static files (index.html, js/, css/,
       assets/) so the whole project still runs from a single command.
     - Persists global port points to a JSON file on disk
       (server/data/port-points.json), survives restarts.
     - Exposes GET/POST/DELETE /api/port-points (see README.md in this
       folder for the full contract).
     - Broadcasts portPointAdded/portPointDeleted over Socket.IO so every
       connected player's map updates immediately, in addition to the
       GET a fresh page load uses to catch up on everything that already
       existed.
     - Requires a shared admin token (header: x-admin-token) on POST/DELETE
       — the frontend's "am I admin" check is only ever a UI convenience;
       this is the actual enforcement point, since nothing stops a player
       from calling the API directly.

   This is intentionally NOT a real user-account system — the project had
   none to begin with. A single shared secret is the simplest thing that
   satisfies "only admins can write" for a project at this stage. If the
   game later grows real accounts/sessions, swap requireAdmin's body for
   a real session/role check; everything else here stays the same.
   ================================================================ */
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');

const PORT = process.env.PORT || 3000;

/* Shared secret required on POST/DELETE. Set ADMIN_TOKEN in the real
   deployment's environment — this fallback exists only so the server is
   runnable out of the box for local testing/dev, and prints a loud
   warning so nobody mistakes it for something safe to ship. */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-admin-token-change-me';
if (!process.env.ADMIN_TOKEN) {
  console.warn(
    '[aeroatlas] WARNING: ADMIN_TOKEN is not set — using the built-in dev ' +
    'default. Anyone who reads this source can add/delete port points. ' +
    'Set a real ADMIN_TOKEN environment variable before deploying.'
  );
}

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'port-points.json');
const PROJECT_ROOT = path.join(__dirname, '..');

/* ---------------- Persistent storage ----------------
   Simplest thing that actually persists across a server restart for a
   project with no database of any kind yet: one JSON file, read into
   memory on boot, rewritten (atomically — write to a temp file, then
   rename over the real one, so a crash mid-write can never leave a
   half-written/corrupt file) after every mutation. This is the "simplest
   possible solution using persistent storage that fits the project's
   existing environment" called for — swap this module out for a real
   database later without touching any of the route handlers below, since
   they only ever call load()/save() and never touch the file directly. */
let portPoints = [];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]\n', 'utf8');
}

function loadPortPointsFromDisk() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    portPoints = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('[aeroatlas] Could not read port-points.json, starting empty:', e.message);
    portPoints = [];
  }
}

async function persistPortPointsToDisk() {
  const tmpFile = `${DATA_FILE}.tmp-${process.pid}-${Date.now()}`;
  await fsp.writeFile(tmpFile, JSON.stringify(portPoints, null, 2), 'utf8');
  await fsp.rename(tmpFile, DATA_FILE); // atomic on the same filesystem
}

loadPortPointsFromDisk();

/* ---------------- App / server / sockets ---------------- */
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

function requireAdmin(req, res, next) {
  const token = req.get('x-admin-token');
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Admin authorization required (missing or invalid x-admin-token).' });
  }
  next();
}

function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

/* ---------------- API: /api/port-points ----------------
   Point shape: { id, iata, lat, lon, createdAt, createdBy }. `iata` is
   included because this game's port points are always attached to a
   specific airport (see js/systems/port-editor.js / js/state.js's
   userPortPoints, keyed the same way) — a bare lat/lon with no airport
   context wouldn't be usable by the rest of the game at all. */
app.get('/api/port-points', (req, res) => {
  res.json(portPoints);
});

app.post('/api/port-points', requireAdmin, async (req, res) => {
  const { iata, lat, lon } = req.body || {};
  if (typeof iata !== 'string' || !iata.trim()) {
    return res.status(400).json({ error: 'iata (string) is required.' });
  }
  if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) {
    return res.status(400).json({ error: 'lat and lon (numbers) are required.' });
  }
  const point = {
    id: crypto.randomUUID(),
    iata: iata.trim().toUpperCase(),
    lat,
    lon,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  };
  portPoints.push(point);
  try {
    await persistPortPointsToDisk();
  } catch (e) {
    portPoints.pop(); // don't leave in-memory state ahead of what's actually on disk
    console.error('[aeroatlas] Failed to persist new port point:', e);
    return res.status(500).json({ error: 'Could not save port point.' });
  }
  io.emit('portPointAdded', point);
  res.status(201).json(point);
});

/* ---------------- Admin: reload from disk ----------------
   The OSM importer (scripts/import-real-port-points.js /
   IMPORT_REAL_PORT_POINTS.bat) runs as a completely separate, one-off
   process on whatever machine the admin double-clicks the .bat file on
   — it writes straight to server/data/port-points.json on disk and has
   no way to reach this running server process directly (and shouldn't:
   see the note in server/README.md about not exposing shell execution
   to players). This endpoint is how the *admin*, after running the
   importer, tells the already-running server "the file changed under
   you, re-read it" without needing a full process restart. It's
   additive/idempotent from the browser's point of view: every
   currently-connected client just re-runs the same GET-on-load merge
   (mergePortPointIntoState in port-points-sync.js) it already does at
   boot, which is a no-op for points it already has. */
app.post('/api/port-points/reload', requireAdmin, (req, res) => {
  const before = portPoints.length;
  try {
    loadPortPointsFromDisk();
  } catch (e) {
    console.error('[aeroatlas] Failed to reload port points from disk:', e);
    return res.status(500).json({ error: 'Could not reload port points from disk.' });
  }
  const after = portPoints.length;
  console.log(`[aeroatlas] Port points reloaded from disk: ${before} -> ${after}`);
  io.emit('portPointsReloaded', { count: after });
  res.json({ ok: true, count: after });
});

app.delete('/api/port-points/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const idx = portPoints.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'No port point with that id.' });
  const [removed] = portPoints.splice(idx, 1);
  try {
    await persistPortPointsToDisk();
  } catch (e) {
    portPoints.splice(idx, 0, removed); // roll back the in-memory removal
    console.error('[aeroatlas] Failed to persist port point deletion:', e);
    return res.status(500).json({ error: 'Could not delete port point.' });
  }
  io.emit('portPointDeleted', { id: removed.id, iata: removed.iata });
  res.json({ ok: true, id: removed.id });
});

/* ---------------- Static file serving ----------------
   Serves the game itself, so `npm start` in this folder is enough to run
   the whole project (frontend + API + realtime) from one process/port —
   no separate static server, no CORS to configure for the common case. */
app.use(express.static(PROJECT_ROOT));

io.on('connection', (socket) => {
  // No per-socket state needed: GET /api/port-points is what a freshly
  // connected client uses to catch up on everything that already
  // existed (see "Startup synchronization" in the spec) — this socket is
  // purely for live portPointAdded/portPointDeleted pushes from here on.
  socket.on('disconnect', () => {});
});

server.listen(PORT, () => {
  console.log(`[aeroatlas] Server listening on http://localhost:${PORT}`);
  console.log(`[aeroatlas] ${portPoints.length} port point(s) loaded from ${DATA_FILE}`);
});

module.exports = { app, server, io };
