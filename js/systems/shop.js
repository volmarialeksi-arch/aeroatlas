/* ================================================================
   Fleet Shop modal — buying new aircraft for the home airport.
   ================================================================ */
/* ---------------- Shop modal ---------------- */
const shopOverlay = document.getElementById('shopOverlay');
const shopBody = document.getElementById('shopBody');
const shopSub = document.getElementById('shopSub');
const shopClose = document.getElementById('shopClose');
let shopAirport = null;

function aircraftCardHTML(type) {
  const affordable = playerMoney >= type.price;
  return `
    <div class="aircraft-card">
      <div class="aircraft-thumb">${planeIconMarkup('', type.id)}</div>
      <div class="aircraft-details">
        <div class="aircraft-name">${type.name}</div>
        <div class="aircraft-specs">
          Range: ${type.rangeMin}–${type.rangeMax} NM · ${type.seats} seats<br>
          Service: $${(type.serviceCost/1000).toFixed(0)}K · twice monthly (10th &amp; 25th)
        </div>
        <div class="aircraft-price">${formatMoney(type.price)}</div>
        <button class="aircraft-buy-btn" data-type="${type.id}" ${affordable ? '' : 'disabled'}>
          ${affordable ? 'Buy aircraft' : 'Insufficient funds'}
        </button>
      </div>
    </div>
  `;
}

const shopErrorEl = document.getElementById('shopError');
function showShopError(msg) {
  if (!shopErrorEl) return;
  shopErrorEl.textContent = msg;
  shopErrorEl.classList.add('visible');
}
function clearShopError() {
  if (!shopErrorEl) return;
  shopErrorEl.textContent = '';
  shopErrorEl.classList.remove('visible');
}

function openShop(ap) {
  shopAirport = ap;
  clearShopError();
  const tier = tierOf(ap);
  if (tier) {
    const homeCount = aircraftAtHome(ap.iata).length;
    shopSub.textContent = `${ap.iata} — ${ap.city} · ${tier.label} airport · ${homeCount}/${tier.maxAircraft} aircraft based`;
  } else {
    shopSub.textContent = `${ap.iata} — ${ap.city}`;
  }
  renderShopBody();
  shopOverlay.classList.add('visible');
}

function renderShopBody() {
  shopBody.innerHTML = AIRCRAFT_CATALOG.map(aircraftCardHTML).join('');
  shopBody.querySelectorAll('.aircraft-buy-btn').forEach(btn => {
    btn.addEventListener('click', () => buyAircraft(btn.dataset.type));
  });
}

function closeShop() {
  shopOverlay.classList.remove('visible');
  shopAirport = null;
}
shopClose.addEventListener('click', closeShop);
shopOverlay.addEventListener('click', (e) => { if (e.target === shopOverlay) closeShop(); });

function buyAircraft(typeId) {
  if (!shopAirport) return;
  const type = getAircraftType(typeId);
  if (!type) return;
  if (playerMoney < type.price) return;

  const tier = tierOf(shopAirport);
  if (tier && aircraftAtHome(shopAirport.iata).length >= tier.maxAircraft) {
    showShopError(`${shopAirport.iata} is a ${tier.label} airport — it can only base ${tier.maxAircraft} aircraft at once.`);
    return;
  }
  clearShopError();

  playerMoney -= type.price;
  fleet.push({
    uid: newFleetUid(),
    typeId,
    homeCode: shopAirport.iata,
    status: 'storage', // 'storage' | 'docked' | 'outbound' | 'turnaround' | 'inbound' | 'grounded'
    route: null,       // { destCode, outPoints, inPoints, outDistanceNM, inDistanceNM,
                       //   departureRunwayId, arrivalRunwayId, arrivalRunwayStripId,
                       //   arrivalLandingDirection } — see js/systems/tickets.js publish handler
    tickets: null,     // { out: {adult,child,baby,luggage}, in: {...} }
    schedule: null,    // { departures: ['08:00', '16:00'] } — local time at home airport
    leg: null,         // 'out' | 'in' | null
    progressNM: 0,
    turnaroundRemainingHours: 0,
    tripsToday: 0,
    flightsCompleted: 0,
    lastServiceKey: null,
    _lastDayKey: null,
    _lastMinutes: null,
    marker: null,
  });

  updateMoneyDisplay();
  renderShopBody();
  if (tier) {
    const homeCount = aircraftAtHome(shopAirport.iata).length;
    shopSub.textContent = `${shopAirport.iata} — ${shopAirport.city} · ${tier.label} airport · ${homeCount}/${tier.maxAircraft} aircraft based`;
  }
  saveGameState();

  // Refresh the airport info panel behind the shop to show the new storage entry.
  const entry = markerByCode[shopAirport.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
}

