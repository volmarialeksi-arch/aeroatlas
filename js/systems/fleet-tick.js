/* ================================================================
   Fleet tick loop: advances every aircraft's flight progress each
   time the game clock ticks (docked -> outbound -> turnaround ->
   inbound -> docked), local-timezone departure-time matching, and
   the twice-monthly service system.
   ================================================================ */
let lastFleetTickTime = null;

/* How long an aircraft sits at the destination before the return leg departs. */
const TURNAROUND_HOURS = 0.75;

/* Consumes the fixed 15-second hold at the runway threshold (see
   RUNWAY_HOLD_HOURS in js/core/speed-model.js) out of this tick's
   dtHours, once the aircraft's progress has reached taxiOutEnd, before
   any of it is handed to advanceLegProgress. Returns whatever dtHours is
   left over for actual movement (0 while still holding). Tracked per
   fleet aircraft via f._holdRemainHours/f._holdDone, both reset whenever
   a new leg begins (see the two places f.status is set to
   'outbound'/'inbound' below). */
function consumeRunwayHold(f, markers, dtHours) {
  if (!markers || markers.taxiOutEnd === undefined) return dtHours;
  if (f._holdDone) return dtHours;
  if (f.progressNM < markers.taxiOutEnd - 1e-9) return dtHours;
  if (typeof f._holdRemainHours !== 'number') f._holdRemainHours = RUNWAY_HOLD_HOURS;
  if (f._holdRemainHours > 1e-9) {
    const consumed = Math.min(f._holdRemainHours, dtHours);
    f._holdRemainHours -= consumed;
    dtHours -= consumed;
  }
  if (f._holdRemainHours <= 1e-9) f._holdDone = true;
  return dtHours;
}

/* Game-clock rate used for offline catch-up: always simulate absence at 1x,
   regardless of whatever speed (1x/2x) was selected when the site was last
   open. Matches day-night-clock.js's rateFactor(1). */
const GAME_MS_PER_REAL_MS_AT_1X = 2;

/* Cap how far back an offline gap can be simulated, just as a sanity net
   against a corrupted/absurd stored timestamp (e.g. clock skew) — this is
   generous enough to cover any realistic real-world absence. */
const MAX_OFFLINE_REAL_MS = 2 * 365 * 24 * 3600000; // 2 years

/* Fast-forwards the fleet simulation across a real-world gap (the site was
   closed, or the tab/device was asleep) by stepping the in-game clock
   forward in fixed increments from fromDate to toDate and running the
   normal per-tick fleet/service logic at each step. This lets flights
   complete, turn around, depart on their schedule, and get serviced exactly
   as they would have if the game had stayed open the whole time — just
   without the per-frame animation in between. */
function advanceFleetOffline(fromDate, toDate) {
  const STEP_MS = 15 * 60 * 1000; // 15 game-minutes per simulated step
  let t = fromDate.getTime();
  const end = toDate.getTime();
  if (end <= t) return;
  lastFleetTickTime = t; // re-baseline so the first simulated step's dt is exactly STEP_MS
  while (t < end) {
    t = Math.min(t + STEP_MS, end);
    const stepDate = new Date(t);
    updateFleetFlights(stepDate);
    runScheduledService(stepDate);
  }
}

/* Local clock reading (minutes-of-day + calendar day key) at a given
   timezone, used to detect when the in-game clock crosses a scheduled
   departure time at an aircraft's home airport. */
function localClockReading(date, tz) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(date);
    const map = {};
    parts.forEach(p => { map[p.type] = p.value; });
    let hour = parseInt(map.hour, 10);
    if (hour === 24) hour = 0;
    const minute = parseInt(map.minute, 10);
    return { minutes: hour * 60 + minute, dayKey: `${map.year}-${map.month}-${map.day}` };
  } catch (e) {
    return { minutes: 0, dayKey: 'x' };
  }
}

function parseHHMM(s) {
  const parts = (s || '0:0').split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/* Derives the aircraft's current named phase — TAXI_OUT / TAKEOFF_ROLL /
   CRUISE / APPROACH / LANDING / ROLLOUT / TAXI_TO_GATE / AT_GATE — purely
   from how far along its route it is, using the phase-milestone distances
   tickets.js records at publish time (outPhaseMarkersNM / inPhaseMarkersNM).
   This is read-only derived state: the actual movement engine
   (positionAlongRoute etc.) never changes, it's just annotated after the
   fact for display/debug purposes and to pick a ground vs. air speed (see
   js/core/speed-model.js). Returns 'CRUISE' for any route that never had a
   runway selected (no markers recorded), which is exactly the old,
   pre-runway-system behavior. */
function phaseForLeg(route, leg, progressNM, isHolding) {
  if (!route) return null;
  const m = leg === 'out' ? route.outPhaseMarkersNM : route.inPhaseMarkersNM;
  if (!m || m.approachStart === undefined) return 'CRUISE';
  if (m.taxiOutEnd !== undefined && progressNM < m.taxiOutEnd) return 'TAXI_OUT';
  if (isHolding && m.taxiOutEnd !== undefined && progressNM <= m.taxiOutEnd + 1e-9) return 'RUNWAY_HOLD';
  if (m.liftoff !== undefined && progressNM < m.liftoff) return 'TAKEOFF_ROLL';
  if (progressNM < m.approachStart) return 'CRUISE';
  if (m.landingPoint === undefined) return 'APPROACH';
  if (progressNM < m.landingPoint - 0.02) return 'APPROACH';
  if (progressNM < m.landingPoint + 0.02) return 'LANDING';
  if (m.rolloutEnd !== undefined && progressNM < m.rolloutEnd) return 'ROLLOUT';
  if (m.gateArrival !== undefined) {
    return progressNM < m.gateArrival ? 'TAXI_TO_GATE' : 'AT_GATE';
  }
  return 'ROLLOUT'; // no dot on record for this airport yet — rollout is the terminal phase
}

function updateFleetFlights(gameDate) {
  if (lastFleetTickTime === null) { lastFleetTickTime = gameDate.getTime(); return; }
  const dtHours = (gameDate.getTime() - lastFleetTickTime) / 3600000;
  lastFleetTickTime = gameDate.getTime();
  if (dtHours <= 0 || dtHours > 6) return; // guard against pause/resume or clock jumps

  fleet.forEach(f => {
    if (!f.route) return;
    const type = getAircraftType(f.typeId);

    /* Docked at home, waiting for a scheduled departure time. */
    if (f.status === 'docked' && f.schedule) {
      const homeEntry = markerByCode[f.homeCode];
      if (homeEntry) {
        const cur = localClockReading(gameDate, homeEntry.ap.tz);
        if (f._lastDayKey !== cur.dayKey) {
          f._lastDayKey = cur.dayKey;
          f.tripsToday = 0;
          f._lastMinutes = null; // avoid a false trigger right at the day boundary
        }
        // The aircraft appears sitting on its dot 5 minutes before its next
        // scheduled departure, but doesn't actually start moving until the
        // clock reaches that scheduled time (see the crossing-detection
        // loop below) — progressNM is still 0 while docked, so spawning the
        // marker now just shows it parked at route.outPoints[0], i.e. the
        // departure dot.
        if (f.tripsToday < 2 && f.schedule.departures.length && !f.marker) {
          let minutesUntilNext = Infinity;
          f.schedule.departures.forEach(dep => {
            let diff = parseHHMM(dep) - cur.minutes;
            if (diff < 0) diff += 1440;
            if (diff < minutesUntilNext) minutesUntilNext = diff;
          });
          if (minutesUntilNext <= 5) spawnPlaneMarker(f, f.route.outPoints);
        }

        if (f._lastMinutes !== null && f.tripsToday < 2 && f.status === 'docked') {
          const prevM = f._lastMinutes, curM = cur.minutes;
          for (const dep of f.schedule.departures) {
            const depM = parseHHMM(dep);
            const crossed = curM >= prevM ? (depM > prevM && depM <= curM) : (depM > prevM || depM <= curM);
            // A curfew at the home airport simply skips that scheduled slot for
            // today — the aircraft stays docked and waits for the next one.
            if (crossed && f.status === 'docked' && f.tripsToday < 2 && canDepartNow(homeEntry.ap, gameDate)) {
              f.status = 'outbound';
              f.leg = 'out';
              f.progressNM = 0;
              f._holdDone = false;
              f._holdRemainHours = undefined;
              // Already sitting on the dot from the 5-minutes-early preview
              // above in the normal case — only spawn fresh if it somehow
              // isn't there yet (e.g. this is the very first tick after
              // publishing a route with a departure time under 5 minutes out).
              if (!f.marker) spawnPlaneMarker(f, f.route.outPoints);
              settleLegAtDeparture(f, type, 'out');
              f._legDepartMs = gameDate.getTime();
              break;
            }
          }
        }
        f._lastMinutes = cur.minutes;
      }
    }

    if (f.status === 'outbound') {
      const total = f.route.outDistanceNM;
      const markers = f.route.outPhaseMarkersNM;
      const moveDt = consumeRunwayHold(f, markers, dtHours);
      f.progressNM = advanceLegProgress(f.progressNM, total, moveDt, markers, type);
      if (f.progressNM >= total) {
        f.progressNM = total;
        f._phase = phaseForLeg(f.route, 'out', f.progressNM, !f._holdDone);
        // Leave the marker parked at the destination during turnaround instead
        // of removing it, so the aircraft stays visible on the ground there.
        if (f.marker) {
          const pos = positionAlongRoute(f.route.outPoints, f.progressNM);
          f.marker.setLatLng(pos.latlng);
        }
        clearPlaneTrail(f);
        // A "field" tier destination refuses arrivals during its curfew — hold
        // the aircraft here (fully arrived, just not yet allowed to land/settle)
        // and re-check on the next tick.
        const destEntry = markerByCode[f.route.destCode];
        if (destEntry && !canArriveNow(destEntry.ap, gameDate)) {
          if (f.marker) refreshPlaneRouteIfActive(f);
          return;
        }
        f.flightsCompleted += 1;
        f.status = 'turnaround';
        f._phase = null;
        f.turnaroundRemainingHours = TURNAROUND_HOURS;
        refreshInfoPanelIfHome(f.homeCode);
        refreshPlaneRouteIfActive(f);
      } else if (f.marker) {
        const pos = positionAlongRoute(f.route.outPoints, f.progressNM);
        f.marker.setLatLng(pos.latlng);
        updatePlaneRotation(f, pos.bearing);
        updatePlaneTrail(f, pos);
        f._phase = phaseForLeg(f.route, 'out', f.progressNM, !f._holdDone);
        refreshPlaneRouteIfActive(f);
        panMapToFollowedPlane(f, pos.latlng);
      }
    } else if (f.status === 'turnaround') {
      if (f.turnaroundRemainingHours > 0) f.turnaroundRemainingHours -= dtHours;
      if (f.turnaroundRemainingHours <= 0) {
        const destEntry = markerByCode[f.route.destCode];
        // The return leg has a scheduled departure time (chosen while drawing
        // the route, and never earlier than the outbound flight's estimated
        // arrival) — the aircraft waits at the destination, once minimum
        // turnaround is done, until the local clock there reaches it.
        if (destEntry && f.schedule && f.schedule.returnDeparture) {
          const cur = localClockReading(gameDate, destEntry.ap.tz);
          const targetM = parseHHMM(f.schedule.returnDeparture);
          if (cur.minutes < targetM) return;
        }
        // The destination airport's own curfew blocks departures from there too.
        if (destEntry && !canDepartNow(destEntry.ap, gameDate)) {
          return; // still grounded at destination, waiting for curfew to lift
        }
        f.status = 'inbound';
        f.leg = 'in';
        f.progressNM = 0;
        f._holdDone = false;
        f._holdRemainHours = undefined;
        spawnPlaneMarker(f, f.route.inPoints);
        settleLegAtDeparture(f, type, 'in');
        f._legDepartMs = gameDate.getTime();
      }
    } else if (f.status === 'inbound') {
      const total = f.route.inDistanceNM;
      const markersIn = f.route.inPhaseMarkersNM;
      const moveDtIn = consumeRunwayHold(f, markersIn, dtHours);
      f.progressNM = advanceLegProgress(f.progressNM, total, moveDtIn, markersIn, type);
      if (f.progressNM >= total) {
        f.progressNM = total;
        // A "field" tier home airport also refuses arrivals during its curfew.
        const homeEntry2 = markerByCode[f.homeCode];
        if (homeEntry2 && !canArriveNow(homeEntry2.ap, gameDate)) {
          if (f.marker) {
            const pos = positionAlongRoute(f.route.inPoints, f.progressNM);
            f.marker.setLatLng(pos.latlng);
          }
          return;
        }
        clearPlaneRouteIfFor(f.uid);
        clearPlaneTrail(f);
        if (f.marker) { map.removeLayer(f.marker); f.marker = null; }
        if (typeof followedPlaneUid !== 'undefined' && followedPlaneUid === f.uid) followedPlaneUid = null;
        f.flightsCompleted += 1;
        f.tripsToday += 1;
        f.status = 'docked';
        f.leg = null;
        f._phase = null;
        f.progressNM = 0;
        saveGameState();
        refreshInfoPanelIfHome(f.homeCode);
      } else if (f.marker) {
        const pos = positionAlongRoute(f.route.inPoints, f.progressNM);
        f.marker.setLatLng(pos.latlng);
        updatePlaneRotation(f, pos.bearing);
        updatePlaneTrail(f, pos);
        f._phase = phaseForLeg(f.route, 'in', f.progressNM, !f._holdDone);
        refreshPlaneRouteIfActive(f);
        panMapToFollowedPlane(f, pos.latlng);
      }
    }
  });
}

function cancelAircraftRoute(uid, ap, marker) {
  const f = fleet.find(x => x.uid === uid);
  if (!f) return;
  clearPlaneRouteIfFor(f.uid);
  clearPlaneTrail(f);
  if (f.marker) { map.removeLayer(f.marker); f.marker = null; }
  if (typeof followedPlaneUid !== 'undefined' && followedPlaneUid === f.uid) followedPlaneUid = null;
  f.route = null;
  f.tickets = null;
  f.schedule = null;
  f.leg = null;
  f.status = 'storage';
  f.progressNM = 0;
  f.tripsToday = 0;
  f._lastDayKey = null;
  f._lastMinutes = null;
  saveGameState();
  const entry = markerByCode[ap.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
}
/* ---------------- Service system (twice-monthly, 10th & 25th) ---------------- */
function isServiceOverdue(f) {
  return f.status === 'grounded';
}

function serviceDayKeyFor(date) {
  const day = date.getDate();
  if (day !== 10 && day !== 25) return null;
  return `${date.getFullYear()}-${date.getMonth()}-${day}`;
}

function serviceAircraftNow(uid, ap, marker) {
  const f = fleet.find(x => x.uid === uid);
  if (!f) return;
  const type = getAircraftType(f.typeId);
  if (playerMoney < type.serviceCost) return;
  playerMoney -= type.serviceCost;
  f.status = f.route ? 'docked' : 'storage';
  updateMoneyDisplay();
  saveGameState();
  const entry = markerByCode[ap.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
}

function runScheduledService(gameDate) {
  const key = serviceDayKeyFor(gameDate);
  if (!key || key === lastServiceDayKey) return;
  lastServiceDayKey = key;

  let anyChange = false;
  fleet.forEach(f => {
    const type = getAircraftType(f.typeId);
    if (playerMoney >= type.serviceCost) {
      playerMoney -= type.serviceCost;
      f.lastServiceKey = key;
      if (f.status === 'grounded') f.status = f.route ? 'docked' : 'storage';
      anyChange = true;
    } else {
      // Can't afford the scheduled service — ground the aircraft until it's paid manually.
      if ((f.status === 'outbound' || f.status === 'inbound' || f.status === 'turnaround') && f.marker) {
        clearPlaneRouteIfFor(f.uid);
        clearPlaneTrail(f);
        map.removeLayer(f.marker); f.marker = null;
        if (typeof followedPlaneUid !== 'undefined' && followedPlaneUid === f.uid) followedPlaneUid = null;
      }
      f.status = 'grounded';
      anyChange = true;
    }
  });

  if (anyChange) {
    updateMoneyDisplay();
    saveGameState();
    if (selectedAirportForClock && infoPanel.classList.contains('visible')) {
      const entry = markerByCode[selectedAirportForClock.iata];
      if (entry) selectAirport(entry.ap, entry.marker);
    }
  }
}

