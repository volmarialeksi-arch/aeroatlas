/* ================================================================
   Ticket & schedule modal — set fares per direction and up to two
   daily departure times, then lock in the route on the aircraft.
   ================================================================ */
/* ---------------- Ticket pricing & schedule modal ---------------- */
const ticketOverlay = document.getElementById('ticketOverlay');
const ticketModalSub = document.getElementById('ticketModalSub');
const ticketModalBody = document.getElementById('ticketModalBody');
const ticketClose = document.getElementById('ticketClose');
const ticketCancelBtn = document.getElementById('ticketCancelBtn');
const ticketSaveBtn = document.getElementById('ticketSaveBtn');

function openTicketModal(draft) {
  const f = fleet.find(x => x.uid === draft.uid);
  const type = f ? getAircraftType(f.typeId) : null;
  const outDist = draft.outBuilt.distanceNM;
  const inDist = draft.inBuilt.distanceNM;
  const outDefault = defaultFareFor(outDist, type);
  const inDefault = defaultFareFor(inDist, type);
  const outTime = formatHoursMinutes(legFlightTimeHours(outDist, type));
  const inTime = formatHoursMinutes(legFlightTimeHours(inDist, type));

  const outKm = outDist * NM_TO_KM;
  const inKm = inDist * NM_TO_KM;

  const airlinePrefix = airlineName ? `${airlineName} — ` : '';
  ticketModalSub.textContent = `${airlinePrefix}${draft.homeAp.city} → ${draft.destAp.city} · ${outDist.toFixed(0)} NM (~${outTime}) out / ${inDist.toFixed(0)} NM (~${inTime}) back`;

  const depRunways = runwaysForAirport(draft.homeAp.iata);
  const arrRunways = runwaysForAirport(draft.destAp.iata);
  const depGate = gatesForAirport(draft.homeAp.iata)[0];
  const arrGate = gatesForAirport(draft.destAp.iata)[0];
  const runwayOptionsHTML = (list, selectedId) => list
    .map(d => `<option value="${d.id}"${d.id === selectedId ? ' selected' : ''}>${d.id} — ${Math.round(d.lengthM)} m</option>`)
    .join('');
  const runwaySelectOrNote = (list, selectId, iata) => list.length
    ? `<select id="${selectId}"><option value="">— select runway —</option>${runwayOptionsHTML(list, selectId === 'rg-dep-runway' ? draft.departureRunwayId : draft.arrivalRunwayId)}</select>`
    : `<div class="ticket-hint" style="margin:0;">No runway data available for ${iata}.</div>`;
  const gateSelectOrNote = (gate, selectId) => gate
    ? `<select id="${selectId}" disabled><option value="${gate.id}">${gate.name}</option></select>`
    : `<div class="ticket-hint" style="margin:0;">No gate data available yet.</div>`;

  ticketModalBody.innerHTML = `
    <div class="ticket-section">
      <div class="ticket-section-title">Runway &amp; gate selection</div>
      <div class="ticket-fare-grid">
        <label>Departure runway — ${draft.homeAp.iata}
          ${runwaySelectOrNote(depRunways, 'rg-dep-runway', draft.homeAp.iata)}
        </label>
        <label>Departure gate — ${draft.homeAp.iata}
          ${gateSelectOrNote(depGate, 'rg-dep-gate')}
        </label>
        <label>Arrival runway — ${draft.destAp.iata}
          ${runwaySelectOrNote(arrRunways, 'rg-arr-runway', draft.destAp.iata)}
        </label>
        <label>Arrival gate — ${draft.destAp.iata}
          ${gateSelectOrNote(arrGate, 'rg-arr-gate')}
        </label>
      </div>
      <div class="ticket-hint" id="rg-preview"></div>
      <div class="ticket-hint" id="rg-error" style="color:var(--alert); display:none;"></div>
    </div>
    <div class="ticket-section">
      <div class="ticket-section-title">Outbound fares — ${draft.homeAp.iata} → ${draft.destAp.iata} · ~${outTime}</div>
      <div class="ticket-fare-grid">
        <label>Adult ($) <input type="number" min="0" id="tf-out-adult" value="${outDefault.adult}"></label>
        <label>Child ($) <input type="number" min="0" id="tf-out-child" value="${outDefault.child}"></label>
        <label>Baby ($) <input type="number" min="0" id="tf-out-baby" value="${outDefault.baby}"></label>
        <label>Checked bag ($) <input type="number" min="0" id="tf-out-luggage" value="${outDefault.luggage}"></label>
        <div class="demand-estimate" id="tf-out-estimate"><span class="demand-text" id="tf-out-estimate-text">—</span><span class="demand-bar"><span class="demand-bar-fill" id="tf-out-estimate-fill"></span></span></div>
      </div>
    </div>
    <div class="ticket-section">
      <div class="ticket-section-title">Return fares — ${draft.destAp.iata} → ${draft.homeAp.iata} · ~${inTime}</div>
      <div class="ticket-fare-grid">
        <label>Adult ($) <input type="number" min="0" id="tf-in-adult" value="${inDefault.adult}"></label>
        <label>Child ($) <input type="number" min="0" id="tf-in-child" value="${inDefault.child}"></label>
        <label>Baby ($) <input type="number" min="0" id="tf-in-baby" value="${inDefault.baby}"></label>
        <label>Checked bag ($) <input type="number" min="0" id="tf-in-luggage" value="${inDefault.luggage}"></label>
        <div class="demand-estimate" id="tf-in-estimate"><span class="demand-text" id="tf-in-estimate-text">—</span><span class="demand-bar"><span class="demand-bar-fill" id="tf-in-estimate-fill"></span></span></div>
      </div>
    </div>
    <div class="ticket-section">
      <div class="ticket-section-title">Departure schedule</div>
      <div class="ticket-schedule-row">
        <label>Outbound departure — ${draft.homeAp.iata} <input type="time" id="tf-dep1" value="${draft.outDeparture || '08:00'}"></label>
      </div>
      <div class="ticket-schedule-row">
        <label><input type="checkbox" id="tf-dep2-enable"> Add 2nd daily outbound departure</label>
        <input type="time" id="tf-dep2" value="16:00" disabled>
      </div>
      <div class="ticket-hint">Return departure — ${draft.destAp.iata} <strong>${draft.retDeparture || '—'}</strong> local time, set while drawing the route (estimated outbound arrival was ${formatClock(Math.round(draft.outArrivalMinutesRaw || 0) % 1440)}).</div>
      <div class="ticket-hint">Max 2 outbound departures per day. The aircraft departs ${draft.homeAp.iata} automatically once the in-game clock reaches each outbound departure time, and departs ${draft.destAp.iata} on the way back once its turnaround is done and the in-game clock reaches the scheduled return departure time (both local). Taxis at 20 km/h, holds 15 seconds before entering the runway, accelerates to takeoff speed, climbs and cruises at its own top speed, then descends and decelerates back down for landing.${type ? ` Capacity: ${type.seats} seats (${type.name}).` : ''}</div>
      ${curfewHintHTML(draft.homeAp, draft.destAp)}
      <div class="ticket-hint">Price it right and the plane sells out. Charge more than the going rate for the distance and bookings — and your airline's reputation — start to slide; $${OVERPRICE_KILL_RANGE}+ over and nobody books at all. Checked bags follow the same rule around $${(type && typeof type.baggageFee === 'number') ? type.baggageFee : GOOD_BAGGAGE_PRICE}.</div>
      <div class="ticket-hint" id="tf-curfew-error" style="color:var(--alert); display:none;"></div>
    </div>
  `;
  const dep2Enable = document.getElementById('tf-dep2-enable');
  const dep2Input = document.getElementById('tf-dep2');
  dep2Enable.addEventListener('change', () => { dep2Input.disabled = !dep2Enable.checked; });

  /* Route preview — purely a readout, doesn't affect anything until
     Publish Route is actually clicked. Also drives the on-map selection
     highlight (js/systems/runway-debug.js) so it's obvious on the map
     which runway is currently picked for each direction. Either select
     may not exist in the DOM at all if that airport has no real runway
     data (see runwaySelectOrNote above) — handled defensively throughout. */
  const rgDepRunwaySel = document.getElementById('rg-dep-runway');
  const rgArrRunwaySel = document.getElementById('rg-arr-runway');
  const rgPreviewEl = document.getElementById('rg-preview');
  const rgErrorEl = document.getElementById('rg-error');
  function refreshRunwayGatePreview() {
    const depRw = rgDepRunwaySel ? (rgDepRunwaySel.value || '— not selected —') : 'no data';
    const arrRw = rgArrRunwaySel ? (rgArrRunwaySel.value || '— not selected —') : 'no data';
    rgPreviewEl.textContent =
      `${draft.homeAp.iata} → Runway ${depRw} → Takeoff → your route (${outDist.toFixed(0)} NM) → ` +
      `Runway ${arrRw} → Landing → ${draft.destAp.iata}`;
    const depOk = !rgDepRunwaySel || rgDepRunwaySel.value;
    const arrOk = !rgArrRunwaySel || rgArrRunwaySel.value;
    if (rgErrorEl.style.display !== 'none' && depOk && arrOk) {
      rgErrorEl.style.display = 'none';
    }
    if (typeof highlightRunwaySelection === 'function') {
      highlightRunwaySelection('dep', draft.homeAp.iata, rgDepRunwaySel ? rgDepRunwaySel.value : '');
      highlightRunwaySelection('arr', draft.destAp.iata, rgArrRunwaySel ? rgArrRunwaySel.value : '', draft.destAp, true, draft.arrivalDot);
    }
    draft.departureRunwayId = (rgDepRunwaySel && rgDepRunwaySel.value) || null;
    draft.arrivalRunwayId = (rgArrRunwaySel && rgArrRunwaySel.value) || null;
    // Keep the full direction objects in sync too (publish reads
    // draft.departureRunway/arrivalRunway indirectly via these same ids —
    // see ticketSaveBtn below — but other code, e.g. a re-opened modal,
    // may read the object form, so update both).
    draft.departureRunway = draft.departureRunwayId ? runwayDirectionById(draft.homeAp.iata, draft.departureRunwayId) : null;
    draft.arrivalRunway = draft.arrivalRunwayId ? runwayDirectionById(draft.destAp.iata, draft.arrivalRunwayId) : null;
  }
  if (rgDepRunwaySel) rgDepRunwaySel.addEventListener('change', refreshRunwayGatePreview);
  if (rgArrRunwaySel) rgArrRunwaySel.addEventListener('change', refreshRunwayGatePreview);
  refreshRunwayGatePreview();

  function refreshEstimate(prefix, km) {
    const adultInput = document.getElementById(`tf-${prefix}-adult`);
    const textEl = document.getElementById(`tf-${prefix}-estimate-text`);
    const fillEl = document.getElementById(`tf-${prefix}-estimate-fill`);
    const wrapEl = document.getElementById(`tf-${prefix}-estimate`);
    if (!adultInput || !textEl || !fillEl || !wrapEl) return;
    const price = Math.max(0, parseFloat(adultInput.value) || 0);
    const load = demandLoadFactor(price, km, type);
    const pct = Math.round(load * 100);
    fillEl.style.width = pct + '%';
    wrapEl.classList.remove('demand-warn', 'demand-bad');
    if (pct === 0) {
      wrapEl.classList.add('demand-bad');
      textEl.textContent = 'Sold out of no one — too expensive, 0% booked';
    } else if (pct < 100) {
      wrapEl.classList.add('demand-warn');
      textEl.textContent = `~${pct}% booked — priced above the going rate`;
    } else {
      textEl.textContent = '~100% booked — sells out at this price';
    }
  }
  ['tf-out-adult', 'tf-in-adult'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      refreshEstimate('out', outKm);
      refreshEstimate('in', inKm);
    });
  });
  refreshEstimate('out', outKm);
  refreshEstimate('in', inKm);

  ticketOverlay.classList.add('visible');
}

function closeTicketModal() {
  ticketOverlay.classList.remove('visible');
  if (typeof clearAllRunwayHighlights === 'function') clearAllRunwayHighlights();
}

function abandonRouteDraftAfterModal() {
  if (!routeDraft) return;
  removeRouteDraftLayers();
  const ap = routeDraft.homeAp, marker = routeDraft.homeMarker;
  routeDraft = null;
  const entry = markerByCode[ap.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
}

ticketCancelBtn.addEventListener('click', () => {
  closeTicketModal();
  abandonRouteDraftAfterModal();
});
ticketClose.addEventListener('click', () => {
  closeTicketModal();
  abandonRouteDraftAfterModal();
});
ticketOverlay.addEventListener('click', (e) => {
  if (e.target === ticketOverlay) { closeTicketModal(); abandonRouteDraftAfterModal(); }
});

ticketSaveBtn.addEventListener('click', () => {
  if (!routeDraft) return;
  const f = fleet.find(x => x.uid === routeDraft.uid);
  if (!f) { closeTicketModal(); abandonRouteDraftAfterModal(); return; }

  const num = (id) => Math.max(0, parseInt(document.getElementById(id).value, 10) || 0);
  const tickets = {
    out: { adult: num('tf-out-adult'), child: num('tf-out-child'), baby: num('tf-out-baby'), luggage: num('tf-out-luggage') },
    in: { adult: num('tf-in-adult'), child: num('tf-in-child'), baby: num('tf-in-baby'), luggage: num('tf-in-luggage') },
  };
  const dep1 = document.getElementById('tf-dep1').value || '08:00';
  const dep2Enabled = document.getElementById('tf-dep2-enable').checked;
  const dep2 = document.getElementById('tf-dep2').value;
  const departures = [dep1];
  if (dep2Enabled && dep2) departures.push(dep2);

  const homeTier = tierOf(routeDraft.homeAp);
  if (homeTier) {
    const blocked = departures.find(d => inCurfewWindow(parseHHMM(d), homeTier));
    if (blocked) {
      const errEl = document.getElementById('tf-curfew-error');
      if (errEl) {
        errEl.textContent = `${routeDraft.homeAp.iata} can't depart at ${blocked} — no departures ${formatClock(homeTier.curfewStart)}–${formatClock(homeTier.curfewEnd)} local time.`;
        errEl.style.display = 'block';
      }
      return;
    }
  }
  const destTier = tierOf(routeDraft.destAp);
  if (destTier && routeDraft.retDeparture && inCurfewWindow(parseHHMM(routeDraft.retDeparture), destTier)) {
    const errEl = document.getElementById('tf-curfew-error');
    if (errEl) {
      errEl.textContent = `${routeDraft.destAp.iata} can't depart at ${routeDraft.retDeparture} — no departures ${formatClock(destTier.curfewStart)}–${formatClock(destTier.curfewEnd)} local time. Go back and pick a different return departure time.`;
      errEl.style.display = 'block';
    }
    return;
  }

  // Runway is chosen by the player, never auto-picked. Require an explicit
  // selection wherever real runway data actually exists for that airport;
  // if an airport has none (6 airports in the ground-data file have no
  // recorded runways), there's nothing to select, so that leg just isn't
  // blocked on it and flies the plain drawn route with no runway splice.
  const depRunwaySel = document.getElementById('rg-dep-runway');
  const arrRunwaySel = document.getElementById('rg-arr-runway');
  const depRunwayId = depRunwaySel ? depRunwaySel.value : '';
  const arrRunwayId = arrRunwaySel ? arrRunwaySel.value : '';
  const rgErrEl = document.getElementById('rg-error');
  const missingSelections = [];
  if (depRunwaySel && !depRunwayId) missingSelections.push(`departure runway (${routeDraft.homeAp.iata})`);
  if (arrRunwaySel && !arrRunwayId) missingSelections.push(`arrival runway (${routeDraft.destAp.iata})`);
  if (missingSelections.length) {
    if (rgErrEl) {
      rgErrEl.textContent = `Select a ${missingSelections.join(' and a ')} before publishing.`;
      rgErrEl.style.display = 'block';
    }
    return;
  }
  const depRunway = depRunwayId ? runwayDirectionById(routeDraft.homeAp.iata, depRunwayId) : null;
  const arrRunway = arrRunwayId ? runwayDirectionById(routeDraft.destAp.iata, arrRunwayId) : null;

  // Each leg's runway/dot picks are now fully independent — the outbound
  // leg uses depRunway/arrRunway (picked while drawing it, adjustable via
  // the dropdowns above), and the return leg uses its OWN separately-
  // picked runways/dot (routeDraft.retDepartureRunway/retArrivalRunway/
  // retArrivalDot — picked while drawing the return leg, see routes.js's
  // beginReturnRoutePicking). Real airports don't necessarily use the
  // same runway to depart as they do to arrive (wind direction changes,
  // etc), so these are deliberately not assumed to mirror each other.
  // The one thing that IS always reused: each airport's dot for whichever
  // direction the aircraft is already sitting there for — home's
  // departureDot is where it's parked before the outbound leg AND where
  // it parks again after the return leg; destination's arrivalDot is
  // where it parks after landing AND where it departs from on the return
  // leg — because that's simply where the aircraft physically is, not a
  // separate choice to make. So:
  //
  //   OUTBOUND leg (home -> destination):
  //     prefix: taxi from the home dot to the departure runway's real
  //             threshold, then a short straight roll down the runway to
  //             the liftoff point (if a departure runway was picked).
  //     suffix: approach/landing/rollout onto the arrival runway AT THE
  //             DESTINATION, then a taxi-in from the rollout point to the
  //             destination's dot — following the real taxiway graph when
  //             OSM taxiway/taxilane/parking data exists for that
  //             airport (js/data/taxi-graph.js), otherwise a straight
  //             line to the dot (never invented geometry — always either
  //             real graph-following waypoints or a straight line between
  //             two real points).
  //   RETURN leg (destination -> home): the same, mirrored, but with its
  //     own runway picks — taxiing out from the destination's dot via
  //     retDepartureRunway, and landing/taxiing in to home's retArrivalDot
  //     via retArrivalRunway.
  //
  // Also records _phaseMarkersNM (cumulative distance at which each named
  // phase begins) so the aircraft's current phase — TAXI_OUT / TAKEOFF_ROLL
  // / CRUISE / APPROACH / LANDING / ROLLOUT / TAXI_TO_GATE / AT_GATE — can
  // be read back out later purely from progress-along-route (see
  // js/systems/fleet-tick.js's phaseForLeg), and so the movement engine
  // (js/core/speed-model.js) knows exactly where to apply taxiway speed
  // (20 km/h) vs runway speed (50 km/h) vs the normal flight speed model.
  function extendWithDeparture(points, runway, dot, iata) {
    const markers = {};
    if (!runway) return { points, markers };
    const prefix = dot
      ? buildGroundTaxiPoints(iata, dot, runway.threshold, 'out', runway)
      : [runway.threshold]; // no dot on record (shouldn't normally happen once a runway was picked) — no taxi-out to model
    markers.taxiOutEnd = pathLengthNM(prefix);
    const liftoffPoint = getRunwayLiftoffPoint(runway);
    const withLiftoff = [...prefix, liftoffPoint];
    markers.liftoff = pathLengthNM(withLiftoff);
    // `points` already starts at runway.threshold (routes.js's
    // outBuilt/inBuilt always begin there once a runway was picked) — drop
    // that duplicate before splicing the rest of the manually-drawn line on.
    const rest = points[0] && points[0][0] === runway.threshold[0] && points[0][1] === runway.threshold[1]
      ? points.slice(1) : points;
    return { points: [...withLiftoff, ...rest], markers };
  }

  function extendWithArrival(points, runway, dot, iata) {
    const markers = {};
    let full = points;
    if (runway) {
      markers.approachStart = pathLengthNM(full);
      const approachPoint = getRunwayApproachPoint(runway);
      const landingPoint = getRunwayLandingPoint(runway);
      const fallbackRolloutEnd = getRunwayRolloutEndPoint(runway, landingPoint);
      const rolloutEndPoint = (typeof resolveRunwayExitPoint === 'function')
        ? resolveRunwayExitPoint(iata, runway, fallbackRolloutEnd, landingPoint)
        : fallbackRolloutEnd;
      full = [...full, approachPoint, landingPoint, rolloutEndPoint];
      markers.landingPoint = pathLengthNM(full.slice(0, -1));
      markers.rolloutEnd = pathLengthNM(full);

      if (dot) {
        const taxiWaypoints = buildGroundTaxiPoints(iata, dot, rolloutEndPoint, 'in', runway);
        markers.taxiStart = markers.rolloutEnd;
        full = [...full, ...taxiWaypoints.slice(1)]; // [0] duplicates rolloutEndPoint, already the last point in `full`
        markers.gateArrival = pathLengthNM(full);
      }
    }
    return { points: full, markers };
  }

  const retDepRunway = routeDraft.retDepartureRunway || null;
  const retArrRunway = routeDraft.retArrivalRunway || null;

  const outDeparted = extendWithDeparture(routeDraft.outBuilt.points, depRunway, routeDraft.departureDot, routeDraft.homeAp.iata);
  const outExtended = extendWithArrival(outDeparted.points, arrRunway, routeDraft.arrivalDot, routeDraft.destAp.iata);
  const outFullPoints = outExtended.points;
  const outFullDistanceNM = pathLengthNM(outFullPoints);
  const outPhaseMarkersNM = { ...outDeparted.markers, ...outExtended.markers };

  const inDeparted = extendWithDeparture(routeDraft.inBuilt.points, retDepRunway, routeDraft.arrivalDot, routeDraft.destAp.iata);
  const inExtended = extendWithArrival(inDeparted.points, retArrRunway, routeDraft.retArrivalDot, routeDraft.homeAp.iata);
  const inFullPoints = inExtended.points;
  const inFullDistanceNM = pathLengthNM(inFullPoints);
  const inPhaseMarkersNM = { ...inDeparted.markers, ...inExtended.markers };

  f.route = {
    destCode: routeDraft.destAp.iata,
    outPoints: outFullPoints,
    inPoints: inFullPoints,
    outDistanceNM: outFullDistanceNM,
    inDistanceNM: inFullDistanceNM,
    outPhaseMarkersNM,
    inPhaseMarkersNM,
    departureRunwayId: depRunway ? depRunway.id : null,
    departureRunwayStripId: depRunway ? depRunway.stripId : null,
    arrivalRunwayId: arrRunway ? arrRunway.id : null,
    arrivalRunwayStripId: arrRunway ? arrRunway.stripId : null, // e.g. "04L/22R"
    arrivalLandingDirection: arrRunway ? arrRunway.id : null,   // e.g. "04L"
    returnDepartureRunwayId: retDepRunway ? retDepRunway.id : null,
    returnArrivalRunwayId: retArrRunway ? retArrRunway.id : null,
    departureDot: routeDraft.departureDot ? { stopPoint: routeDraft.departureDot.stopPoint, real: !!routeDraft.departureDot.real } : null,
    arrivalDot: routeDraft.arrivalDot ? { stopPoint: routeDraft.arrivalDot.stopPoint, real: !!routeDraft.arrivalDot.real } : null,
    returnArrivalDot: routeDraft.retArrivalDot ? { stopPoint: routeDraft.retArrivalDot.stopPoint, real: !!routeDraft.retArrivalDot.real } : null,
  };
  f.tickets = tickets;
  f.schedule = { departures, returnDeparture: routeDraft.retDeparture || null };
  f.status = 'docked';
  f.leg = null;
  f.progressNM = 0;
  f.tripsToday = 0;
  f._lastDayKey = null;
  f._lastMinutes = null;

  closeTicketModal();
  removeRouteDraftLayers();
  const homeAp = routeDraft.homeAp;
  routeDraft = null;
  saveGameState();

  const entry = markerByCode[homeAp.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
});
