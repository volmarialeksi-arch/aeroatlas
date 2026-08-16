/* ================================================================
   Runway + gate lookup — REAL DATA ONLY.
   ================================================================
   Every runway threshold below comes from AIRPORT_GROUND_DATA
   (js/data/airport-ground-data.js), which is real OurAirports runway
   endpoint data. This file used to procedurally INVENT runway
   geometry (destinationPoint() offsets from the airport pin) as
   temporary test data — that generator has been removed entirely, not
   just disabled, per instruction. There is no fallback that fabricates
   a runway/gate position: if an airport has no ground data, the
   functions below return an empty list for it. Nothing here ever
   invents a coordinate.

   Gates/taxiways/taxilanes/parking are intentionally empty in the
   source data (not yet collected) — gatesForAirport() reflects that
   honestly (returns [] for every airport right now) rather than
   inventing a placeholder gate. When real gate data is added to
   AIRPORT_GROUND_DATA, gatesForAirport() will start returning it with
   no other code needing to change. */

/* iata -> ground-data entry, built once for O(1) lookup. */
const _groundDataByIata = new Map(
  (AIRPORT_GROUND_DATA.airportEntries || []).map(entry => [entry.iata, entry])
);

/* Public: flat list of every selectable runway *direction* at an airport
   (e.g. Helsinki returns "04L","22R","04R","22L","15","33"), each with
   real [lat,lon] threshold/farEnd geometry straight from the ground-data
   file. Returns [] if the airport has no ground data or no runways
   recorded for it — never fabricated. */
function runwaysForAirport(iata) {
  const entry = _groundDataByIata.get(iata);
  if (!entry || !entry.runways) return [];
  const directions = [];
  entry.runways.forEach(rw => {
    const [labelA, labelB] = String(rw.runway).split('/');
    directions.push({
      id: (labelA || rw.runway).trim(),
      heading: rw.headingA,
      threshold: rw.thresholdA,
      farEnd: rw.thresholdB,
      lengthM: rw.lengthM,
      widthM: rw.widthM,
      stripId: rw.runway,
    });
    if (labelB) {
      directions.push({
        id: labelB.trim(),
        heading: rw.headingB,
        threshold: rw.thresholdB,
        farEnd: rw.thresholdA,
        lengthM: rw.lengthM,
        widthM: rw.widthM,
        stripId: rw.runway,
      });
    }
  });
  return directions;
}

function runwayDirectionById(iata, runwayId) {
  return runwaysForAirport(iata).find(d => d.id === runwayId) || null;
}

/* Public: this airport's gates. Real data only — the source file has
   `gate: null` for every airport right now, so this returns [] for
   everyone until real gate coordinates are collected. Do not replace
   this with a generated placeholder. */
function gatesForAirport(iata) {
  const entry = _groundDataByIata.get(iata);
  if (!entry || !entry.gate) return [];
  return [entry.gate];
}

/* ---------------- Pure runway-line geometry helpers ----------------
   Operate on a runway *direction* (see runwaysForAirport above) — i.e. a
   runway already oriented the way it's being used: `threshold` is the
   end being landed on/departed from, `farEnd` is the opposite end, and
   `heading` is the direction of travel while using it. */

/* The centerline is just the two real threshold coordinates — this
   function exists so "the source of truth for landing" has one obvious
   name in the codebase, per spec, rather than every caller reaching into
   .threshold/.farEnd directly. */
function getRunwayCenterline(direction) {
  return { start: direction.threshold, end: direction.farEnd };
}

/* A point ON the centerline, a real distance past the threshold (default
   300 m — a typical touchdown-zone offset), in the direction of travel.
   This is where TOUCHDOWN happens; it is mathematically guaranteed to lie
   on thresholdA<->thresholdB because it's built by walking along that
   exact bearing from a real threshold coordinate. */
function getRunwayLandingPoint(direction, distanceFromThresholdM = 300) {
  const cappedM = Math.min(distanceFromThresholdM, Math.max(0, direction.lengthM - 50));
  return destinationPoint(direction.threshold, direction.heading, cappedM / 1852);
}

/* The runway's real geographic midpoint — halfway between threshold and
   farEnd along the actual centerline. Used as the assumed rollout/exit
   point below (and as the "how far to highlight" endpoint in
   runway-debug.js's selection overlay) so an aircraft — and the taxi
   route calculated for it — never has to be modeled as covering the
   runway's full physical length before turning off, the way a fixed
   absolute rollout distance could end up doing on a short-to-medium
   runway (a fixed 1500 m rollout meets or exceeds most runways under
   ~1.5 km, clamping right up against the far end). */
function getRunwayMidpoint(direction) {
  return destinationPoint(direction.threshold, direction.heading, (direction.lengthM / 2) / 1852);
}

/* Where the aircraft is assumed to leave the centerline and start
   taxiing, absent real taxiway data to pin it down exactly: the runway's
   own midpoint (see getRunwayMidpoint) rather than a fixed distance past
   touchdown. This is deliberately independent of runway length — a
   longer runway doesn't need a proportionally longer rollout, it just
   means more unused runway behind the exit point, exactly like a real
   aircraft turning off at whichever intersection is convenient rather
   than being made to use the whole strip. Never placed before the actual
   touchdown point (landingPoint) — for a very short runway where the
   midpoint would fall inside the touchdown zone, the touchdown point
   itself wins instead. Stays safely inside the runway's real length. */
function getRunwayRolloutEndPoint(direction, landingPoint) {
  const midDistM = direction.lengthM / 2;
  const landingDistM = landingPoint ? haversineNM(direction.threshold, landingPoint) * 1852 : 0;
  const targetDistM = Math.max(midDistM, landingDistM);
  const cappedM = Math.min(targetDistM, Math.max(50, direction.lengthM - 50));
  return destinationPoint(direction.threshold, direction.heading, cappedM / 1852);
}

/* A point further along the centerline PAST the threshold, in the
   direction of travel — models the straight takeoff roll, symmetric to
   getRunwayRolloutEndPoint's landing roll but starting fresh from the
   threshold. This is where the aircraft actually leaves the ground and
   the normal climb/cruise speed model takes over. Stays safely inside
   the runway's real length. */
function getRunwayLiftoffPoint(direction, distanceFromThresholdM = 1200) {
  const cappedM = Math.min(distanceFromThresholdM, Math.max(50, direction.lengthM - 50));
  return destinationPoint(direction.threshold, direction.heading, cappedM / 1852);
}

/* A point BEFORE the threshold, on the extended centerline, outside the
   physical runway — i.e. where final approach begins. Located on the
   reciprocal bearing from the threshold (the direction the aircraft is
   arriving FROM), `distanceKm` out (default 10 km, a typical final-
   approach fix distance). */
function getRunwayApproachPoint(direction, distanceKm = 10) {
  const reciprocalHeading = (direction.heading + 180) % 360;
  return destinationPoint(direction.threshold, reciprocalHeading, distanceKm / 1.852);
}
