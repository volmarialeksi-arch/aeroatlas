/* ================================================================
   Airport pin markers: icon builder, settings-driven scaling,
   the 'market value' estimator, and the budget-filter slider
   that lives on the main map's Buy New Airport panel.
   ================================================================ */
/* ---------------- Pin icon (Google-pin shape + plane) ---------------- */
function pinSVG() {
  return `
  <svg class="pin-wrap" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1C8.72 1 2 7.72 2 16c0 11 15 28 15 28s15-17 15-28C32 7.72 25.28 1 17 1Z"
      class="pin-body" fill="#f2b33d" stroke="#0a111d" stroke-width="1.5"/>
    <circle cx="17" cy="16.5" r="11.5" fill="#101c30"/>
    <g transform="translate(17,16.5) rotate(45)">
      <path d="M0,-8 L2,-3 L8,0 L2,1.5 L1.2,7 L0,9 L-1.2,7 L-2,1.5 L-8,0 L-2,-3 Z"
        fill="#f2b33d"/>
    </g>
  </svg>`;
}

/* ---------------- Settings: marker/plane size + theme ---------------- */
let airportMarkerScale = 1;   // 1 = 100% (default 34x46 pin)
let planeMarkerScale = 1;     // 1 = 100% (default 26x26 icon)

/* The pin's visual tip (the point that should sit exactly on the airport's
   lat/lng) is at y=44 within the SVG's 34x46 viewBox, not at the very
   bottom edge (y=46). Anchoring at the full height caused the pin to visibly
   drift up/down as the size slider changed, because the 2px gap between the
   tip and the bottom edge scales with the icon and was never accounted for.
   Anchoring at the tip's true proportional position keeps it pinned to the
   airport's location at every scale. */
const PIN_BASE_W = 34, PIN_BASE_H = 46, PIN_TIP_Y = 44;

function makeIcon() {
  const w = Math.round(PIN_BASE_W * airportMarkerScale);
  const h = Math.round(PIN_BASE_H * airportMarkerScale);
  const tipY = Math.round(PIN_TIP_Y * airportMarkerScale);
  return L.divIcon({
    className: 'pin-marker',
    html: pinSVG(),
    iconSize: [w, h],
    iconAnchor: [Math.round(w / 2), tipY],
  });
}

/* Rebuilds every airport pin + in-flight plane icon at the current scale.
   Called on load and whenever the settings sliders change. */
function refreshAllMarkerIcons() {
  Object.values(markerByCode).forEach(entry => {
    const wasActive = entry.marker.getElement() && entry.marker.getElement().classList.contains('active');
    const wasOwned = entry.marker.getElement() && entry.marker.getElement().classList.contains('owned');
    entry.marker.setIcon(makeIcon());
    const el = entry.marker.getElement();
    if (el) {
      if (wasActive) el.classList.add('active');
      if (wasOwned) el.classList.add('owned');
    }
  });
  fleet.forEach(f => {
    if (f.marker) refreshPlaneMarkerIcon(f);
  });
}

/* ---------------- Derived "market value" for the budget slider ---------------- */
/* Airports with an explicit purchase price use it directly. The rest get a
   game-y estimated value derived from traffic or footprint data so every
   airport on the map can be gated by the budget slider. */
function computeFilterPrice(ap) {
  if (ap.price) return ap.price;

  if (ap.passengers) {
    const m = parseFloat(ap.passengers.replace(/[~,]/g, '').replace(/M/i, '').trim());
    if (!isNaN(m)) return clampPrice(m * 10000000);
  }

  if (ap.area) {
    const km2 = parseFloat(ap.area.replace(/[~,]/g, '').replace(/km²/i, '').trim());
    if (!isNaN(km2)) return clampPrice(km2 * 3000000);
  }

  return 500000000; // flat estimate for major hubs without traffic/area data on file
}

function clampPrice(v) {
  return Math.min(2000000000, Math.max(3000000, Math.round(v)));
}

/* ---------------- Markers ---------------- */
const markerByCode = {};
let activeMarkerEl = null;

AIRPORTS.forEach(ap => {
  ap.filterPrice = computeFilterPrice(ap);
  const marker = L.marker([ap.lat, ap.lon], { icon: makeIcon() }).addTo(map);
  marker.on('click', () => handleAirportMarkerClick(ap, marker));
  markerByCode[ap.iata] = { ap, marker };
});

/* ---------------- Budget slider (lives on the purchase map — see below) ---------------- */
const budgetSlider = document.getElementById('budgetSlider');
const budgetValueEl = document.getElementById('budgetValue');

function formatBudget(n) {
  if (n >= 1000000000) return `$${(n / 1000000000).toFixed(2)}B`;
  if (n <= 0) return '$0';
  return `$${(n / 1000000).toFixed(0)}M`;
}

/* Filters the main map's airport pins by purchase price. Only applied while
   the "Buy New Airport" panel is open; resets to show everything again once
   the panel is closed. */
function applyBudgetFilter() {
  const threshold = Number(budgetSlider.value);
  budgetValueEl.textContent = formatBudget(threshold);
  const pct = (threshold / 2000000000) * 100;
  budgetSlider.style.setProperty('--fill', pct + '%');

  Object.values(markerByCode).forEach(({ ap, marker }) => {
    const el = marker.getElement();
    if (!el) return;
    const visible = threshold > 0 && ap.filterPrice <= threshold;
    el.classList.toggle('price-hidden', !visible);
  });
}

function clearBudgetFilter() {
  Object.values(markerByCode).forEach(({ marker }) => {
    const el = marker.getElement();
    if (el) el.classList.remove('price-hidden');
  });
}

budgetSlider.addEventListener('input', applyBudgetFilter);

