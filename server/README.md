# AeroAtlas server

Minimal backend that makes admin-placed port points global, persistent
game-world data instead of browser-local `localStorage` data. Also serves
the game's static files, so this one process is enough to run everything.

## Run it

```bash
cd server
npm install
ADMIN_TOKEN="pick-a-real-secret" npm start
```

Then open `http://localhost:3000` (the game itself, served by this same
process) instead of opening `index.html` directly from disk.

If `ADMIN_TOKEN` isn't set, the server falls back to a hardcoded dev token
(`dev-admin-token-change-me`) and prints a warning on boot. That fallback
is only for local testing — set a real `ADMIN_TOKEN` before letting anyone
else reach this server.

## Important: this needs to actually be hosted somewhere

This project previously had **no backend at all** — it was static files
you could open directly in a browser. That's why port points only ever
lived in `localStorage`: there was nowhere else to put them.

This server fixes that, but it's a real process that has to be *running
and reachable* for players to share data through it. For the "Player A
adds a point, Player B sees it" flow to actually work between two real
people, this server needs to be deployed somewhere both players' browsers
can reach (a VM, a container host, a PaaS like Render/Fly/Railway, etc.),
and the frontend's `PORT_POINTS_API` / Socket.IO connection (see
`js/systems/port-points-sync.js`) needs to point at that server's real
URL if the game isn't being served by this same process. Running it only
inside a local sandbox, or opening `index.html` as a `file://` URL, will
not let two different people's browsers see the same data — there needs
to be one server both of them can actually talk to.

## Data storage

Port points are stored in `server/data/port-points.json`, an array of:

```json
{
  "id": "generated-uuid",
  "iata": "HEL",
  "lat": 60.4518,
  "lon": 22.2666,
  "createdAt": "2026-08-16T12:00:00.000Z",
  "createdBy": "admin"
}
```

`iata` is included (beyond the minimal example in the spec) because this
game's port points are always attached to a specific airport — see
`js/state.js`'s `userPortPoints`, keyed the same way — so a bare lat/lon
with no airport context wouldn't be usable by the rest of the game.

The file is rewritten atomically (write to a temp file, then rename) on
every change, so a crash mid-write can't corrupt it. Swap
`loadPortPointsFromDisk`/`persistPortPointsToDisk` in `server.js` for a
real database later without touching any of the route handlers — they
only ever call those two functions.

## API

### `GET /api/port-points`
Returns every global port point. No auth required — every player can read.

```json
[{ "id": "...", "iata": "HEL", "lat": 60.4518, "lon": 22.2666, "createdAt": "...", "createdBy": "admin" }]
```

### `POST /api/port-points`
Requires header `x-admin-token: <ADMIN_TOKEN>`. Body:

```json
{ "iata": "HEL", "lat": 60.4518, "lon": 22.2666 }
```

Returns the created point (201) with a server-generated `id`/`createdAt`.
`401` if the token is missing/wrong, `400` if `iata`/`lat`/`lon` are
missing or invalid.

### `DELETE /api/port-points/:id`
Requires the same `x-admin-token` header. `200` with `{ ok: true, id }` on
success, `404` if no point has that id, `401` if unauthorized.

## Real-time updates

Socket.IO runs on the same HTTP server/port. On every successful POST/DELETE,
the server emits `portPointAdded` / `portPointDeleted` to every connected
client, so open tabs update immediately without needing to poll or reload.
A fresh page load still always does the `GET` first — the socket events are
an addition for already-open sessions, not a replacement for it (a client
that connects after a point was added would otherwise never hear about it).

## Bulk-importing real parking positions from OpenStreetMap

`scripts/import-real-port-points.js` (project root) fetches real
`aeroway=parking_position` nodes/ways from OpenStreetMap's public Overpass
API for every airport in `js/data/airports.js` and merges them straight
into `server/data/port-points.json` — the same file this server loads at
boot. Run it, then (re)start the server so it picks up the new file:

```bash
node scripts/import-real-port-points.js
cd server && npm start
```

Requires Node 18+ and normal outbound internet access to
`overpass-api.de` and its mirrors (see the script's header comment for
the full list/fallback order) — it will NOT work from a sandbox with a
locked-down egress allowlist. It's polite about the public API: 5
airports per Overpass query, ~1.5s between batches, so a full 254-airport
run takes a few minutes.

It never overwrites existing data — any point already in
`port-points.json` (admin-placed, or from an earlier run of this same
script) is preserved; a newly-fetched point is only skipped if it's an
exact re-fetch (same id) or within 3m of an existing point at the same
airport. Review `server/data/port-point-import-report.json` afterward,
especially any airport marked `NO_OSM_PARKING_POSITIONS_FOUND` (OSM
genuinely has no parking positions mapped there yet — needs a manually
verified source, never an invented coordinate) or
`OVERPASS_QUERY_FAILED` (a transient fetch error — safe to just re-run
the script, since it merges rather than overwrites).

## Migrating each admin's already-placed local points

Existing installs may already have points sitting in individual browsers'
`localStorage` (the old per-browser save). There's no way for this server
to reach into someone else's browser storage on its own, so migration is
client-initiated: the frontend (`js/systems/port-points-sync.js`,
`migrateLocalPortPointsToServer()`) checks, once per admin session, for any
locally-saved points that aren't yet present on the server (by id) and
POSTs them up automatically — see that file's comments for details. This
runs automatically the next time whoever has the admin token open the
game, so no manual step is required for the common case of "the person who
placed the points is also the admin."
