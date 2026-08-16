/* ================================================================
   Save / load: serialize the fleet + player state into
   localStorage, and restore it on boot.

   IMPORTANT: restoreGameState() is deliberately NOT auto-invoked
   here (the original file ran it as a self-executing IIFE, which
   worked only because the whole game was one <script> block with
   full-file function hoisting — it called spawnPlaneMarker(),
   defined much later in the file, before that definition had
   'textually' been reached). Now that the game is split across
   many files, main.js calls restoreGameState() explicitly, once
   every other module (in particular js/systems/planes.js) has
   finished loading.
   ================================================================ */
/* ---------------- Save / load (persists across sessions) ---------------- */
const SAVE_KEY = 'aeroatlas_save_v2'; // bumped: airport tier/price data model changed

function serializeFleet() {
  return fleet.map(f => ({
    uid: f.uid,
    typeId: f.typeId,
    homeCode: f.homeCode,
    status: f.status,
    route: f.route,
    tickets: f.tickets,
    schedule: f.schedule,
    leg: f.leg,
    progressNM: f.progressNM,
    turnaroundRemainingHours: f.turnaroundRemainingHours,
    tripsToday: f.tripsToday,
    flightsCompleted: f.flightsCompleted,
    lastServiceKey: f.lastServiceKey,
  }));
}

function saveGameState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      playerMoney,
      playerReputation,
      airlineName,
      airlineLogoId,
      gameStarted,
      owned: Array.from(ownedAirports),
      myAirport: myAirportCode,
      fleet: serializeFleet(),
      lastServiceDayKey,
      airportComfort,
      settings: (typeof window.getUISettings === 'function') ? window.getUISettings() : undefined,
      // In-game clock reading + the real-world moment it was taken, so that
      // on next load we can fast-forward flights that were in progress
      // while the site (or the device) was closed — see restoreGameStateInner.
      gameTimeMs: (typeof window.getGameTime === 'function' && window.getGameTime())
        ? window.getGameTime().getTime() : Date.now(),
      savedAtMs: Date.now(),
    }));
  } catch (e) { /* storage unavailable — ignore */ }
}

/* Make sure the very last game-clock reading gets saved right as the tab
   closes/backgrounds — not just on the next in-game event — so offline
   catch-up on the next visit starts from an accurate, fresh timestamp
   instead of whatever the last mid-session save happened to be. */
try {
  window.addEventListener('pagehide', () => saveGameState());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveGameState();
  });
} catch (e) { /* ignore in non-browser contexts */ }

function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}


/* ---------------- Restore saved game (owned airports, money, home base) ---------------- */
function restoreGameState() {
  try {
    restoreGameStateInner();
  } catch (e) {
    // A corrupted or incompatible save (e.g. left over from an older
    // version of this file) must never be allowed to take down the rest
    // of the app — the clock, night overlay, and buy panel all live in
    // code that runs after this point.
    console.error('Failed to restore saved game state — starting fresh.', e);
    try { localStorage.removeItem(SAVE_KEY); } catch (e2) { /* ignore */ }
  }
}

function restoreGameStateInner() {
  const saved = loadGameState();
  if (!saved) return;

  if (typeof saved.playerMoney === 'number') playerMoney = saved.playerMoney;
  if (typeof saved.playerReputation === 'number') playerReputation = Math.min(100, Math.max(0, saved.playerReputation));
  if (typeof saved.airlineName === 'string') airlineName = saved.airlineName;
  if (typeof saved.airlineLogoId === 'string') airlineLogoId = saved.airlineLogoId;
  if (typeof saved.gameStarted === 'boolean') gameStarted = saved.gameStarted;

  (saved.owned || []).forEach(code => {
    const entry = markerByCode[code];
    if (!entry) return;
    ownedAirports.add(code);
    const el = entry.marker.getElement();
    if (el) el.classList.add('owned');
  });

  if (saved.myAirport && markerByCode[saved.myAirport]) {
    myAirportCode = saved.myAirport;
  } else if (ownedAirports.size) {
    myAirportCode = Array.from(ownedAirports)[0];
  }

  if (typeof saved.lastServiceDayKey === 'string') lastServiceDayKey = saved.lastServiceDayKey;

  if (saved.airportComfort && typeof saved.airportComfort === 'object') {
    Object.keys(saved.airportComfort).forEach(code => {
      const sc = saved.airportComfort[code] || {};
      airportComfort[code] = {
        firstFlightBonus: !!sc.firstFlightBonus,
        services: (sc.services && typeof sc.services === 'object') ? { ...sc.services } : {},
      };
    });
  }

  // Player-created port points used to be saved into this same localStorage
  // blob (js/systems/port-editor.js). They are now GLOBAL, server-backed
  // data (see js/systems/port-points-sync.js) — loaded from the server at
  // boot, not from here. Any points already sitting in an existing local
  // save are NOT discarded, though: they're stashed on
  // window._legacyLocalPortPoints so migrateLocalPortPointsToServer() can
  // upload whichever of them the server doesn't already have, the next
  // time this browser opens the game with an admin token set. Validated
  // point-by-point rather than trusted wholesale, since this is untrusted
  // localStorage content.
  if (saved.userPortPoints && typeof saved.userPortPoints === 'object') {
    const legacy = {};
    Object.keys(saved.userPortPoints).forEach(iata => {
      const list = saved.userPortPoints[iata];
      if (!Array.isArray(list)) return;
      const clean = list.filter(p => p && typeof p.id === 'string'
        && Array.isArray(p.stopPoint) && p.stopPoint.length === 2
        && typeof p.stopPoint[0] === 'number' && typeof p.stopPoint[1] === 'number');
      if (clean.length) legacy[iata] = clean.map(p => ({ id: p.id, stopPoint: [p.stopPoint[0], p.stopPoint[1]] }));
    });
    if (Object.keys(legacy).length) window._legacyLocalPortPoints = legacy;
  }

  (saved.fleet || []).forEach(sf => {
    // Legacy saves (pre route-rework) used a single-leg `route.points` shape
    // with a 'flying' status. That geometry can't be reused here (routes are
    // now anchored to runway ends at both airports), so those aircraft are
    // simply parked back in storage for the player to re-route.
    const isLegacyRoute = sf.route && sf.route.points && !sf.route.outPoints;

    const f = {
      uid: sf.uid || newFleetUid(),
      typeId: sf.typeId,
      homeCode: sf.homeCode,
      status: isLegacyRoute ? 'storage' : (sf.status || 'storage'),
      route: isLegacyRoute ? null : (sf.route || null),
      tickets: isLegacyRoute ? null : (sf.tickets || null),
      schedule: isLegacyRoute ? null : (sf.schedule || null),
      leg: isLegacyRoute ? null : (sf.leg || null),
      progressNM: sf.progressNM || 0,
      turnaroundRemainingHours: typeof sf.turnaroundRemainingHours === 'number' ? sf.turnaroundRemainingHours : 0,
      tripsToday: sf.tripsToday || 0,
      flightsCompleted: sf.flightsCompleted || 0,
      lastServiceKey: sf.lastServiceKey || null,
      _lastDayKey: null,
      _lastMinutes: null,
      marker: null,
    };
    fleet.push(f);
  });

  // Fast-forward every aircraft through however much real-world time passed
  // since this save was written, at a flat 1x rate, regardless of whether
  // the site (or device) was closed the whole time or just backgrounded.
  // This must happen before markers are spawned below, since catch-up can
  // change any aircraft's status/progress/leg from what was saved.
  if (typeof saved.gameTimeMs === 'number' && typeof saved.savedAtMs === 'number') {
    const realElapsedMs = Math.min(Math.max(0, Date.now() - saved.savedAtMs), MAX_OFFLINE_REAL_MS);
    const fromDate = new Date(saved.gameTimeMs);
    const toDate = new Date(saved.gameTimeMs + realElapsedMs * GAME_MS_PER_REAL_MS_AT_1X);
    advanceFleetOffline(fromDate, toDate);
    if (typeof window.setGameTime === 'function') window.setGameTime(toDate);
  }

  fleet.forEach(f => {
    if ((f.status === 'outbound' || f.status === 'inbound') && f.route && !f.marker) {
      spawnPlaneMarker(f, f.leg === 'in' ? f.route.inPoints : f.route.outPoints);
    }
    // A mid-flight aircraft's exact departure moment (used for the info
    // popup's time-remaining/estimated-arrival readout) isn't itself
    // persisted — reconstruct it from how far along the leg it already is.
    if ((f.status === 'outbound' || f.status === 'inbound') && f.route && typeof f._legDepartMs !== 'number') {
      const total = f.leg === 'in' ? f.route.inDistanceNM : f.route.outDistanceNM;
      const markers = f.leg === 'in' ? f.route.inPhaseMarkersNM : f.route.outPhaseMarkersNM;
      const elapsedHours = legTimeToProgressHoursWithMarkers(f.progressNM, total, markers, getAircraftType(f.typeId));
      const nowMs = (typeof window.getGameTime === 'function' && window.getGameTime())
        ? window.getGameTime().getTime() : Date.now();
      f._legDepartMs = nowMs - elapsedHours * 3600000;
    }
  });

  if (ownedAirports.size > 0) gameStarted = true; // legacy saves predating this flag

  updateMoneyDisplay();
  updateReputationDisplay();
  updateMyAirportPanel();
  if (typeof updateAirlineDisplays === 'function') updateAirlineDisplays();

  // Open the map already slightly zoomed in on your airport.
  if (myAirportCode && markerByCode[myAirportCode]) {
    const homeAp = markerByCode[myAirportCode].ap;
    map.setView([homeAp.lat, homeAp.lon], 6);
  }
}

