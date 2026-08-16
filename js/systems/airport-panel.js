/* ================================================================
   Airport info panel + "My Airport" (home base) panel: rendering,
   airport-local-time tracking, and airport purchase flow.
   ================================================================ */
/* ---------------- Info panel ---------------- */
const infoPanel = document.getElementById('infoPanel');
const infoBody = document.getElementById('infoBody');
const infoClose = document.getElementById('infoClose');

function tierInfoHTML(ap) {
  const tier = tierOf(ap);
  if (!tier) return '';
  const arrivalNote = tier.blocksArrivals ? ' No arrivals either during this window.' : ' Arrivals are fine any time.';
  return `
    <div class="tier-info-row">
      <span class="tier-badge">${tier.label}</span><br>
      Up to <b>${tier.maxAircraft}</b> aircraft based here · up to <b>${tier.maxFlights}</b> flights/day<br>
      No departures <b>${formatClock(tier.curfewStart)}–${formatClock(tier.curfewEnd)}</b> local time.${arrivalNote}
    </div>
  `;
}

function buySectionHTML(ap) {
  if (!ap.purchasable) return '';

  if (ownedAirports.has(ap.iata)) {
    return `
      <div class="buy-section">
        <div class="owned-badge">✓ Owned</div>
        ${tierInfoHTML(ap)}
      </div>
    `;
  }

  return `
    <div class="buy-section">
      <div class="buy-price-row">
        <span class="buy-price-label">Price</span>
        <span class="buy-price-value">${formatMoney(ap.price)}</span>
      </div>
      <button class="buy-btn" ${playerMoney < ap.price ? 'disabled' : ''}>
        ${playerMoney < ap.price ? 'Insufficient funds' : `Buy airport for ${formatMoney(ap.price)}`}
      </button>
      <div class="buy-error"></div>
      ${tierInfoHTML(ap)}
    </div>
  `;
}

/* ---------------- "My Airport" shop + storage panel content ---------------- */
const PHASE_LABELS = {
  TAXI_OUT: 'Taxiing to runway',
  RUNWAY_HOLD: 'Holding short of runway',
  TAKEOFF_ROLL: 'Takeoff roll',
  CRUISE: 'Cruise',
  APPROACH: 'Approach',
  LANDING: 'Landing',
  ROLLOUT: 'Rollout',
  TAXI_TO_GATE: 'Taxiing to gate',
  AT_GATE: 'At gate',
};

function storageBadgeHTML(f) {
  const phaseSuffix = f._phase && PHASE_LABELS[f._phase] ? ` — ${PHASE_LABELS[f._phase]}` : '';
  if (f.status === 'outbound') return `<span class="storage-badge flying">Outbound${phaseSuffix}</span>`;
  if (f.status === 'inbound') return `<span class="storage-badge flying">Inbound${phaseSuffix}</span>`;
  if (f.status === 'turnaround') return `<span class="storage-badge flying">At destination</span>`;
  if (f.status === 'grounded') return `<span class="storage-badge grounded">Grounded</span>`;
  if (f.status === 'docked') return `<span class="storage-badge parked">Docked — awaiting departure</span>`;
  return `<span class="storage-badge parked">In storage</span>`;
}

function storageItemHTML(f) {
  const type = getAircraftType(f.typeId);
  const overdue = isServiceOverdue(f);
  let body = '';

  if (!f.route) {
    body = `
      <div class="storage-route-info">No route assigned. Range: ${type.rangeMin}–${type.rangeMax} NM · ${type.seats} seats.</div>
      <div class="storage-actions">
        <button class="route-btn" data-action="create-route" data-uid="${f.uid}">Create route</button>
      </div>
    `;
  } else {
    const r = f.route;
    const t = f.tickets || { out: {}, in: {} };
    const deps = (f.schedule && f.schedule.departures) ? f.schedule.departures.join(', ') : '—';
    const retDep = (f.schedule && f.schedule.returnDeparture) ? f.schedule.returnDeparture : '—';
    body = `
      <div class="storage-route-info">
        Route: <b>${f.homeCode} ⇄ ${r.destCode}</b><br>
        Distance: <b>${r.outDistanceNM.toFixed(0)} NM</b> out (~${formatHoursMinutes(legFlightTimeHoursWithMarkers(r.outDistanceNM, r.outPhaseMarkersNM, type))}) · <b>${r.inDistanceNM.toFixed(0)} NM</b> back (~${formatHoursMinutes(legFlightTimeHoursWithMarkers(r.inDistanceNM, r.inPhaseMarkersNM, type))})<br>
        Fares out — Adult $${t.out.adult} · Child $${t.out.child} · Baby $${t.out.baby} · Bag $${t.out.luggage}<br>
        Fares back — Adult $${t.in.adult} · Child $${t.in.child} · Baby $${t.in.baby} · Bag $${t.in.luggage}<br>
        Departs ${f.homeCode} at: <b>${deps}</b> (round trips today: ${f.tripsToday}/2)<br>
        Departs ${r.destCode} at: <b>${retDep}</b> local (or once turnaround is done, if later)<br>
        Flight legs completed: <b>${f.flightsCompleted}</b>
      </div>
      ${overdue ? `<div class="service-warn">⚠ Service overdue — aircraft grounded until serviced.</div>` : ''}
      <div class="storage-actions">
        ${overdue ? `<button class="route-btn" data-action="service" data-uid="${f.uid}">Service now ($${(type.serviceCost/1000).toFixed(0)}K)</button>` : ''}
        <button class="route-btn danger" data-action="cancel-route" data-uid="${f.uid}">Remove route</button>
      </div>
    `;
  }

  return `
    <div class="storage-item">
      <div class="storage-item-head">
        <span class="storage-item-name">${type.name}</span>
        ${storageBadgeHTML(f)}
      </div>
      ${body}
    </div>
  `;
}

function comfortMeterHTML(ap) {
  const pct = getComfortPct(ap.iata);
  return `
    <div class="storage-section">
      <div class="comfort-row">
        <span class="comfort-label">Comfort level</span>
        <span class="comfort-pct">${pct}%</span>
      </div>
      <div class="comfort-bar"><div class="comfort-bar-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function myAirportExtrasHTML(ap) {
  const homeFleet = aircraftAtHome(ap.iata);
  const tier = tierOf(ap);
  return `
    ${comfortMeterHTML(ap)}
    ${tierInfoHTML(ap)}
    <div class="storage-section">
      <button class="shop-open-btn" id="openShopBtn">🛒 Open Fleet Shop</button>
      <button class="shop-open-btn upgrade-btn" id="openUpgradeBtn">🏗 Upgrade Airport</button>
    </div>
    <div class="storage-section">
      <div class="storage-title">Airport Storage (${homeFleet.length}${tier ? `/${tier.maxAircraft}` : ''})</div>
      ${homeFleet.length ? homeFleet.map(storageItemHTML).join('') : `<div class="storage-empty">No aircraft yet. Buy one from the shop.</div>`}
    </div>
  `;
}

function bindMyAirportExtrasEvents(ap, marker) {
  const shopBtn = document.getElementById('openShopBtn');
  if (shopBtn) shopBtn.addEventListener('click', () => openShop(ap));

  const upgradeBtn = document.getElementById('openUpgradeBtn');
  if (upgradeBtn) upgradeBtn.addEventListener('click', () => openUpgradeShop(ap));

  document.querySelectorAll('#infoBody [data-action]').forEach(btn => {
    const uid = btn.dataset.uid;
    const action = btn.dataset.action;
    btn.addEventListener('click', () => {
      if (action === 'create-route') beginRouteCreation(uid, ap, marker);
      if (action === 'cancel-route') cancelAircraftRoute(uid, ap, marker);
      if (action === 'service') serviceAircraftNow(uid, ap, marker);
    });
  });
}


/* ---------------- "My Airport" panel (top-right) ---------------- */
const myAirportPanel = document.getElementById('myAirportPanel');
const myAirportCodeEl = document.getElementById('myAirportCode');
const myAirportCityEl = document.getElementById('myAirportCity');
const myAirportShowBtn = document.getElementById('myAirportShowBtn');

function updateMyAirportClock(date) {
  if (!myAirportCode) return;
  const entry = markerByCode[myAirportCode];
  if (!entry) return;
  const timeEl = document.getElementById('myAirportTime');
  const zoneEl = document.getElementById('myAirportZone');
  if (!timeEl) return;
  try {
    timeEl.textContent = airportTimeFormatter(entry.ap.tz).format(date);
    if (zoneEl) zoneEl.textContent = airportZoneAbbrev(entry.ap.tz, date);
  } catch (e) {
    timeEl.textContent = '—';
    if (zoneEl) zoneEl.textContent = '';
  }
}

function updateMyAirportPanel() {
  const entry = myAirportCode ? markerByCode[myAirportCode] : null;
  if (!entry) {
    myAirportPanel.style.display = 'none';
    return;
  }
  myAirportPanel.style.display = 'flex';
  myAirportCodeEl.textContent = entry.ap.iata;
  myAirportCityEl.textContent = `${entry.ap.city}, ${entry.ap.country}`;
  updateMyAirportClock((window.getGameTime && window.getGameTime()) || new Date());
}

myAirportShowBtn.addEventListener('click', () => {
  const entry = myAirportCode ? markerByCode[myAirportCode] : null;
  if (entry) selectAirport(entry.ap, entry.marker);
});

function purchaseAirport(ap, marker, onDone, panelBody) {
  const body = panelBody || infoBody;
  if (ownedAirports.has(ap.iata)) return;
  if (playerMoney < ap.price) {
    const errEl = body.querySelector('.buy-error');
    if (errEl) errEl.textContent = "Not enough funds to buy this airport.";
    return;
  }
  playerMoney -= ap.price;
  ownedAirports.add(ap.iata);
  updateMoneyDisplay();

  const mainEntry = markerByCode[ap.iata];
  if (mainEntry) {
    const el = mainEntry.marker.getElement();
    if (el) el.classList.add('owned');
  }

  // The airport you just bought becomes "your airport" — its local time
  // is now tracked in the top-right panel.
  myAirportCode = ap.iata;
  updateMyAirportPanel();

  // First-ever purchase is the moment the game is considered "started"
  // (see js/ui/main-menu.js) — unlocks the main menu's Play/Shop buttons
  // and clears the forced airport-purchase flow.
  if (!gameStarted) {
    gameStarted = true;
    if (typeof window.onGameStarted === 'function') window.onGameStarted();
  }

  saveGameState();

  if (onDone) onDone();
  else selectAirport(ap, marker); // default: re-render the main map's panel
}


/* ---------------- Airport local time (timezone-aware) ---------------- */
let selectedAirportForClock = null;

function airportTimeFormatter(tz) {
  // Same locale-driven 12h/24h behavior as the main game clock, but pinned
  // to the airport's own IANA timezone so DST is handled automatically.
  return new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  });
}

function airportZoneAbbrev(tz, date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    }).formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch (e) {
    return '';
  }
}

function updateInfoLocalTime(date) {
  if (!selectedAirportForClock) return;
  const timeEl = document.getElementById('infoLocalTime');
  const zoneEl = document.getElementById('infoLocalZone');
  if (!timeEl) return;
  const tz = selectedAirportForClock.tz;
  try {
    timeEl.textContent = airportTimeFormatter(tz).format(date);
    if (zoneEl) zoneEl.textContent = airportZoneAbbrev(tz, date);
  } catch (e) {
    timeEl.textContent = '—';
    if (zoneEl) zoneEl.textContent = '';
  }
}

window.onGameTimeTick = function(date) {
  updateInfoLocalTime(date);
  updateMyAirportClock(date);
  updateFleetFlights(date);
  runScheduledService(date);
};

/* Called after a leg settles (economy.js's settleLegAtDeparture) or a
   flight completes (fleet-tick.js) so the info panel behind the scenes
   stays live if it happens to be showing this aircraft's home airport. */
function refreshInfoPanelIfHome(homeCode) {
  if (selectedAirportForClock && selectedAirportForClock.iata === homeCode && infoPanel.classList.contains('visible')) {
    const entry = markerByCode[homeCode];
    if (entry) selectAirport(entry.ap, entry.marker);
  }
}

function selectAirport(ap, marker) {
  if (typeof closeBuyPanel === 'function') closeBuyPanel();
  if (activeMarkerEl) activeMarkerEl.classList.remove('active');
  const el = marker.getElement();
  if (el) {
    el.classList.add('active');
    activeMarkerEl = el;
  }

  infoBody.innerHTML = `
    <div class="code-row">
      <div class="code-chip">
        <span class="code-tag">IATA</span>${ap.iata}
      </div>
      <div class="code-chip icao">
        <span class="code-tag">ICAO</span>${ap.icao}
      </div>
    </div>
    <h3 class="airport-name">${ap.name}</h3>
    <div class="airport-loc">${ap.city}, ${ap.country}</div>
    <div class="local-time-row">
      <span class="local-time-label">Local time</span>
      <span class="local-time-value"><span id="infoLocalTime">--:--</span> <span class="local-time-zone" id="infoLocalZone"></span></span>
    </div>
    <div class="info-grid">
      <div>
        <div class="info-field-label">Elevation</div>
        <div class="info-field-value">${ap.elevation}</div>
      </div>
      <div>
        <div class="info-field-label">Runways</div>
        <div class="info-field-value">${ap.runways}</div>
      </div>
      <div>
        <div class="info-field-label">Opened</div>
        <div class="info-field-value">${ap.opened}</div>
      </div>
      <div>
        <div class="info-field-label">Land area</div>
        <div class="info-field-value">${ap.area || '—'}</div>
      </div>
      <div>
        <div class="info-field-label">Passengers/yr</div>
        <div class="info-field-value">${ap.passengers || '—'}</div>
      </div>
      <div style="grid-column: 1 / -1;">
        <div class="info-field-label">Coordinates</div>
        <div class="info-field-value">${ap.lat.toFixed(2)}, ${ap.lon.toFixed(2)}</div>
      </div>
    </div>
    ${buySectionHTML(ap)}
    ${ap.iata === myAirportCode ? myAirportExtrasHTML(ap) : ''}
  `;
  infoPanel.classList.add('visible');

  selectedAirportForClock = ap;
  updateInfoLocalTime((window.getGameTime && window.getGameTime()) || new Date());

  const buyBtn = infoBody.querySelector('.buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => purchaseAirport(ap, marker));
  }

  if (ap.iata === myAirportCode) {
    bindMyAirportExtrasEvents(ap, marker);
  }

  map.flyTo([ap.lat, ap.lon], Math.max(map.getZoom(), 5), { duration: 0.6 });
}

infoClose.addEventListener('click', () => {
  infoPanel.classList.remove('visible');
  if (activeMarkerEl) activeMarkerEl.classList.remove('active');
  activeMarkerEl = null;
  selectedAirportForClock = null;
});
