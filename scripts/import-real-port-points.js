/**
 * AeroAtlas — REAL AIRPORT PORT-POINT IMPORTER
 *
 * PURPOSE
 * -------
 * Imports real aircraft parking positions from OpenStreetMap into:
 *
 *   server/data/port-points.json
 *
 * The game's "port point" is a parking position where the aircraft can
 * stand for boarding/disembarking. In OpenStreetMap this is normally
 * mapped as aeroway=parking_position.
 *
 * IMPORTANT:
 * - aeroway=gate is NOT used as the primary source here. In OSM a gate is
 *   the passenger waiting/boarding location inside the terminal, while
 *   parking_position is the aircraft stand. The current AeroAtlas code
 *   uses port points as PARKING_POSITION nodes in its taxi graph.
 * - OSM coverage is not guaranteed to be complete for every airport.
 *   The script records the OSM element id/ref so airports that returned
 *   zero points can be reviewed separately.
 * - NEVER invents, estimates, or evenly distributes coordinates. A point
 *   only ever comes from a real aeroway=parking_position element
 *   returned by Overpass.
 *
 * HOW TO USE
 * ----------
 * 1. This file lives in scripts/import-real-port-points.js — it resolves
 *    every path relative to the project root, so it works from any
 *    working directory.
 * 2. Make sure Node.js 18+ is installed.
 * 3. Run, from anywhere inside the project:
 *
 *      node scripts/import-real-port-points.js
 *
 *    or just double-click IMPORT_REAL_PORT_POINTS.bat in the project
 *    root, which does the same thing with some up-front checks.
 *
 * 4. The script reads airport coordinates from js/data/airports.js.
 *
 * 5. It queries OpenStreetMap Overpass ONE AIRPORT AT A TIME (see
 *    "RATE LIMITING" below) and MERGES the result into
 *    server/data/port-points.json — never overwrites. Any point already
 *    in that file (a previous OSM import, or a point an admin placed by
 *    hand through the in-game editor) is kept. A newly-fetched OSM point
 *    is only added if it isn't a near-duplicate (<=3m) of a point
 *    already on file for that same airport, or if this exact OSM element
 *    was already imported before (same `id`). See mergeImportedPoints().
 *
 * 6. Progress is saved to disk after EVERY airport, not just at the end
 *    — both port-points.json and port-point-import-report.json. If the
 *    importer is interrupted (closed, crashes, loses network) partway
 *    through, nothing already written is lost, and re-running picks up
 *    where it left off (see RESUMABILITY below).
 *
 * RESUMABILITY / CLI FLAGS
 * -------------------------
 * By default, re-running this script SKIPS any airport that already has
 * a definitive result on file (a previous SUCCESS or a confirmed
 * NO_OSM_DATA — both are real answers from OSM, not failures) and only
 * (re)processes airports that are missing or previously failed
 * (RATE_LIMITED / TIMEOUT / NETWORK_ERROR / SERVER_ERROR). This is what
 * makes the importer safe to just run again after a partial/interrupted
 * run — it always continues with the next unresolved airports, never
 * restarts from #1.
 *
 *   node scripts/import-real-port-points.js
 *     Resume mode, no cap: processes every remaining unresolved airport
 *     in one run. Fine for an unattended machine; on a normal desktop
 *     you'll usually want --limit instead (see below) so a single
 *     double-click of the .bat file doesn't try to do all 254 at once.
 *
 *   node scripts/import-real-port-points.js --limit 10
 *     Same resume behavior, but stops after (at most) 10 airports. This
 *     is what IMPORT_REAL_PORT_POINTS.bat runs by default. Running the
 *     exact same command again automatically continues with the NEXT
 *     10 unresolved airports — nothing needs to track "where you left
 *     off" separately, because whatever succeeded (or was confirmed
 *     zero-result) last time is now excluded from this run's candidates.
 *     Also works as --limit 20, --limit 25, --limit 50, etc.
 *
 *   node scripts/import-real-port-points.js --airport MCO
 *     Processes exactly one specific airport (by IATA code), regardless
 *     of its current status — useful for troubleshooting one airport by
 *     hand. Cannot be combined with --force or --retry-failed.
 *
 *   node scripts/import-real-port-points.js --retry-failed
 *     Only (re)processes airports whose last known status was a
 *     FAILURE (RATE_LIMITED / TIMEOUT / NETWORK_ERROR / SERVER_ERROR).
 *     Airports that were never attempted at all, or that already
 *     succeeded (including a confirmed zero-result), are skipped. Can
 *     be combined with --limit to retry only the next N failures.
 *
 *   node scripts/import-real-port-points.js --force
 *     Ignores all previous results and re-queries every one of the 254
 *     airports from scratch (or just the next --limit of them, if
 *     combined). Existing points are still never deleted — re-fetched
 *     OSM elements just merge back in as no-op duplicates (same OSM id,
 *     or within 3m of what's already there for that airport), and a
 *     failed refresh attempt leaves the previous good result untouched.
 *     Use this only if you deliberately want to refresh everything
 *     (e.g. you suspect OSM data changed).
 *
 * RATE LIMITING
 * -------------
 * Earlier versions of this script queried 5 airports per Overpass
 * request. In practice the public Overpass mirrors rate-limit
 * aggressively enough that most batches came back HTTP 429 (Too Many
 * Requests), HTTP 406, or HTTP 504 (Gateway Timeout), and an entire
 * 5-airport batch was marked failed together even if only the request
 * itself, not the underlying data, was the problem.
 *
 * This version:
 *   - queries ONE airport per Overpass request (see BATCH_SIZE),
 *   - waits a substantial, jittered delay between requests
 *     (REQUEST_INTERVAL_MS below),
 *   - on HTTP 429, reads and respects the Retry-After header if the
 *     server sent one; otherwise backs off exponentially,
 *   - on HTTP 504 (or a client-side request timeout), also backs off
 *     exponentially,
 *   - on any OTHER non-OK HTTP status (406, 500, 502, 503, ...), backs
 *     off and records it as SERVER_ERROR — distinct from a genuine
 *     network failure (DNS, connection refused, no response at all),
 *   - puts whichever endpoint just rate-limited/errored into a
 *     "cooldown" and rotates to a different endpoint instead of
 *     hammering the same one again immediately,
 *   - only marks an airport as failed for THIS RUN after several
 *     attempts across multiple endpoints and backoff rounds are all
 *     exhausted — and even then, that's not permanent: a later
 *     `--retry-failed` run will pick it back up, and processing
 *     continues with the next airport instead of getting stuck.
 *
 * A failed REQUEST (429/504/406/500/network error) is never recorded as
 * "OSM has no parking positions here" (a request that SUCCEEDED and
 * returned zero results) — see the distinct status values below.
 * Conflating the two would risk permanently treating a well-mapped
 * airport as if it had no stands, just because Overpass was busy.
 *
 * REPORT STATUS VALUES (server/data/port-point-import-report.json,
 * per airport):
 *   "SUCCESS"        — query succeeded, 1+ parking positions found
 *   "NO_OSM_DATA"     — query succeeded, 0 parking positions found
 *   "RATE_LIMITED"    — every attempt got HTTP 429
 *   "TIMEOUT"         — every attempt got HTTP 504 or timed out client-side
 *   "SERVER_ERROR"    — every attempt got some other non-OK HTTP status
 *                        (406, 500, 502, 503, ...)
 *   "NETWORK_ERROR"   — every attempt failed with no HTTP response at
 *                        all (DNS failure, connection refused, etc.)
 *
 * AIRPORT_CODES below covers all 254 airports currently in
 * js/data/airports.js.
 *
 * NETWORK NOTE: this script needs real, unrestricted outbound internet
 * access to reach the public Overpass endpoints below. It will NOT run
 * to completion in a locked-down sandbox (e.g. an egress allowlist that
 * doesn't include overpass-api.de and friends) — every request will fail
 * and every airport will be marked as a failure status. Run it on a
 * machine/CI runner with normal internet access.
 */

const fs = require('fs');
const path = require('path');

const AIRPORT_CODES = [
  "MCO",
  "JFK",
  "LAX",
  "ORD",
  "ATL",
  "DFW",
  "SFO",
  "SEA",
  "MIA",
  "IAH",
  "DEN",
  "LAS",
  "RSW",
  "IAD",
  "MCI",
  "PIT",
  "SLC",
  "DTW",
  "PHL",
  "CLT",
  "MSP",
  "PHX",
  "DCA",
  "BOS",
  "EWR",
  "TPA",
  "PDX",
  "SMF",
  "RDU",
  "BNA",
  "AUS",
  "IND",
  "SDF",
  "CVG",
  "MEM",
  "MSY",
  "BWI",
  "CLE",
  "CMH",
  "STL",
  "DAL",
  "SAT",
  "FLL",
  "HNL",
  "ANC",
  "JAX",
  "OKC",
  "ABQ",
  "TUS",
  "YYZ",
  "YVR",
  "YYC",
  "YUL",
  "MEX",
  "GRU",
  "EZE",
  "BOG",
  "LIM",
  "CGH",
  "VCP",
  "MDE",
  "AEP",
  "BSB",
  "REC",
  "CNF",
  "SSA",
  "CTG",
  "CLO",
  "UIO",
  "GYE",
  "POA",
  "CWB",
  "FOR",
  "BEL",
  "VVI",
  "CCS",
  "FLN",
  "MAO",
  "ASU",
  "COR",
  "MDZ",
  "MVD",
  "CGB",
  "VIX",
  "GYN",
  "NAT",
  "MCZ",
  "BPS",
  "IGU",
  "SLZ",
  "JPA",
  "AJU",
  "SLA",
  "BRC",
  "USH",
  "AQP",
  "CUZ",
  "ANF",
  "CCP",
  "CJC",
  "PMC",
  "LPB",
  "GIG",
  "SCL",
  "LHR",
  "CDG",
  "FRA",
  "AMS",
  "MAD",
  "FCO",
  "IST",
  "SVO",
  "ZRH",
  "CPH",
  "OSL",
  "HEL",
  "REK",
  "DME",
  "VIE",
  "WAW",
  "ATH",
  "BCN",
  "MUC",
  "LGW",
  "DUB",
  "LIS",
  "ORY",
  "PMI",
  "MAN",
  "MXP",
  "STN",
  "AGP",
  "BER",
  "BRU",
  "ARN",
  "DUS",
  "LED",
  "ALC",
  "BUD",
  "GVA",
  "PRG",
  "LTN",
  "OTP",
  "EDI",
  "OPO",
  "BGY",
  "VKO",
  "NCE",
  "HAM",
  "BHX",
  "NAP",
  "KRK",
  "CTA",
  "VCE",
  "VLC",
  "JNB",
  "CAI",
  "LOS",
  "NBO",
  "ADD",
  "CMN",
  "HRG",
  "CPT",
  "RAK",
  "ALG",
  "SSH",
  "TUN",
  "ABV",
  "DUR",
  "ACC",
  "AGA",
  "DAR",
  "DSS",
  "RMF",
  "TNG",
  "ZNZ",
  "EBB",
  "ABJ",
  "ORN",
  "DJE",
  "RBA",
  "DXB",
  "DOH",
  "JED",
  "RUH",
  "AUH",
  "MCT",
  "DEL",
  "BOM",
  "BKK",
  "KUL",
  "CGK",
  "MNL",
  "BLR",
  "SGN",
  "HAN",
  "DPS",
  "DAC",
  "KTM",
  "HYD",
  "DMK",
  "PEK",
  "PVG",
  "HKG",
  "NRT",
  "HND",
  "ICN",
  "SIN",
  "CAN",
  "SZX",
  "TFU",
  "PKX",
  "KMG",
  "CKG",
  "XIY",
  "SHA",
  "HGH",
  "CGO",
  "WUH",
  "TAO",
  "KIX",
  "CTU",
  "NKG",
  "FUK",
  "CTS",
  "CJU",
  "GMP",
  "PUS",
  "TPE",
  "SYD",
  "MEL",
  "AKL",
  "BNE",
  "PER",
  "ADL",
  "CHC",
  "OOL",
  "WLG",
  "CNS",
  "CBR",
  "HBA",
  "ZQN",
  "DRW",
  "MCY",
  "TSV",
  "AVV",
  "NTL",
  "NSN",
  "DUD",
  "MKY",
  "NPE",
  "CFS",
  "PMR",
  "ROK"
];
const PROJECT_ROOT = path.join(__dirname, '..'); // this file lives in scripts/, project root is one level up
const AIRPORTS_FILE = path.join(PROJECT_ROOT, 'js', 'data', 'airports.js');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'server', 'data', 'port-points.json');
const REPORT_FILE = path.join(PROJECT_ROOT, 'server', 'data', 'port-point-import-report.json');

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
// Per-endpoint rate-limit state. cooldownUntil is a Date.now()-style
// timestamp; the endpoint is skipped until then. Starts at 0 (available).
const ENDPOINT_STATE = OVERPASS_ENDPOINTS.map(url => ({ url, cooldownUntil: 0 }));
let endpointRotation = 0; // rotates across calls so consecutive airports don't all start on the same endpoint

const SEARCH_RADIUS_METERS = 8000;
const BATCH_SIZE = 1; // one airport per Overpass request — see header comment "RATE LIMITING"
const REQUEST_INTERVAL_MS = 4000; // base delay between successive airport requests
const REQUEST_INTERVAL_JITTER_MS = 2000; // + random 0-2000ms on top, so requests don't land in lockstep
const REQUEST_TIMEOUT_MS = 45000;
const OSM_TAG = 'parking_position';

const MAX_ATTEMPTS_PER_AIRPORT = 8; // across all endpoints/rounds combined, before giving up for THIS run
const RATE_LIMIT_BASE_MS = 20000; // 20s, doubles each attempt (exponential backoff), unless Retry-After says otherwise
const RATE_LIMIT_MAX_MS = 5 * 60 * 1000; // cap at 5 min
const TIMEOUT_BASE_MS = 8000; // 8s, doubles each attempt
const TIMEOUT_MAX_MS = 2 * 60 * 1000; // cap at 2 min
const MAX_ENDPOINT_WAIT_MS = 90 * 1000; // don't block more than 90s waiting for a cooling-down endpoint to free up

const SUCCESS_STATUSES = new Set(['SUCCESS', 'NO_OSM_DATA']);
const FAILURE_STATUSES = new Set(['RATE_LIMITED', 'TIMEOUT', 'NETWORK_ERROR', 'SERVER_ERROR']);

// Older versions of this script used different status strings. When
// resuming from a report written by one of those versions, these are
// normalized to the current vocabulary (see loadExistingReport) so a
// previous run's progress (including the 721 points from an earlier
// batch-based run) is still recognized as resolved and not re-queried.
const LEGACY_STATUS_MAP = {
  ok: 'SUCCESS',
  NO_OSM_PARKING_POSITIONS_FOUND: 'NO_OSM_DATA',
  OVERPASS_QUERY_FAILED: 'NETWORK_ERROR',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readAirportCenters() {
  const source = fs.readFileSync(AIRPORTS_FILE, 'utf8');

  const re = /\{\s*iata\s*:\s*["']([A-Z0-9]+)["'][\s\S]*?\blat\s*:\s*(-?\d+(?:\.\d+)?)[,\s]+\blon\s*:\s*(-?\d+(?:\.\d+)?)[^}]*\}/g;

  const result = new Map();
  let match;

  while ((match = re.exec(source))) {
    result.set(match[1], {
      iata: match[1],
      lat: Number(match[2]),
      lon: Number(match[3]),
    });
  }

  return result;
}

function haversineMeters(aLat, aLon, bLat, bLon) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) *
    Math.cos(toRad(bLat)) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function buildQuery(airports) {
  const parts = airports.map(ap =>
    `nwr(around:${SEARCH_RADIUS_METERS},${ap.lat},${ap.lon})["aeroway"="${OSM_TAG}"];`
  );

  return `[out:json][timeout:55];(${parts.join('')});out center tags;`;
}

function parseRetryAfterMs(headerValue) {
  if (!headerValue) return null;
  const asSeconds = Number(headerValue);
  if (Number.isFinite(asSeconds)) return Math.max(0, asSeconds * 1000);
  const asDate = new Date(headerValue);
  if (!isNaN(asDate.getTime())) return Math.max(0, asDate.getTime() - Date.now());
  return null;
}

/* Picks the next available (not-cooling-down) Overpass endpoint,
 * rotating across calls. If every endpoint is currently cooling down
 * (e.g. all three just got rate-limited), waits for whichever frees up
 * soonest instead of hammering any of them — capped at
 * MAX_ENDPOINT_WAIT_MS so a single airport can't stall the whole run
 * indefinitely; if the cooldown is longer than that, it just tries
 * anyway (better to occasionally get another 429 than to hang). */
async function pickEndpoint() {
  for (let i = 0; i < ENDPOINT_STATE.length; i++) {
    const idx = (endpointRotation + i) % ENDPOINT_STATE.length;
    if (ENDPOINT_STATE[idx].cooldownUntil <= Date.now()) {
      endpointRotation = (idx + 1) % ENDPOINT_STATE.length;
      return ENDPOINT_STATE[idx];
    }
  }

  const soonest = ENDPOINT_STATE.reduce((a, b) => (a.cooldownUntil < b.cooldownUntil ? a : b));
  const waitMs = Math.min(Math.max(soonest.cooldownUntil - Date.now(), 0), MAX_ENDPOINT_WAIT_MS);
  if (waitMs > 0) {
    console.log(`    All Overpass endpoints are cooling down — waiting ${Math.round(waitMs / 1000)}s...`);
    await sleep(waitMs);
  }
  endpointRotation = (ENDPOINT_STATE.indexOf(soonest) + 1) % ENDPOINT_STATE.length;
  return soonest;
}

/* Queries Overpass for ONE airport, with exponential backoff + endpoint
 * rotation on HTTP 429/504/other-error-status/network errors. Respects a
 * Retry-After header when the server sends one. Only throws (giving up
 * for THIS run) after MAX_ATTEMPTS_PER_AIRPORT attempts across
 * endpoints/backoff rounds are exhausted; the thrown error's
 * `.classification` tells the caller whether that was rate-limiting, a
 * timeout, a server error, or a network error, so a failed REQUEST is
 * never confused with a successful request that genuinely found zero
 * results. On success, returns { json, attempts } — attempts is how many
 * HTTP requests it took, for the report's "attempts" field. */
async function fetchOverpassForAirport(query, label) {
  let lastClassification = 'NETWORK_ERROR';
  let lastMessage = 'Unknown error';

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_AIRPORT; attempt++) {
    const endpointState = await pickEndpoint();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpointState.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        const json = await response.json();
        return { json, attempts: attempt + 1 };
      }

      if (response.status === 429) {
        const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
        const backoff = retryAfterMs != null
          ? retryAfterMs
          : Math.min(RATE_LIMIT_BASE_MS * (2 ** attempt), RATE_LIMIT_MAX_MS);
        endpointState.cooldownUntil = Date.now() + backoff;
        lastClassification = 'RATE_LIMITED';
        lastMessage = `${endpointState.url} returned HTTP 429 (rate limited)`;
        console.log(
          `    [${label}] HTTP 429 from ${endpointState.url}` +
          (retryAfterMs != null ? ` (Retry-After: ${Math.round(retryAfterMs / 1000)}s)` : '') +
          ` — cooling that endpoint down ${Math.round(backoff / 1000)}s, trying another...`
        );
        continue;
      }

      if (response.status === 504) {
        const backoff = Math.min(TIMEOUT_BASE_MS * (2 ** attempt), TIMEOUT_MAX_MS);
        endpointState.cooldownUntil = Date.now() + backoff;
        lastClassification = 'TIMEOUT';
        lastMessage = `${endpointState.url} returned HTTP 504 (gateway timeout)`;
        console.log(`    [${label}] HTTP 504 from ${endpointState.url} — cooling down ${Math.round(backoff / 1000)}s, trying another endpoint...`);
        continue;
      }

      // Any other non-OK HTTP status (406, 500, 502, 503, etc.) — a real
      // response from the server, just not a usable one. Distinct from
      // RATE_LIMITED/TIMEOUT (which have their own specific handling
      // above) and from NETWORK_ERROR (reserved for cases where no HTTP
      // response was received at all — see the catch block below).
      const backoff = Math.min(TIMEOUT_BASE_MS * (2 ** attempt), TIMEOUT_MAX_MS);
      endpointState.cooldownUntil = Date.now() + backoff;
      lastClassification = 'SERVER_ERROR';
      lastMessage = `${endpointState.url} returned HTTP ${response.status}`;
      console.log(`    [${label}] HTTP ${response.status} from ${endpointState.url} — cooling down ${Math.round(backoff / 1000)}s, trying another endpoint...`);
    } catch (error) {
      clearTimeout(timer);
      const isAbort = error && error.name === 'AbortError';
      const backoff = Math.min(TIMEOUT_BASE_MS * (2 ** attempt), TIMEOUT_MAX_MS);
      endpointState.cooldownUntil = Date.now() + backoff;
      lastClassification = isAbort ? 'TIMEOUT' : 'NETWORK_ERROR';
      lastMessage = `${endpointState.url}: ${error && error.message ? error.message : error}`;
      console.log(`    [${label}] ${isAbort ? 'Request timed out' : 'Request failed'} on ${endpointState.url} — cooling down ${Math.round(backoff / 1000)}s, trying another endpoint...`);
    }
  }

  const err = new Error(`All ${MAX_ATTEMPTS_PER_AIRPORT} attempts failed for ${label}. Last error: ${lastMessage}`);
  err.classification = lastClassification;
  err.attempts = MAX_ATTEMPTS_PER_AIRPORT;
  throw err;
}

function elementPosition(el) {
  if (el.type === 'node' && Number.isFinite(el.lat) && Number.isFinite(el.lon)) {
    return [el.lat, el.lon];
  }

  if (
    el.center &&
    Number.isFinite(el.center.lat) &&
    Number.isFinite(el.center.lon)
  ) {
    return [el.center.lat, el.center.lon];
  }

  return null;
}

function dedupePoints(points) {
  const result = [];

  for (const point of points) {
    const duplicate = result.some(existing =>
      haversineMeters(
        existing.lat,
        existing.lon,
        point.lat,
        point.lon
      ) <= 3
    );

    if (!duplicate) result.push(point);
  }

  return result;
}

function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

/* Whatever's already on disk before this run — real OSM points from a
 * previous run, and/or points an admin placed by hand through the
 * in-game editor. Never throws: a missing or unreadable file is treated
 * as "nothing to merge with yet", not an error, since that's exactly the
 * state of a brand-new project. */
function loadExistingPoints() {
  try {
    if (!fs.existsSync(OUTPUT_FILE)) return [];
    const raw = fs.readFileSync(OUTPUT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn(
      `  Could not read existing ${OUTPUT_FILE} (${e.message}) — ` +
      'treating it as empty for this run. Nothing gets deleted either ' +
      'way; there is just nothing on disk yet to merge newly-fetched ' +
      'points into.'
    );
    return [];
  }
}

/* The per-airport status report from a previous run, if any. Returning
 * null (rather than throwing) for "no report yet" is what lets the
 * default/--retry-failed modes below just treat every airport as
 * "never attempted" on a brand-new project.
 *
 * Also normalizes any legacy status strings from an older version of
 * this script (see LEGACY_STATUS_MAP) so progress from a previous run —
 * including a report already full of real imported points — is still
 * recognized as resolved/failed correctly under the current status
 * vocabulary, instead of being mistaken for "never attempted" and
 * re-queried from scratch. */
function loadExistingReport() {
  try {
    if (!fs.existsSync(REPORT_FILE)) return null;
    const raw = fs.readFileSync(REPORT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    if (parsed.airports && typeof parsed.airports === 'object') {
      for (const code of Object.keys(parsed.airports)) {
        const entry = parsed.airports[code];
        if (entry && LEGACY_STATUS_MAP[entry.status]) {
          entry.status = LEGACY_STATUS_MAP[entry.status];
        }
      }
    }

    return parsed;
  } catch (e) {
    console.warn(`  Could not read existing ${REPORT_FILE} (${e.message}) — treating it as if no previous run existed.`);
    return null;
  }
}

/* Merges newly-fetched OSM points into whatever's already on disk.
 * NEVER deletes an existing point (admin-placed or from a previous OSM
 * import). A newly-fetched point is only skipped as a duplicate if:
 *   - it has the exact same `id` as one already on file (this script
 *     re-run against data it already imported), or
 *   - it sits within 3 meters of an existing point at the SAME airport
 *     (iata must match — distance alone, across airports, never counts)
 *     — almost certainly the same real-world stand, whether that's a
 *     previous import under a different OSM element id or a point an
 *     admin already placed there by hand.
 * Returns the merged array plus counts for the run summary. */
function mergeImportedPoints(existing, imported) {
  const merged = existing.slice();
  const existingIds = new Set(existing.map(p => p.id));
  let added = 0;
  let skippedDuplicate = 0;

  for (const point of imported) {
    if (existingIds.has(point.id)) { skippedDuplicate++; continue; }
    const nearDuplicate = merged.some(p =>
      p.iata === point.iata &&
      isFiniteNumber(p.lat) && isFiniteNumber(p.lon) &&
      haversineMeters(p.lat, p.lon, point.lat, point.lon) <= 3
    );
    if (nearDuplicate) { skippedDuplicate++; continue; }
    merged.push(point);
    existingIds.add(point.id);
    added++;
  }

  return { merged, added, skippedDuplicate };
}

/* Parses CLI flags into a plan describing what this run should do:
 *   --force            re-query every airport from scratch
 *   --retry-failed      only (re)query airports whose last status was a failure
 *   --limit N           process at most N airports this run (works with
 *                        default/retry-failed/force — see determineAirportsToProcess)
 *   --airport CODE      process exactly one specific airport, regardless
 *                        of its current status (cannot combine with
 *                        --force/--retry-failed — it's already explicit
 *                        about which single airport to touch)
 * Plain `node scripts/import-real-port-points.js` with no flags at all
 * processes every unresolved airport in one run (no cap) — this is what
 * the OLD default behaved like, and is still available for anyone who
 * wants to just let it run to completion unattended. The one-click
 * .bat files pass an explicit --limit so double-clicking processes a
 * small batch at a time instead. */
function parseArgs(argv) {
  const hasForce = argv.includes('--force');
  const hasRetryFailed = argv.includes('--retry-failed');
  if (hasForce && hasRetryFailed) {
    throw new Error('--force and --retry-failed cannot be used together. Pick one.');
  }

  let mode = 'default';
  if (hasForce) mode = 'force';
  else if (hasRetryFailed) mode = 'retry-failed';

  let limit = null;
  const limitIdx = argv.indexOf('--limit');
  if (limitIdx !== -1) {
    const raw = argv[limitIdx + 1];
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error(`--limit needs a positive whole number after it, e.g. --limit 10 (got: ${raw === undefined ? '(nothing)' : raw})`);
    }
    limit = parsed;
  }

  let singleAirport = null;
  const airportIdx = argv.indexOf('--airport');
  if (airportIdx !== -1) {
    const raw = argv[airportIdx + 1];
    if (!raw || raw.startsWith('--')) {
      throw new Error('--airport needs an IATA code after it, e.g. --airport MCO');
    }
    if (hasForce || hasRetryFailed) {
      throw new Error('--airport cannot be combined with --force or --retry-failed — it already targets one specific airport regardless of status.');
    }
    singleAirport = raw.toUpperCase();
  }

  return { mode, limit, singleAirport };
}

/* Decides which airports actually need an Overpass request this run.
 * See the CLI FLAGS section in the header comment for the full
 * explanation of each mode. --limit (if given) caps how many of the
 * selected candidates are actually processed, in AIRPORT_CODES order —
 * so running the same command again with the same --limit naturally
 * continues with the NEXT unresolved airports, never restarting from
 * the top, because whatever got processed last time is now resolved
 * (or failed, and therefore excluded from THIS mode's candidate set
 * unless this run is itself --retry-failed). */
function determineAirportsToProcess({ mode, limit, singleAirport }, existingReport) {
  if (singleAirport) {
    return [singleAirport];
  }

  const existingAirports = (existingReport && existingReport.airports) || {};
  let candidates;

  if (mode === 'force') {
    candidates = AIRPORT_CODES.slice();
  } else if (mode === 'retry-failed') {
    candidates = AIRPORT_CODES.filter(code => {
      const prev = existingAirports[code];
      return prev && FAILURE_STATUSES.has(prev.status);
    });
  } else {
    // default: process anything not already resolved (missing, or a
    // previous failure) — but leave alone anything already SUCCESS or
    // confirmed NO_OSM_DATA.
    candidates = AIRPORT_CODES.filter(code => {
      const prev = existingAirports[code];
      return !prev || !SUCCESS_STATUSES.has(prev.status);
    });
  }

  return limit != null ? candidates.slice(0, limit) : candidates;
}

/* Writes both output files right now, using whatever's been processed
 * so far — called after EVERY airport (see main()), not just at the
 * end, so an interrupted run never loses progress already made. */
function saveProgress(mergedPoints, report) {
  const sorted = mergedPoints.slice().sort((a, b) =>
    a.iata.localeCompare(b.iata) ||
    String(a.sourceId || a.id).localeCompare(String(b.sourceId || b.id))
  );

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf8');

  report.generatedAt = new Date().toISOString();
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + '\n', 'utf8');
}

async function main() {
  const plan = parseArgs(process.argv.slice(2));
  const { mode, limit, singleAirport } = plan;

  console.log('AeroAtlas Real Port Point Importer');
  console.log('');
  console.log(`Total airports: ${AIRPORT_CODES.length}`);

  const centers = readAirportCenters();

  const missingCenters = AIRPORT_CODES.filter(iata => !centers.has(iata));
  if (missingCenters.length) {
    throw new Error(
      'These IATA codes were not found in js/data/airports.js: ' +
      missingCenters.join(', ')
    );
  }

  if (singleAirport && !centers.has(singleAirport)) {
    throw new Error(
      `--airport ${singleAirport} is not one of the 254 airports in js/data/airports.js. ` +
      'Check the IATA code and try again.'
    );
  }

  const existingReport = loadExistingReport();
  const existingPointsOnDisk = loadExistingPoints();
  const airportsToProcess = determineAirportsToProcess(plan, existingReport);

  const existingAirports = (existingReport && existingReport.airports) || {};
  const alreadyResolved = AIRPORT_CODES.filter(code => {
    const prev = existingAirports[code];
    return prev && SUCCESS_STATUSES.has(prev.status);
  }).length;
  const remainingBeforeThisRun = AIRPORT_CODES.length - alreadyResolved;

  console.log(`Already resolved: ${alreadyResolved}`);
  console.log(`Remaining: ${remainingBeforeThisRun}`);
  console.log('');
  if (singleAirport) {
    console.log(`Processing one airport: ${singleAirport}`);
  } else if (mode === 'retry-failed') {
    console.log(`Retrying ${airportsToProcess.length} previously-failed airport(s)...`);
  } else if (mode === 'force') {
    console.log(`Force re-querying ${airportsToProcess.length} airport(s)...`);
  } else {
    console.log(`Processing next ${airportsToProcess.length} airport(s)...`);
  }
  console.log('');

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'OpenStreetMap / Overpass',
    osmTag: `aeroway=${OSM_TAG}`,
    searchRadiusMeters: SEARCH_RADIUS_METERS,
    requestedAirports: AIRPORT_CODES,
    lastRunMode: mode,
    airports: (existingReport && existingReport.airports && typeof existingReport.airports === 'object')
      ? { ...existingReport.airports }
      : {},
  };

  let mergedPoints = existingPointsOnDisk.slice();

  if (airportsToProcess.length === 0) {
    console.log('Nothing to do — every airport already has a result on file.');
    console.log('Use --retry-failed to retry airports that previously failed, or --force to re-query everything.');
  }

  // Per-run counters for the "Batch complete" summary (as opposed to the
  // whole-project totals printed further down).
  let runSuccess = 0, runZero = 0, runRateLimited = 0, runTimeout = 0, runNetworkError = 0, runServerError = 0;

  for (let i = 0; i < airportsToProcess.length; i++) {
    const code = airportsToProcess[i];
    const airport = centers.get(code);
    const overallIndex = AIRPORT_CODES.indexOf(code) + 1;
    console.log(`[${overallIndex}/${AIRPORT_CODES.length}] ${code}`);
    console.log('  Querying OpenStreetMap...');

    const attemptedAt = new Date().toISOString();

    try {
      const { json, attempts } = await fetchOverpassForAirport(buildQuery([airport]), code);
      const elements = Array.isArray(json.elements) ? json.elements : [];
      const candidates = [];

      for (const el of elements) {
        const pos = elementPosition(el);
        if (!pos) continue;

        const distance = haversineMeters(airport.lat, airport.lon, pos[0], pos[1]);
        if (distance <= SEARCH_RADIUS_METERS) {
          candidates.push({
            osmType: el.type,
            osmId: el.id,
            lat: pos[0],
            lon: pos[1],
            ref: el.tags && el.tags.ref ? String(el.tags.ref) : null,
            name: el.tags && el.tags.name ? String(el.tags.name) : null,
          });
        }
      }

      const unique = dedupePoints(candidates);
      const status = unique.length ? 'SUCCESS' : 'NO_OSM_DATA';

      report.airports[code] = {
        iata: code,
        status,
        pointsFound: unique.length,
        attempts,
        lastAttempt: attemptedAt,
        source: 'OpenStreetMap / Overpass',
        center: { lat: airport.lat, lon: airport.lon },
      };

      const newPoints = unique.map(p => ({
        id: `osm-${code}-${p.osmType}-${p.osmId}`,
        iata: code,
        lat: p.lat,
        lon: p.lon,
        createdAt: attemptedAt,
        createdBy: 'osm-import',
        source: 'OpenStreetMap',
        sourceType: `aeroway=${OSM_TAG}`,
        sourceId: `${p.osmType}/${p.osmId}`,
        ref: p.ref,
        name: p.name,
      }));

      const { merged, added, skippedDuplicate } = mergeImportedPoints(mergedPoints, newPoints);
      mergedPoints = merged;

      if (status === 'SUCCESS') {
        runSuccess++;
        console.log(`  SUCCESS: ${unique.length} parking position(s) (${added} new, ${skippedDuplicate} already on file)`);
      } else {
        runZero++;
        console.log('  NO_OSM_DATA: query succeeded, OSM has no parking positions mapped here');
      }
      console.log('  Saved progress.');
    } catch (error) {
      const classification = error.classification || 'NETWORK_ERROR';
      const previous = report.airports[code];

      // A failed refresh (only reachable via --force or --airport
      // re-querying an airport that previously succeeded) must NEVER
      // wipe out data that was already good — requirement #1. Keep the
      // old entry and just note the failed refresh attempt alongside it.
      if (previous && SUCCESS_STATUSES.has(previous.status)) {
        report.airports[code] = {
          ...previous,
          lastRefreshAttemptFailed: true,
          lastRefreshAttemptStatus: classification,
          lastRefreshAttemptError: String(error.message || error),
          lastRefreshAttemptAt: new Date().toISOString(),
        };
        console.log(`  ${classification}: refresh failed — keeping previous result (${previous.pointsFound} point(s) unchanged)`);
      } else {
        report.airports[code] = {
          iata: code,
          status: classification,
          pointsFound: 0,
          attempts: error.attempts || MAX_ATTEMPTS_PER_AIRPORT,
          lastAttempt: attemptedAt,
          source: 'OpenStreetMap / Overpass',
          center: { lat: airport.lat, lon: airport.lon },
          error: String(error.message || error),
        };
        console.log(`  ${classification}: ${error.message || error}`);
      }

      if (classification === 'RATE_LIMITED') runRateLimited++;
      else if (classification === 'TIMEOUT') runTimeout++;
      else if (classification === 'SERVER_ERROR') runServerError++;
      else runNetworkError++;

      console.log('  Saved progress.');
    }

    // Save after EVERY airport — never lose progress to an interruption.
    saveProgress(mergedPoints, report);
    console.log('');

    if (i + 1 < airportsToProcess.length) {
      const jitter = Math.floor(Math.random() * REQUEST_INTERVAL_JITTER_MS);
      await sleep(REQUEST_INTERVAL_MS + jitter);
    }
  }

  // Whole-project totals across ALL 254 airports — airports skipped this
  // run keep whatever result they already had from a previous run.
  let totalSuccess = 0, totalZero = 0, totalRateLimited = 0, totalTimeout = 0, totalNetworkError = 0, totalServerError = 0, neverAttempted = 0;
  const failedAirports = [];

  for (const code of AIRPORT_CODES) {
    const entry = report.airports[code];
    if (!entry) { neverAttempted++; continue; }
    if (entry.status === 'SUCCESS') totalSuccess++;
    else if (entry.status === 'NO_OSM_DATA') totalZero++;
    else if (entry.status === 'RATE_LIMITED') { totalRateLimited++; failedAirports.push(code); }
    else if (entry.status === 'TIMEOUT') { totalTimeout++; failedAirports.push(code); }
    else if (entry.status === 'SERVER_ERROR') { totalServerError++; failedAirports.push(code); }
    else if (entry.status === 'NETWORK_ERROR') { totalNetworkError++; failedAirports.push(code); }
  }

  const totalOsmPoints = mergedPoints.filter(p => p.source === 'OpenStreetMap').length;
  const remainingUnresolved = AIRPORT_CODES.length - totalSuccess - totalZero;

  console.log('Batch complete.');
  console.log('');
  console.log(`Processed this run: ${airportsToProcess.length}`);
  console.log(`Successful: ${runSuccess}`);
  console.log(`No OSM data: ${runZero}`);
  console.log(`Rate limited: ${runRateLimited}`);
  console.log(`Timeouts: ${runTimeout}`);
  console.log(`Network errors: ${runNetworkError + runServerError}`);
  console.log(`Remaining unresolved airports: ${remainingUnresolved}`);
  console.log('');
  console.log('========================================');
  console.log(`PROJECT TOTALS (all ${AIRPORT_CODES.length} airports)`);
  console.log('========================================');
  console.log(`Successful: ${totalSuccess}`);
  console.log(`No OSM data: ${totalZero}`);
  console.log(`Rate limited: ${totalRateLimited}`);
  console.log(`Timeouts: ${totalTimeout}`);
  console.log(`Network/server errors: ${totalNetworkError + totalServerError}`);
  if (neverAttempted) console.log(`Never attempted yet: ${neverAttempted}`);
  console.log(`Total real OSM parking positions on file: ${totalOsmPoints}`);
  console.log(`Total points on file (incl. any manually-placed ones): ${mergedPoints.length}`);
  console.log('');
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`Report: ${REPORT_FILE}`);

  if (remainingUnresolved === 0) {
    console.log('');
    console.log(`All ${AIRPORT_CODES.length} airports have been resolved (either real parking positions were`);
    console.log('found, or OSM was confirmed to have none for that airport). Nothing left to do.');
  } else if (neverAttempted > 0 && failedAirports.length === 0) {
    console.log('');
    console.log(`${neverAttempted} airport(s) haven't been attempted yet. Run this again`);
    console.log('(same command, or just double-click the .bat file again) to continue with the next batch.');
  }

  if (failedAirports.length) {
    console.log('');
    console.log('Airports that failed due to a REQUEST problem (not a real "no data" answer):');
    console.log(failedAirports.join(', '));
    console.log('');
    console.log('Run again with --retry-failed to retry ONLY these airports:');
    console.log('  node scripts/import-real-port-points.js --retry-failed');
  }

  const zeroAirports = AIRPORT_CODES.filter(code =>
    report.airports[code] && report.airports[code].status === 'NO_OSM_DATA'
  );
  if (zeroAirports.length) {
    console.log('');
    console.log('Airports OSM confirms have NO mapped parking positions (a real answer, not a failure — review manually if needed):');
    console.log(zeroAirports.join(', '));
    console.log('Do NOT invent coordinates for these — use verified airport/OSM data instead.');
  }
}

main().catch(error => {
  console.error('');
  console.error('IMPORT FAILED:', error.message || error);
  process.exitCode = 1;
});
