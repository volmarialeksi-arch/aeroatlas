/* ================================================================
   Flight speed model (physics-based zone profile per leg) + the
   contrail-trail distance constants that ride on top of it.
   ================================================================ */
/* ---------------- Speed model ----------------
   Every leg is modeled as an ordered list of "zones", each covering a
   stretch of the leg's total distance (in NM) and describing how speed
   (in knots) behaves across that stretch:
     - 'const'  — flat speed, v0 === v1.
     - 'accel'  — steady (constant) acceleration in TIME from v0 to v1,
                  used for the runway takeoff roll (0 -> takeoff speed)
                  and the landing rollout (touchdown speed -> taxi speed).
     - 'linear' — speed varies linearly with DISTANCE from v0 to v1, used
                  for the descent/approach profile, which is specified
                  (and given to us) as a speed-per-kilometer table.
   Ground legs (taxi/runway) are only modeled when a leg has real
   runway/taxi phase markers recorded (see tickets.js's extendWithArrival,
   which records taxiOutEnd/liftoff/landingPoint/rolloutEnd/gateArrival
   onto route.outPhaseMarkersNM/inPhaseMarkersNM). Routes with no markers
   (no runway ever selected for that leg) fall back to an air-only
   climb/cruise/descent profile applied to the whole distance. */
const KM_PER_NM = 1.852;

/* ---------------- Ground speeds (taxiway) ---------------- */
const TAXI_KMH = 20;
const TAXI_KT = TAXI_KMH / KM_PER_NM;

/* Fixed hold at the runway threshold — the aircraft comes to a stop,
   turns onto the runway, and sits for this long before it starts its
   takeoff roll. This is a pure time cost (no distance covered), so it's
   handled outside the zone/distance model entirely — see
   js/systems/fleet-tick.js's consumeRunwayHold, which is called before
   advanceLegProgress each tick. */
const RUNWAY_HOLD_HOURS = 15 / 3600;

/* ---------------- Zone primitives ----------------
   A zone is { start, end (NM), kind, v0, v1 (knots) }. These three
   helpers are the only place the actual kinematics live; everything else
   (advancing progress each tick, computing total leg time, reconstructing
   an in-progress leg's departure moment) is built on top of them. */
function zoneTimeAtLocalDist(z, s) {
  const D = z.end - z.start;
  if (D <= 0 || s <= 0) return 0;
  s = Math.min(s, D);
  if (z.kind === 'accel' && Math.abs(z.v1 - z.v0) > 1e-9) {
    const a = (z.v1 * z.v1 - z.v0 * z.v0) / (2 * D);
    return (-z.v0 + Math.sqrt(Math.max(0, z.v0 * z.v0 + 2 * a * s))) / a;
  }
  if (z.kind === 'linear') {
    const k = (z.v1 - z.v0) / D;
    if (Math.abs(k) > 1e-9) return Math.log((z.v0 + k * s) / z.v0) / k;
  }
  return s / Math.max(z.v0, 1e-6); // flat 'const' zone, or a degenerate accel/linear zone (v0===v1)
}

function zoneLocalDistAtTime(z, t) {
  const D = z.end - z.start;
  if (D <= 0 || t <= 0) return 0;
  let s;
  if (z.kind === 'accel' && Math.abs(z.v1 - z.v0) > 1e-9) {
    const a = (z.v1 * z.v1 - z.v0 * z.v0) / (2 * D);
    s = z.v0 * t + 0.5 * a * t * t;
  } else if (z.kind === 'linear') {
    const k = (z.v1 - z.v0) / D;
    s = Math.abs(k) > 1e-9 ? (z.v0 * (Math.exp(k * t) - 1)) / k : z.v0 * t;
  } else {
    s = z.v0 * t;
  }
  return Math.min(D, Math.max(0, s));
}

function zoneDur(z) {
  return zoneTimeAtLocalDist(z, z.end - z.start);
}

function zoneSpeedAtLocal(z, s) {
  const D = z.end - z.start;
  if (D <= 0) return z.v0;
  const frac = Math.min(1, Math.max(0, s / D));
  if (z.kind === 'accel') return Math.sqrt(Math.max(0, z.v0 * z.v0 + (z.v1 * z.v1 - z.v0 * z.v0) * frac));
  if (z.kind === 'linear') return z.v0 + (z.v1 - z.v0) * frac;
  return z.v0;
}

/* ---------------- Zone-list construction ----------------
   Builds the climb -> 30km at takeoff speed -> 400 km/h -> own max cruise
   -> descent -> touchdown profile between two progress points (NM) along
   a leg, using an aircraft's real performance numbers (see
   js/data/aircraft-performance.js). All boundaries are clamped to fit
   within the available distance (shorter hops simply lose their cruise
   zone, or even part of the climb zone, rather than overshoot). */
function buildFlightZones(startNM, endNM, type) {
  const totalNM = endNM - startNM;
  if (totalNM <= 0) return [];
  const totalKm = totalNM * KM_PER_NM;
  const perf = getAircraftPerformance(type);

  const zones = [];
  const push = (s0Km, s1Km, kind, v0Kmh, v1Kmh) => {
    if (s1Km - s0Km <= 1e-9) return;
    zones.push({
      start: startNM + s0Km / KM_PER_NM,
      end: startNM + s1Km / KM_PER_NM,
      kind,
      v0: v0Kmh / KM_PER_NM,
      v1: v1Kmh / KM_PER_NM,
    });
  };

  const takeoffEndKm = Math.min(30, totalKm);
  const cruise400EndKm = Math.min(Math.max(100, takeoffEndKm), totalKm);
  const descentStartKm = Math.min(Math.max(totalKm - 100 * KM_PER_NM, cruise400EndKm), totalKm);

  push(0, takeoffEndKm, 'const', perf.takeoffSpeedKmh, perf.takeoffSpeedKmh);
  push(takeoffEndKm, cruise400EndKm, 'const', 400, 400);
  push(cruise400EndKm, descentStartKm, 'const', perf.maxSpeedKmh, perf.maxSpeedKmh);

  // Descent: from the 100 NM checkpoint down through 90/80/.../10 NM to
  // touchdown, each leg's speed varying linearly with distance covered
  // (matches the "drops by this amount per km" spec for this phase).
  const nmOffsets = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
  const speeds = [
    perf.descentTableKmh[1], perf.descentTableKmh[2], perf.descentTableKmh[3],
    perf.descentTableKmh[4], perf.descentTableKmh[5], perf.descentTableKmh[6],
    perf.descentTableKmh[7], perf.descentTableKmh[8], perf.descentTableKmh[9],
    perf.touchdownSpeedKmh,
  ];
  let prevKm = descentStartKm;
  let prevSpeed = perf.descentTableKmh[0];
  for (let i = 0; i < nmOffsets.length; i++) {
    const kmPt = Math.min(totalKm, Math.max(descentStartKm, totalKm - nmOffsets[i] * KM_PER_NM));
    push(prevKm, kmPt, 'linear', prevSpeed, speeds[i]);
    prevKm = kmPt;
    prevSpeed = speeds[i];
  }
  // Make sure rounding never leaves a gap before the leg's true end.
  if (totalKm - prevKm > 1e-9) push(prevKm, totalKm, 'const', prevSpeed, prevSpeed);

  return zones;
}

/* Ground-zone bounds, defaulted the same way the physical route-builder
   in tickets.js defaults them (see extendWithDeparture/extendWithArrival). */
function _groundZoneBounds(totalNM, markers) {
  const taxiOutEnd = markers.taxiOutEnd || 0;
  const liftoff = markers.liftoff !== undefined ? markers.liftoff : taxiOutEnd;
  const landingPoint = markers.landingPoint !== undefined ? markers.landingPoint : totalNM;
  const rolloutEnd = markers.rolloutEnd !== undefined ? markers.rolloutEnd : totalNM;
  const gateArrival = markers.gateArrival !== undefined ? markers.gateArrival : totalNM;
  return { taxiOutEnd, liftoff, landingPoint, rolloutEnd, gateArrival };
}

/* Builds the full zone list for a leg: taxi-out -> runway takeoff roll
   (steady acceleration to the aircraft's own takeoff speed) -> climb /
   cruise / descent (buildFlightZones) -> landing rollout (steady
   deceleration from touchdown speed back to taxi speed) -> taxi-in. Falls
   back to a pure air profile over the whole distance when the leg has no
   real runway/taxi markers recorded. */
function buildLegZones(totalNM, markers, type) {
  if (!markers || markers.approachStart === undefined) {
    return buildFlightZones(0, totalNM, type);
  }
  const { taxiOutEnd, liftoff, landingPoint, rolloutEnd, gateArrival } = _groundZoneBounds(totalNM, markers);
  const perf = getAircraftPerformance(type);
  const zones = [];
  if (taxiOutEnd > 1e-9) zones.push({ start: 0, end: taxiOutEnd, kind: 'const', v0: TAXI_KT, v1: TAXI_KT });
  if (liftoff - taxiOutEnd > 1e-9) {
    zones.push({ start: taxiOutEnd, end: liftoff, kind: 'accel', v0: 0, v1: perf.takeoffSpeedKmh / KM_PER_NM });
  }
  zones.push(...buildFlightZones(liftoff, landingPoint, type));
  if (rolloutEnd - landingPoint > 1e-9) {
    zones.push({ start: landingPoint, end: rolloutEnd, kind: 'accel', v0: perf.touchdownSpeedKmh / KM_PER_NM, v1: TAXI_KT });
  }
  if (gateArrival - rolloutEnd > 1e-9) zones.push({ start: rolloutEnd, end: gateArrival, kind: 'const', v0: TAXI_KT, v1: TAXI_KT });
  if (totalNM - gateArrival > 1e-9) {
    zones.push({ start: gateArrival, end: totalNM, kind: 'const', v0: TAXI_KT, v1: TAXI_KT });
  }
  return zones;
}

/* ---------------- Zone-list consumers ---------------- */
function timeToProgressInZones(zones, progressNM) {
  let t = 0;
  for (const z of zones) {
    if (progressNM <= z.start) break;
    const local = Math.min(progressNM, z.end) - z.start;
    if (local > 0) t += zoneTimeAtLocalDist(z, local);
  }
  return t;
}

function advanceThroughZones(zones, progressNM, dtHours) {
  if (!zones.length) return progressNM;
  const totalEnd = zones[zones.length - 1].end;
  let p = Math.min(Math.max(progressNM, zones[0].start), totalEnd);
  let remaining = dtHours;
  let idx = 0;
  while (idx < zones.length - 1 && p >= zones[idx].end - 1e-9) idx++;
  let guard = 0;
  while (remaining > 1e-9 && p < totalEnd - 1e-9 && guard < zones.length + 4) {
    guard++;
    while (idx < zones.length - 1 && p >= zones[idx].end - 1e-9) idx++;
    const z = zones[idx];
    const local = Math.max(0, p - z.start);
    const tAtLocal = zoneTimeAtLocalDist(z, local);
    const tAtEnd = zoneDur(z);
    const timeToZoneEnd = Math.max(0, tAtEnd - tAtLocal);
    if (timeToZoneEnd <= remaining + 1e-12) {
      p = z.end;
      remaining -= timeToZoneEnd;
      idx = Math.min(idx + 1, zones.length - 1);
    } else {
      const newLocal = zoneLocalDistAtTime(z, tAtLocal + remaining);
      p = z.start + newLocal;
      remaining = 0;
    }
  }
  return Math.min(p, totalEnd);
}

/* Advances progress along a leg by dtHours of game time, honoring the
   zone profile above exactly (steps through each zone boundary) so timing
   stays correct no matter how large a single tick's dtHours is. `markers`
   (optional) are a leg's phase markers; `type` (optional) is the
   aircraft's catalog entry, used to look up its real performance numbers
   — both fall back sensibly when omitted. */
function advanceLegProgress(progressNM, totalNM, dtHours, markers, type) {
  const zones = buildLegZones(totalNM, markers, type);
  return advanceThroughZones(zones, progressNM, dtHours);
}

/* Total time (hours) to fly a leg of totalNM under the air-only
   climb/cruise/descent profile — used to show estimated flight times
   before a route (and its ground markers) exist yet. */
function legFlightTimeHours(totalNM, type) {
  const zones = buildFlightZones(0, totalNM, type);
  return zones.reduce((sum, z) => sum + zoneDur(z), 0);
}

/* Time (hours) to fly from the start of a leg up to progressNM of the way
   through a totalNM leg, under the same air-only profile as
   legFlightTimeHours — used on load to reconstruct roughly when an
   already-in-progress leg must have actually departed (see save.js). */
function legTimeToProgressHours(progressNM, totalNM, type) {
  const zones = buildFlightZones(0, totalNM, type);
  return timeToProgressInZones(zones, progressNM);
}

/* Marker- and type-aware counterpart to legFlightTimeHours, used where a
   route's displayed "flight time" needs to reflect the slow
   taxiway/runway/climb/descent segments rather than pretending the whole
   distance was covered at cruise speed. Falls back to the air-only model
   when there are no markers. */
function legFlightTimeHoursWithMarkers(totalNM, markers, type) {
  const zones = buildLegZones(totalNM, markers, type);
  return zones.reduce((sum, z) => sum + zoneDur(z), 0);
}

/* Marker- and type-aware counterpart to legTimeToProgressHours, used on
   load to reconstruct an in-progress leg's departure moment when that leg
   has ground (taxi/runway) phases — see save.js. Falls back to the
   air-only model when there are no markers. */
function legTimeToProgressHoursWithMarkers(progressNM, totalNM, markers, type) {
  const zones = buildLegZones(totalNM, markers, type);
  return timeToProgressInZones(zones, progressNM);
}

function formatHoursMinutes(hours) {
  const totalMin = Math.max(1, Math.round(hours * 60));
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/* ---------------- Engine-smoke / contrail trail model ----------------
   Visible only once the aircraft is genuinely out over its cruise — more
   than 100 km of actual geographic distance from the departure airport —
   and it switches off again once the aircraft comes within 100 km of the
   arrival airport, each measured as a real great-circle distance to that
   airport's coordinates (not a fraction of the leg's total length, and not
   tied to the speed model's own zone boundaries — a short leg can
   legitimately spend its entire flight within 100 km of one end or the
   other and simply never show a trail).

   Spans the most recent ~30 km of actually-flown track behind each
   aircraft, built from the real historical world-space positions of each
   engine (see updatePlaneTrail in planes.js) so the trail visibly bends
   through every turn the aircraft has made rather than just pointing
   straight back along its current heading. Drawn as two separate streaks —
   one per engine, anchored at that aircraft type's actual engine-exhaust
   position on its icon artwork (see AIRCRAFT_ENGINE_LAYOUT in planes.js) —
   for the first ~4 km behind the engines, then gradually converging into a
   single, gradually widening, gradually fading streak for the remaining
   distance back to the 30 km mark. The two engine trails are always kept
   fully independent (see planes.js) — never merged into one, at any
   distance behind the aircraft. */
const TRAIL_AIRPORT_BUFFER_KM = 100;
const TRAIL_LENGTH_NM = 30 / KM_PER_NM;
