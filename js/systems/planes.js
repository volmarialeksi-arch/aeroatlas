/* ================================================================
   Plane markers: icon artwork, spawning an in-flight marker, smooth
   rotation, position/point interpolation along a route, the fading
   contrail trail, and the "click a plane to see its route" overlay.
   ================================================================ */

/* NOTE: this used to read three giant inline base64 data-URI constants
   (JET_IMG_DATA_URI / ATR_IMG_DATA_URI / B738_IMG_DATA_URI). Those have
   been decoded to real PNG files — see js/data/aircraft-images.js. */
function planeIconMarkup(rotClass, typeId) {
  const src = (typeId === 'atr72500') ? AIRCRAFT_IMAGES.atr72500
    : (typeId === 'b738') ? AIRCRAFT_IMAGES.b738
    : (typeId === 'a220300') ? AIRCRAFT_IMAGES.a220300
    : (typeId === 'a321211') ? AIRCRAFT_IMAGES.a321211
    : (typeId === 'a350900') ? AIRCRAFT_IMAGES.a350900
    : (typeId === 'b757200') ? AIRCRAFT_IMAGES.b757200
    : (typeId === 'b777222') ? AIRCRAFT_IMAGES.b777222
    : (typeId === 'b747400') ? AIRCRAFT_IMAGES.b747400
    : (typeId === 'a340600') ? AIRCRAFT_IMAGES.a340600
    : (typeId === 'a380800') ? AIRCRAFT_IMAGES.a380800
    : (typeId === 'erj145') ? AIRCRAFT_IMAGES.erj145
    : (typeId === 'b789') ? AIRCRAFT_IMAGES.b789
    : (typeId === 'a319100') ? AIRCRAFT_IMAGES.a319100
    : (typeId === 'a321neo') ? AIRCRAFT_IMAGES.a321neo
    : (typeId === 'b739er') ? AIRCRAFT_IMAGES.b739er
    : AIRCRAFT_IMAGES.jet;
  return `<img src="${src}" class="${rotClass || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" draggable="false" alt="aircraft" />`;
}

/* Each aircraft artwork is drawn nose-first toward a different fixed
   compass heading at rotate(0) rather than north uniformly — most art is
   drawn level (nose due east/west/north), but the 777-222 and A340-600
   source art happens to be drawn on a diagonal, so their nose bearings
   below aren't a clean multiple of 90; they were measured directly off
   the actual artwork (fuselage centerline direction from tail to nose)
   rather than assumed. Applying a raw route bearing as the CSS rotation
   without subtracting this out would leave that aircraft flying visibly
   sideways relative to its actual heading. This returns the compass
   bearing (0-360, clockwise from north) each icon's nose points to with
   no rotation applied, so callers can subtract it out — that's what
   keeps every aircraft always facing the direction it's actually
   flying. */
function planeIconNoseBearing(typeId) {
  if (typeId === 'atr72500') return 45;
  if (typeId === 'b738') return 270;
  if (typeId === 'a220300') return 90;
  if (typeId === 'a321211') return 90;
  if (typeId === 'a350900') return 0;
  if (typeId === 'b757200') return 270;
  if (typeId === 'b777222') return 208; // diagonal source art, measured off the fuselage centerline
  if (typeId === 'b747400') return 270;
  if (typeId === 'a340600') return 302; // diagonal source art, measured off the fuselage centerline
  if (typeId === 'a380800') return 270;
  if (typeId === 'erj145') return 90;
  if (typeId === 'b789') return 270;
  if (typeId === 'a319100') return 270;
  if (typeId === 'a321neo') return 270;
  if (typeId === 'b739er') return 90;
  return 45; // jet (default)
}

/* Native pixel dimensions of each source PNG. Needed because the icon is
   displayed with object-fit:contain inside a *square* marker box — for the
   non-square artwork (b738, jet) that means the rendered image is scaled
   down to fit the limiting dimension and letterboxed, so converting an
   artwork pixel coordinate into an on-screen offset requires knowing the
   image's real aspect ratio, not just the square icon box size. */
const AIRCRAFT_ART_DIMS = {
  atr72500: { w: 1254, h: 1254 },
  b738: { w: 800, h: 552 },
  a220300: { w: 1254, h: 1254 },
  a321211: { w: 1536, h: 1024 },
  a350900: { w: 1024, h: 1536 },
  b757200: { w: 1536, h: 1024 },
  b777222: { w: 1024, h: 1536 },
  b747400: { w: 1536, h: 1024 },
  a340600: { w: 1536, h: 1024 },
  a380800: { w: 1254, h: 1254 },
  erj145: { w: 1536, h: 1024 },
  b789: { w: 1536, h: 1024 },
  a319100: { w: 1536, h: 1024 },
  a321neo: { w: 1536, h: 1024 },
  b739er: { w: 1536, h: 1024 },
  jet: { w: 1536, h: 1024 },
};

/* Each aircraft type's engine-exhaust attachment points, measured
   directly off that type's PNG artwork as raw pixel coordinates (x,y from
   the image's top-left corner, at the image's native resolution). These
   are NOT fractions of trail length, map distance, or anything geographic
   — they are literal pixel positions read off the actual art, e.g. the
   ATR's propeller hubs, the 737/A220/jet's underwing engine nacelles. See
   engineWorldPositions() below for how a pixel coordinate here becomes an
   actual map position: it's re-centered on the image, scaled down by
   however much that PNG is currently shrunk to fit the icon, rotated to
   match the aircraft's current heading, and only then projected onto the
   map next to the marker.

   Each entry is an ARRAY of points, one per real engine on that aircraft
   — two for every twinjet/turboprop, four for the four-engine widebodies
   (747-400, A340-600, A380-800), so every one of their engines lays down
   its own independent smoke trail exactly like every other aircraft's
   engines do (see updatePlaneTrail/drawEngineTrail below, which loop over
   however many points are here rather than assuming exactly two). */
const AIRCRAFT_ENGINE_LAYOUT = {
  atr72500: [{ x: 540, y: 383 }, { x: 860, y: 605 }], // the two propeller hubs
  b738: [{ x: 310, y: 190 }, { x: 310, y: 355 }],     // underwing nacelles
  a220300: [{ x: 730, y: 435 }, { x: 730, y: 815 }],  // underwing nacelles (rear/exhaust side)
  a321211: [{ x: 945, y: 335 }, { x: 945, y: 625 }],  // underwing nacelles
  a350900: [{ x: 365, y: 575 }, { x: 660, y: 575 }],  // underwing nacelles
  b757200: [{ x: 610, y: 330 }, { x: 605, y: 630 }],  // underwing nacelles
  b777222: [{ x: 175, y: 780 }, { x: 495, y: 1000 }], // underwing nacelles (diagonal source art)
  b747400: [                                          // four-engine aircraft — all four nacelles
    { x: 605, y: 245 }, { x: 590, y: 665 },             // inner underwing nacelles
    { x: 700, y: 175 }, { x: 690, y: 730 },             // outer underwing nacelles
  ],
  a340600: [                                          // four-engine aircraft — all four nacelles (diagonal source art)
    { x: 700, y: 145 }, { x: 410, y: 485 },             // inner underwing nacelles
    { x: 840, y: 88 }, { x: 375, y: 598 },              // outer underwing nacelles
  ],
  a380800: [                                          // four-engine aircraft — all four nacelles
    { x: 500, y: 215 }, { x: 402, y: 790 },             // outer/inner underwing nacelles
    { x: 418, y: 323 }, { x: 483, y: 880 },             // inner/outer underwing nacelles
  ],
  erj145: [{ x: 445, y: 375 }, { x: 445, y: 565 }],   // fuselage-side nacelles
  b789: [{ x: 915, y: 335 }, { x: 915, y: 650 }],     // underwing nacelles
  a319100: [{ x: 535, y: 300 }, { x: 535, y: 605 }],  // underwing nacelles
  a321neo: [{ x: 580, y: 340 }, { x: 580, y: 650 }],  // underwing nacelles
  b739er: [{ x: 910, y: 355 }, { x: 910, y: 635 }],   // underwing nacelles
  jet: [{ x: 760, y: 300 }, { x: 960, y: 480 }],      // regional jet art (also used for the E175LR)
};
function engineLayoutFor(typeId) {
  return AIRCRAFT_ENGINE_LAYOUT[typeId] || AIRCRAFT_ENGINE_LAYOUT.jet;
}
function artDimsFor(typeId) {
  return AIRCRAFT_ART_DIMS[typeId] || AIRCRAFT_ART_DIMS.jet;
}

/* ---------------- Aircraft in-flight marker + animation ---------------- */
function spawnPlaneMarker(f, points) {
  clearPlaneRouteIfFor(f.uid); // previous leg's route display (if any) is now stale
  clearPlaneTrail(f);
  if (f.marker) { map.removeLayer(f.marker); f.marker = null; }
  const pts = points || (f.route && (f.leg === 'in' ? f.route.inPoints : f.route.outPoints));
  if (!pts) return;
  const pos = positionAlongRoute(pts, f.progressNM);
  // Compute the anchor from the same unrounded size used for iconSize
  // (rounding each independently could nudge the anchor a pixel off-center
  // at certain sizes, which reads as the plane bobbing vertically while
  // the size slider is dragged).
  const rawPlaneSize = 26 * planeMarkerScale;
  const planeSize = Math.round(rawPlaneSize);
  const planeAnchor = Math.round(rawPlaneSize / 2);
  const icon = L.divIcon({
    className: 'plane-marker-icon',
    html: `<div style="width:${planeSize}px;height:${planeSize}px;">${planeIconMarkup('plane-rot', f.typeId)}</div>`,
    iconSize: [planeSize, planeSize],
    iconAnchor: [planeAnchor, planeAnchor],
  });
  // pane: 'planePane' keeps the aircraft rendered above every airport pin,
  // and interactive: true lets the player click it to see its route.
  f.marker = L.marker(pos.latlng, { icon, interactive: true, pane: 'planePane' }).addTo(map);
  f.marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    showPlaneRoute(f);
  });
  // Reset the unwrapped rotation tracker for this leg so the plane snaps
  // straight to its true heading instead of spinning in from whatever
  // angle it happened to end the previous leg at.
  f._rotDeg = undefined;
  updatePlaneRotation(f, pos.bearing);
  resetPlaneTrail(f);
}

/* Resizes an already-flying aircraft's icon in place (no repositioning),
   used when the player changes the airplane size setting mid-flight. */
function refreshPlaneMarkerIcon(f) {
  if (!f.marker) return;
  const rawPlaneSize = 26 * planeMarkerScale;
  const planeSize = Math.round(rawPlaneSize);
  const planeAnchor = Math.round(rawPlaneSize / 2);
  const icon = L.divIcon({
    className: 'plane-marker-icon',
    html: `<div style="width:${planeSize}px;height:${planeSize}px;">${planeIconMarkup('plane-rot', f.typeId)}</div>`,
    iconSize: [planeSize, planeSize],
    iconAnchor: [planeAnchor, planeAnchor],
  });
  f.marker.setIcon(icon);
  if (typeof f._rotDeg === 'number') updatePlaneRotation(f, f._rotDeg);
}

/* Rotates the plane to face `bearing` (0-360, compass degrees) without ever
   spinning "the long way around". CSS transitions on `transform: rotate()`
   interpolate the raw numbers it's given, so naively setting rotate(359deg)
   then rotate(2deg) makes the browser animate backwards through 357
   degrees instead of forwards through 3 — that's the "random turn" the
   plane used to make near north. Instead we keep a running, unwrapped
   angle per aircraft and only ever nudge it by the shortest signed delta
   (-180..180) from its last value, so the dial only ever turns the short
   way and the heading always matches the route. */
function updatePlaneRotation(f, bearing) {
  if (!f.marker) return;
  const el = f.marker.getElement();
  if (!el) return;
  const rot = el.querySelector('.plane-rot');
  if (!rot) return;
  // Correct for the icon artwork's own nose direction so rotate(0) plus
  // this offset actually points the nose along `bearing`.
  const targetDeg = bearing - planeIconNoseBearing(f.typeId);
  if (typeof f._rotDeg !== 'number') {
    f._rotDeg = targetDeg;
  } else {
    const delta = ((targetDeg - f._rotDeg + 540) % 360) - 180;
    f._rotDeg += delta;
  }
  rot.style.transform = `rotate(${f._rotDeg}deg)`;
}

/* Given cumulative progress (nm) along a sampled route, return interpolated
   lat/lng position and current bearing. */
function positionAlongRoute(points, progressNM) {
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = haversineNM(points[i - 1], points[i]);
    if (acc + segLen >= progressNM || i === points.length - 1) {
      const t = segLen > 0 ? Math.min(1, Math.max(0, (progressNM - acc) / segLen)) : 0;
      const lat = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t;
      const lon = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t;
      return { latlng: [lat, lon], bearing: bearingDeg(points[i - 1], points[i]) };
    }
    acc += segLen;
  }
  const last = points[points.length - 1];
  return { latlng: last, bearing: 0 };
}

/* Points from the start of the route up to progressNM (inclusive of an
   interpolated point exactly at the current position). Used to draw the
   "already traveled" portion of a route. */
function pointsUpToProgress(points, progressNM) {
  const result = [points[0]];
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = haversineNM(points[i - 1], points[i]);
    if (acc + segLen >= progressNM) {
      const t = segLen > 0 ? Math.min(1, Math.max(0, (progressNM - acc) / segLen)) : 0;
      const lat = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t;
      const lon = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t;
      result.push([lat, lon]);
      return result;
    }
    result.push(points[i]);
    acc += segLen;
  }
  return result;
}

/* Points from the current position (interpolated) through to the end of the
   route. Used to draw the "still to go" portion of a route. */
function pointsFromProgress(points, progressNM) {
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = haversineNM(points[i - 1], points[i]);
    if (acc + segLen >= progressNM) {
      const t = segLen > 0 ? Math.min(1, Math.max(0, (progressNM - acc) / segLen)) : 0;
      const lat = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t;
      const lon = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t;
      return [[lat, lon], ...points.slice(i)];
    }
    acc += segLen;
  }
  return [points[points.length - 1]];
}

/* Interpolated points of `points` strictly between progress fromNM and
   toNM (fromNM <= toNM), inclusive of both interpolated endpoints. Used to
   draw the short white contrail segment immediately behind the plane. */
function pointsBetweenProgress(points, fromNM, toNM) {
  const tail = pointsFromProgress(points, fromNM);
  return pointsUpToProgress(tail, Math.max(0, toNM - fromNM));
}

/* ---------------- Engine smoke / contrail trail ----------------
   A fading engine-exhaust trail drawn behind each in-flight aircraft,
   visible only once it's more than TRAIL_AIRPORT_BUFFER_KM of real
   geographic distance from its departure airport, and hidden again once
   it comes within TRAIL_AIRPORT_BUFFER_KM of its arrival airport (see
   speed-model.js).

   This is a literal history, not a decorative line: every tick we compute
   the current world-space position of every one of the aircraft's engines
   (per the aircraft type's AIRCRAFT_ENGINE_LAYOUT above — two points for
   a twinjet/turboprop, four for a four-engine widebody, rotated with the
   aircraft's actual heading) and append them to that many entirely
   separate per-engine point histories, each tagged with the aircraft's
   cumulative route progress (nm) at that moment. Points older than
   TRAIL_LENGTH_NM behind the aircraft's *current* progress are dropped
   every tick, so each history always holds roughly the last ~30 km of
   where that specific engine actually was — including every turn, since
   the points themselves sit on the aircraft's real flown path rather than
   being re-derived from its current heading.

   The per-engine histories are never combined, blended, or drawn toward
   each other at any point along their length — each is rendered as its
   own single continuous curve, from directly behind its engine out to the
   30 km mark, entirely independent of every other engine's trail. This is
   deliberate: tapering trails toward a shared centerline reads as
   "realistic merging" in principle, but combined with any per-point
   jitter it makes lines cross one another right where they nearly meet —
   exactly the kind of stray intersection a real contrail never has. Clean
   parallel curves — one per engine, all four of them on a four-engine
   aircraft — is the correct, physically-honest result.

   If the aircraft covers more ground in one tick than TRAIL_SAMPLE_STEP_NM
   (a fast leg, or a big game-speed multiplier), extra points are
   interpolated along the route between the previous and current progress
   instead of just the two endpoints, so the trail never shows a visible
   gap or a diagonal shortcut across a turn that happened mid-tick.

   The engine attachment point itself is NOT a geographic offset — real
   engine spacing is only a few meters, meaningless in lat/lng terms and
   wildly different from one map zoom to the next. Instead it's computed as
   a screen-pixel offset from the marker (see engineWorldPositions above),
   exactly the way the icon artwork itself is positioned, so it always
   sits visually attached to the aircraft's actual engines regardless of
   zoom. Softness comes from the opacity/width fade below plus a CSS blur
   on the trail's own map pane (see map-init.js) — not from displacing the
   geometry itself, which is what caused the crossing lines above. */
const TRAIL_SAMPLE_STEP_NM = 0.5;             // max nm gap between stored history points before interpolating
const TRAIL_MIN_WEIGHT = 1.3;
const TRAIL_MAX_WEIGHT = 4.5;
const TRAIL_MAX_OPACITY = 0.5;

function clearPlaneTrail(f) {
  if (f._trailLayer) {
    map.removeLayer(f._trailLayer);
    f._trailLayer = null;
  }
  f._trailHist = null; // array of per-engine histories, one per AIRCRAFT_ENGINE_LAYOUT point
  f._trailLastProgressNM = null;
}

/* Called whenever a new leg starts, so a leftover trail (and flown-history)
   from the previous leg never lingers under, or gets stitched onto, the
   freshly spawned marker. */
function resetPlaneTrail(f) {
  clearPlaneTrail(f);
}

/* World-space positions of the two engine attachment points for aircraft f
   at map position pos ({latlng, bearing}). This is the sole place trail
   geometry touches the aircraft's current pose, and it works entirely in
   screen-pixel space — the same space the icon artwork itself is drawn
   in — rather than geographic distance:

   1. Each AIRCRAFT_ENGINE_LAYOUT point is a pixel coordinate read directly
      off the source PNG, so first it's re-expressed as an offset from that
      image's own center (image center == the marker's anchor point, since
      the icon is centered on the aircraft's map position).
   2. That offset is scaled down by whatever the artwork itself is
      currently scaled by: the icon box is a `rawPlaneSize x rawPlaneSize`
      square, and object-fit:contain shrinks the (non-square, for b738 and
      jet) source image so its *longer* side fits that box — so the scale
      factor is rawPlaneSize / max(sourceWidth, sourceHeight), not the box
      size divided by anything geographic.
   3. The resulting small screen-pixel vector is rotated by the exact same
      angle the CSS transform rotates the icon by (bearing minus that
      type's nose bearing), so it turns together with the aircraft.
   4. Only at the very end is this pixel offset converted into a map
      position. Critically, that conversion is done with a FIXED reference
      zoom (ENGINE_OFFSET_REFERENCE_ZOOM below), via map.project/unproject,
      rather than with whatever zoom happens to be live at that instant
      (map.latLngToLayerPoint/layerPointToLatLng, which are pinned to the
      map's *current* zoom and pixel origin). If the live zoom were used
      here, every new trail point would bake in a lateral engine-offset
      sized for whatever zoom the user happened to be at the moment it was
      recorded — so a trail laid down while zooming in and out would end
      up as a chain of segments with wildly different widths/offsets from
      the centerline, which reads as the whole contrail stretching,
      bending, or jumping in shape as you zoom (even though each already-
      stored lat/lng point never itself changes). Using a fixed reference
      zoom for this pixel<->geo conversion makes every trail point's
      lateral offset represent the same real-world distance regardless of
      when it was recorded or what the live camera zoom is doing, so the
      trail's shape stays fixed and only its on-screen scale changes when
      you zoom — exactly like the aircraft's own path. */
const ENGINE_OFFSET_REFERENCE_ZOOM = 13;
function engineWorldPositions(f, pos) {
  const dims = artDimsFor(f.typeId);
  const layout = engineLayoutFor(f.typeId);
  const rawPlaneSize = 26 * planeMarkerScale; // must track spawnPlaneMarker/refreshPlaneMarkerIcon
  const scale = rawPlaneSize / Math.max(dims.w, dims.h); // source px -> on-screen px, per object-fit:contain
  const rotDeg = pos.bearing - planeIconNoseBearing(f.typeId);
  const rad = rotDeg * Math.PI / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  // Fixed-zoom projection, NOT map.latLngToLayerPoint — see note above.
  const anchorPoint = map.project(pos.latlng, ENGINE_OFFSET_REFERENCE_ZOOM);

  function toWorld(localPx) {
    // Offset from the image's own center, in reference-zoom pixels, before rotation.
    const dx0 = (localPx.x - dims.w / 2) * scale;
    const dy0 = (localPx.y - dims.h / 2) * scale;
    // Rotate to match the aircraft's current on-screen rotation (CSS
    // rotate() is clockwise-positive in screen space, which this matches).
    const dx = dx0 * cos - dy0 * sin;
    const dy = dx0 * sin + dy0 * cos;
    // Unproject at the SAME fixed reference zoom used above, so this
    // offset always maps to the same real-world distance no matter what
    // zoom the map is actually showing right now.
    return map.unproject(L.point(anchorPoint.x + dx, anchorPoint.y + dy), ENGINE_OFFSET_REFERENCE_ZOOM);
  }

  return layout.map(toWorld);
}

/* Appends one history point per engine at route progress progressNM
   (interpolated along the leg's own points, not just the aircraft's
   current position), tagging each with that progress value so later
   rendering can tell how far behind the aircraft's *current* progress it
   now sits. Every engine's point is pushed together, in lockstep, so all
   of a given aircraft's histories stay the same length with matching
   progress values — but they are stored and later rendered as completely
   independent arrays; nothing below ever reads one engine's history while
   drawing another's. */
function appendTrailPoint(f, points, progressNM) {
  const p = positionAlongRoute(points, progressNM);
  const worldPositions = engineWorldPositions(f, p);
  worldPositions.forEach((ll, i) => {
    f._trailHist[i].push({ ll, prog: progressNM });
  });
}

/* Drops history points that have fallen more than TRAIL_LENGTH_NM behind
   the aircraft's current progress — keeping one point past the cutoff so
   the drawn line still has something to fade into rather than snapping
   off mid-segment. */
function pruneTrailHistory(hist, currentProgressNM) {
  while (hist.length > 1 && (currentProgressNM - hist[1].prog) > TRAIL_LENGTH_NM) {
    hist.shift();
  }
}

/* Draws ONE engine's history as a single continuous curve — a chain of
   short polyline pieces, each sharing its endpoint with the next so there
   is never a gap or a jump, whose opacity and thickness are driven purely
   by how far behind the aircraft's current position that point now is:
   strong and narrow right at the engine, gradually fainter and a little
   wider toward the 30 km tail, with a slow power-curve falloff so nothing
   drops off abruptly. Every plotted coordinate is an actual past engine
   position — nothing here derives a point from the aircraft's current
   heading or from the other engine's history. */
function drawEngineTrail(layerGroup, hist, currentProgressNM) {
  if (hist.length < 2) return;
  const rendered = hist.map(h => {
    const age = Math.max(0, currentProgressNM - h.prog); // nm behind the aircraft, right now
    const ageFrac = Math.max(0, Math.min(1, age / TRAIL_LENGTH_NM));
    return { ll: h.ll, ageFrac };
  });
  const RUN = 3; // points per polyline piece, consecutive pieces share an endpoint
  for (let i = 0; i < rendered.length - 1; i += RUN - 1) {
    const end = Math.min(rendered.length - 1, i + RUN - 1);
    if (end <= i) continue;
    const a = rendered[i], b = rendered[end];
    const frac = (a.ageFrac + b.ageFrac) / 2; // 0 at the engine, 1 at the far tail
    const opacity = TRAIL_MAX_OPACITY * Math.pow(1 - frac, 1.5); // gradual fade, never an abrupt cutoff
    if (opacity < 0.012) continue; // fully faded out — skip drawing an invisible segment
    const weight = TRAIL_MIN_WEIGHT + (TRAIL_MAX_WEIGHT - TRAIL_MIN_WEIGHT) * frac;
    L.polyline(rendered.slice(i, end + 1).map(p => p.ll), {
      pane: 'trailPane',
      color: '#ffffff',
      weight,
      opacity,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false,
    }).addTo(layerGroup);
  }
}

function updatePlaneTrail(f, pos) {
  if (!f.marker || !pos) return;
  const points = f.leg === 'in' ? f.route.inPoints : f.route.outPoints;

  // Real great-circle distance from the actual departure/arrival airport
  // coordinates — not a fraction of the leg's total length — per the
  // 100 km on/off buffers above.
  const depCode = f.leg === 'in' ? f.route.destCode : f.homeCode;
  const arrCode = f.leg === 'in' ? f.homeCode : f.route.destCode;
  const depEntry = markerByCode[depCode], arrEntry = markerByCode[arrCode];
  const depLL = depEntry ? [depEntry.ap.lat, depEntry.ap.lon] : points[0];
  const arrLL = arrEntry ? [arrEntry.ap.lat, arrEntry.ap.lon] : points[points.length - 1];
  const distFromDepKm = haversineNM(pos.latlng, depLL) * NM_TO_KM;
  const distToArrKm = haversineNM(pos.latlng, arrLL) * NM_TO_KM;
  const active = distFromDepKm > TRAIL_AIRPORT_BUFFER_KM && distToArrKm > TRAIL_AIRPORT_BUFFER_KM;

  const engineCount = engineLayoutFor(f.typeId).length;
  if (!f._trailHist) f._trailHist = Array.from({ length: engineCount }, () => []);

  if (active) {
    const lastProg = f._trailLastProgressNM;
    if (lastProg == null) {
      appendTrailPoint(f, points, f.progressNM);
    } else {
      const gap = f.progressNM - lastProg;
      if (gap > 1e-6) {
        // Interpolate along the route (not a straight line) so a big jump
        // between ticks still bends through whatever turn happened in it,
        // and so the trail never shows a visible gap or diagonal shortcut.
        const steps = Math.max(1, Math.ceil(gap / TRAIL_SAMPLE_STEP_NM));
        for (let s = 1; s <= steps; s++) {
          appendTrailPoint(f, points, lastProg + (gap * s) / steps);
        }
      }
    }
    f._trailLastProgressNM = f.progressNM;
  } else {
    // Stop laying down new trail, but leave the existing history alone —
    // it keeps aging out and fading on its own via pruneTrailHistory below,
    // rather than vanishing the instant the aircraft crosses the buffer.
    f._trailLastProgressNM = null;
  }

  f._trailHist.forEach(hist => pruneTrailHistory(hist, f.progressNM));

  if (f._trailHist.every(hist => hist.length < 2)) {
    if (f._trailLayer) f._trailLayer.clearLayers();
    return;
  }

  if (!f._trailLayer) f._trailLayer = L.layerGroup().addTo(map);
  f._trailLayer.clearLayers();
  f._trailHist.forEach(hist => drawEngineTrail(f._trailLayer, hist, f.progressNM));
}

/* ---------------- Plane click: show its route so far / still to fly ----------------
   Traveled distance draws as a solid white line, the remaining distance as a
   dashed white line. A small popup on the plane shows the leg's fare — hidden
   once the flight is fully booked (100% load), since the price no longer
   matters at that point, but the load percentage itself always stays shown. */
let planeRouteLayers = null;
let planeRouteUid = null;

/* The info popup is kept as a standalone L.popup rather than one bound to
   the plane marker via marker.bindPopup(). Binding it to the marker made
   Leaflet register its own internal "click toggles this popup" listener
   on the marker (added the first time bindPopup() ran) *in addition* to
   our own click handler below. Both listeners then fired on every later
   click: ours re-opened the popup, and Leaflet's — seeing a popup that
   was, from its perspective, already open — immediately closed it again.
   That's why the info box used to open the first time and then refuse to
   open on every click after. A standalone popup we open/move/close
   ourselves sidesteps that internal listener entirely. */
let routePopup = null;

/* The aircraft (if any) the map is currently auto-panning to keep centered,
   toggled via the Follow button in the plane info popup. */
let followedPlaneUid = null;

/* `preserveFollowUid`, when passed, keeps the follow camera locked on that
   aircraft even though its route/popup is being torn down and rebuilt —
   used when re-clicking the very plane you're already following, so
   checking on it doesn't stop the camera from tracking it. Any other
   caller (map click, leg completion, clicking a different plane) omits it
   and following is cancelled as before. */
function clearPlaneRoute(preserveFollowUid) {
  if (planeRouteLayers) {
    map.removeLayer(planeRouteLayers.traveled);
    map.removeLayer(planeRouteLayers.remaining);
    planeRouteLayers = null;
  }
  if (routePopup) {
    const p = routePopup;
    routePopup = null;
    map.closePopup(p);
  }
  planeRouteUid = null;
  if (followedPlaneUid !== preserveFollowUid) followedPlaneUid = null;
}

/* How often (ms) the popup's HTML is allowed to be rebuilt while it's open.
   setContent() replaces the popup's entire innerHTML, including the Follow
   button element itself. Rebuilding that on every animation frame (as the
   code used to, to keep the distance/time readouts live) meant the button
   you were physically pressing could be destroyed and replaced by a new
   element in the gap between your mousedown and mouseup — and a browser
   click event never fires if the element it started on isn't there anymore
   at mouseup. That's why clicking "Follow this aircraft" could silently do
   nothing. Throttling the rebuild to a few times a second leaves the button
   sitting still for comfortably longer than any real click gesture takes,
   while still keeping the live numbers current. */
const POPUP_CONTENT_REFRESH_MS = 350;
let lastPopupContentRefreshMs = 0;

/* Toggles following the given aircraft on the map — called from the inline
   onclick on the Follow button inside the popup HTML (the popup content is
   regenerated periodically, so a plain global function referenced by name
   survives that far more simply than re-binding an event listener after
   every re-render). */
function togglePlaneFollow(uid) {
  const f = fleet.find(x => x.uid === uid);
  if (!f) return;
  followedPlaneUid = (followedPlaneUid === uid) ? null : uid;
  if (followedPlaneUid && f.marker) {
    map.setView(f.marker.getLatLng(), map.getZoom(), { animate: true, duration: 0.4 });
  }
  if (routePopup && planeRouteUid === uid) {
    // Refresh right away so the button's own label/state (Follow <-> Following)
    // reflects the click immediately, and reset the throttle clock so the
    // routine per-frame refresh below doesn't rebuild it again a moment later.
    //
    // This has to happen on the next tick rather than synchronously here.
    // We're still inside the native "click" event that originated on the
    // Follow button itself, and that event is still bubbling up through the
    // popup's DOM (button -> content node -> wrapper -> popup container) on
    // its way to Leaflet's own click handling on the map container. Leaflet
    // decides whether a click "belongs" to the popup by walking up from the
    // click's original target looking for the popup container's disable-click
    // marker. setContent() replaces the content node's children immediately,
    // which detaches the very button the click originated on *before* that
    // walk happens. With its ancestor chain cut, Leaflet can no longer find
    // the popup container, treats the click as landing on bare map, and fires
    // the map's own 'click' handler — which cancels the follow state we just
    // set above, on the same click that turned it on. Deferring the rebuild
    // lets the click finish bubbling (and Leaflet's handling of it complete)
    // first.
    setTimeout(() => {
      routePopup.setContent(planeRouteInfoHTML(f));
      lastPopupContentRefreshMs = Date.now();
    }, 0);
  }
}
window.togglePlaneFollow = togglePlaneFollow;

/* Called every tick a flying aircraft's marker position updates — recenters
   the map on it, if it's the currently-followed plane. Uses setView with no
   animation (each nudge is a tiny sub-pixel-scale move happening every
   frame) rather than panTo, which routes through Leaflet's "animated pan"
   heuristics — those can decide to fall back to a different internal path
   depending on how far the offset is, which made the camera's tracking of
   the aircraft inconsistent instead of perfectly continuous. A direct,
   unconditional setView every frame is what actually keeps the plane
   pinned to the center of the screen as it moves. */
function panMapToFollowedPlane(f, latlng) {
  if (followedPlaneUid !== f.uid) return;
  map.setView(latlng, map.getZoom(), { animate: false });
}

// Stop following as soon as the player manually drags the map — Leaflet
// only fires 'dragstart' for an actual user-driven drag, never for a
// programmatic panTo/setView, so this never fights the follow-pan itself.
map.on('dragstart', () => { followedPlaneUid = null; });

/* Formats a moment in time as a 24h HH:MM clock reading local to the given
   IANA timezone — used for a leg's estimated departure/arrival times. */
function formatLocalClockAt(ms, tz) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit',
    }).format(new Date(ms));
  } catch (e) {
    return '--:--';
  }
}

function clearPlaneRouteIfFor(uid) {
  if (planeRouteUid === uid) clearPlaneRoute();
}

function planeRouteInfoHTML(f) {
  const leg = f.leg;
  const distNM = leg === 'in' ? f.route.inDistanceNM : f.route.outDistanceNM;
  const km = distNM * NM_TO_KM;
  const traveled = Math.min(f.progressNM, distNM);
  const remaining = Math.max(0, distNM - f.progressNM);
  const fromCode = leg === 'in' ? f.route.destCode : f.homeCode;
  const toCode = leg === 'in' ? f.homeCode : f.route.destCode;
  const price = f.tickets ? (leg === 'in' ? f.tickets.in : f.tickets.out) : null;
  const type = getAircraftType(f.typeId);

  // e.g. "Finnair — Helsinki → Malaga" when the player has named their
  // airline; falls back to just the city pair otherwise.
  const fromCity = (markerByCode[fromCode] && markerByCode[fromCode].ap.city) || fromCode;
  const toCity = (markerByCode[toCode] && markerByCode[toCode].ap.city) || toCode;
  const airlineLine = airlineName ? `${airlineName} — ${fromCity} → ${toCity}` : `${fromCity} → ${toCity}`;

  // Time remaining / estimated departure & arrival — reconstructed from
  // this leg's actual departure moment (f._legDepartMs, stamped the instant
  // it took off) plus the full-leg flight duration, rather than backing it
  // out of progress alone, so it stays exact even mid-flight.
  const legMarkers = leg === 'in' ? f.route.inPhaseMarkersNM : f.route.outPhaseMarkersNM;
  const totalHours = legFlightTimeHoursWithMarkers(distNM, legMarkers, type);
  const nowMs = (typeof window.getGameTime === 'function' && window.getGameTime())
    ? window.getGameTime().getTime() : Date.now();
  const depMs = (typeof f._legDepartMs === 'number') ? f._legDepartMs : nowMs;
  const elapsedHours = Math.max(0, (nowMs - depMs) / 3600000);
  const remainingHours = Math.max(0, totalHours - elapsedHours);
  const arrivalMs = depMs + totalHours * 3600000;
  const fromEntry = markerByCode[fromCode], toEntry = markerByCode[toCode];
  const depClock = fromEntry ? formatLocalClockAt(depMs, fromEntry.ap.tz) : '--:--';
  const arrClock = toEntry ? formatLocalClockAt(arrivalMs, toEntry.ap.tz) : '--:--';

  let fareLine = '';
  if (price) {
    const pct = Math.round(demandLoadFactor(price.adult, km, type) * 100);
    const full = pct >= 100;
    fareLine = `
      <div class="plane-info-row" style="margin-top:6px;">
        <span>Load</span><b style="color:${full ? '#4caf6d' : 'var(--amber)'}">${pct}% booked</b>
      </div>
      ${full ? '' : `<div class="plane-info-row"><span>Adult fare</span><b style="color:var(--amber)">$${price.adult}</b></div>`}
    `;
  }

  const isFollowing = followedPlaneUid === f.uid;

  return `
    <div style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-dim);min-width:190px;">
      <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;color:var(--ink);margin-bottom:2px;">${airlineLine}</div>
      <div style="font-size:10px;letter-spacing:0.06em;color:var(--ink-dim);margin-bottom:6px;">${fromCode} → ${toCode}</div>
      <div class="plane-info-row"><span>Destination</span><b style="color:#fff">${toCity} (${toCode})</b></div>
      <div class="plane-info-row"><span>Aircraft</span><b style="color:#fff">${type.name}</b></div>
      <div class="plane-info-row"><span>Distance remaining</span><b style="color:#fff">${remaining.toFixed(0)} NM</b></div>
      <div class="plane-info-row"><span>Time remaining</span><b style="color:#fff">${formatHoursMinutes(remainingHours)}</b></div>
      <div class="plane-info-row"><span>Est. departure</span><b style="color:#fff">${depClock} ${fromCode}</b></div>
      <div class="plane-info-row"><span>Est. arrival</span><b style="color:#fff">${arrClock} ${toCode}</b></div>
      ${fareLine}
      <button class="plane-follow-btn${isFollowing ? ' active' : ''}" onclick="togglePlaneFollow('${f.uid}')">${isFollowing ? '◉ Following — tap to stop' : '◎ Follow this aircraft'}</button>
    </div>
  `;
}

function showPlaneRoute(f) {
  if (!f.route || !f.leg) return;
  // Preserve the follow camera if we're re-clicking the very plane already
  // being followed — only actually cancels following when this teardown is
  // for a different plane (or no plane at all).
  clearPlaneRoute(f.uid);
  const points = f.leg === 'in' ? f.route.inPoints : f.route.outPoints;

  planeRouteLayers = {
    traveled: L.polyline(pointsUpToProgress(points, f.progressNM), {
      color: '#ffffff', weight: 3, opacity: 0.95,
    }).addTo(map),
    remaining: L.polyline(pointsFromProgress(points, f.progressNM), {
      color: '#ffffff', weight: 2.5, opacity: 0.55, dashArray: '6,7',
    }).addTo(map),
  };
  planeRouteUid = f.uid;

  if (f.marker) {
    // A standalone popup, not bound to the marker — see the comment above
    // routePopup's declaration for why. autoPan is off deliberately: with
    // this popup's content (and therefore size) re-rendering every frame
    // while following, Leaflet's own autoPan would occasionally decide the
    // popup had drifted out of view and nudge the map itself, fighting
    // with panMapToFollowedPlane's own recentering every frame.
    routePopup = L.popup({
      className: 'plane-route-popup',
      autoPan: false,
      autoClose: false,
      closeOnClick: false,
    })
      .setLatLng(f.marker.getLatLng())
      .setContent(planeRouteInfoHTML(f))
      .openOn(map);
    lastPopupContentRefreshMs = Date.now();
  }
}

/* Called every tick a shown plane's route is still active, so the traveled/
   remaining lines (and the popup, if open) track the aircraft live. The
   popup's position is moved every frame (cheap, just repositions the
   existing element) but its HTML content is only rebuilt a few times a
   second — see the comment on POPUP_CONTENT_REFRESH_MS above for why. */
function refreshPlaneRouteIfActive(f) {
  if (planeRouteUid !== f.uid || !planeRouteLayers) return;
  const points = f.leg === 'in' ? f.route.inPoints : f.route.outPoints;
  planeRouteLayers.traveled.setLatLngs(pointsUpToProgress(points, f.progressNM));
  planeRouteLayers.remaining.setLatLngs(pointsFromProgress(points, f.progressNM));
  if (routePopup && f.marker) {
    routePopup.setLatLng(f.marker.getLatLng());
    const now = Date.now();
    if (now - lastPopupContentRefreshMs >= POPUP_CONTENT_REFRESH_MS) {
      lastPopupContentRefreshMs = now;
      routePopup.setContent(planeRouteInfoHTML(f));
    }
  }
}

// Wrapped in a plain arrow function rather than passed directly: Leaflet
// calls click listeners with the click event as their first argument, and
// clearPlaneRoute's first parameter is the "preserve follow for this uid"
// override — passing the raw event straight through would land in that
// param instead of being ignored.
map.on('click', () => clearPlaneRoute());
