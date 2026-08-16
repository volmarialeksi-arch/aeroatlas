/* ================================================================
   Airport comfort / upgrade catalog + per-airport comfort state.
   ================================================================ */
/* ---------------- Airport comfort / upgrade catalog ---------------- */
const UPGRADE_CATALOG = [
  { id: 'krakburger', name: 'Krakburger', price: 50000,    comfortPct: 10, blurb: 'Fast-food counter for connecting passengers.' },
  { id: 'tacobills',  name: 'Taco Bills',  price: 100000,   comfortPct: 15, blurb: 'Sit-down Tex-Mex spot in the main terminal.' },
  { id: 'cafeebolu',  name: 'Cafe Ebolu',  price: 25000,    comfortPct: 5,  blurb: 'Coffee & pastries near the gates.' },
  { id: 'carrental',  name: 'Car Rental',  price: 2000000,  comfortPct: 55, blurb: 'Full-service rental desks — the big one for comfort.' },
];

function getUpgrade(id) {
  return UPGRADE_CATALOG.find(u => u.id === id);
}

/* formatMoney() is tuned for the airline economy's usual multi-million
   figures and rounds anything under ~$50k down to "$0.0M" — display
   upgrade prices (as low as $25k) as plain $K/$M amounts instead. */
function formatUpgradePrice(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  return `$${Math.round(n / 1000)}K`;
}

/* Per-airport comfort state, keyed by IATA code:
   { firstFlightBonus: bool, services: { [upgradeId]: bool } } */
const airportComfort = {};

function getComfortState(iata) {
  if (!airportComfort[iata]) {
    airportComfort[iata] = { firstFlightBonus: false, services: {} };
  }
  return airportComfort[iata];
}

/* Comfort level: the 15% first-flight bonus plus whichever services have
   been bought, e.g. all four services (10+15+5+55=85%) plus the first-flight
   bonus (15%) adds up to exactly 100%. */
function getComfortPct(iata) {
  const c = airportComfort[iata];
  if (!c) return 0;
  let pct = c.firstFlightBonus ? 15 : 0;
  UPGRADE_CATALOG.forEach(u => { if (c.services[u.id]) pct += u.comfortPct; });
  return Math.min(100, pct);
}

/* Called whenever a fleet aircraft completes a flight leg. The very first
   completed leg for a given home airport grants a one-time +15% comfort
   bonus there. */
function markFirstFlightIfNeeded(homeCode) {
  const c = getComfortState(homeCode);
  if (c.firstFlightBonus) return false;
  c.firstFlightBonus = true;
  return true;
}

