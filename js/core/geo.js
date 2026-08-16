/* ================================================================
   Geo / distance helpers (great-circle math, nautical miles).
   ================================================================ */
/* ---------------- Geo / distance helpers (great-circle, nautical miles) ---------------- */
const EARTH_R_NM = 3440.065;

function toRad(d) { return d * Math.PI / 180; }
function toDeg(r) { return r * 180 / Math.PI; }

function haversineNM(a, b) {
  const [lat1, lon1] = a, [lat2, lon2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s1 = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_R_NM * Math.asin(Math.min(1, Math.sqrt(s1)));
}

function pathLengthNM(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += haversineNM(points[i - 1], points[i]);
  return total;
}

function bearingDeg(a, b) {
  const [lat1, lon1] = a, [lat2, lon2] = b;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/* Given a start point, a compass bearing (0-360, clockwise from north) and
   a distance in nautical miles, returns the destination [lat, lon]. Used
   to nudge a trail point sideways (bearing ± 90° off the direction of
   travel) to lay down the two separate engine contrails. */
function destinationPoint([lat, lon], brngDeg, distNM) {
  const R = EARTH_R_NM;
  const brng = toRad(brngDeg);
  const lat1 = toRad(lat), lon1 = toRad(lon);
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distNM / R) +
    Math.cos(lat1) * Math.sin(distNM / R) * Math.cos(brng)
  );
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distNM / R) * Math.cos(lat1),
    Math.cos(distNM / R) - Math.sin(lat1) * Math.sin(lat2)
  );
  return [toDeg(lat2), toDeg(lon2)];
}

/* Local equirectangular projection (nm units) around a reference latitude,
   good enough over the short spans a single route covers. */
function makeProjector(refLat) {
  const cosRef = Math.cos(toRad(refLat));
  return {
    toXY: ([lat, lon]) => [lon * cosRef * (Math.PI / 180) * EARTH_R_NM, lat * (Math.PI / 180) * EARTH_R_NM],
    toLatLon: ([x, y]) => [
      y / EARTH_R_NM * (180 / Math.PI),
      x / (EARTH_R_NM * cosRef) * (180 / Math.PI),
    ],
  };
}

