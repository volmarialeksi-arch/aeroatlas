/* ================================================================
   Airport tiers — purchase gating, fleet caps, and curfews.
   ================================================================ */
/* ---------------- Airport tiers ----------------
   Every airport with a `tier` field (set on the AIRPORTS entries above) is
   gated by these rules: purchase price, how many aircraft can be homed
   there at once, and a nightly curfew window (local time at that airport)
   during which aircraft cannot depart — and, for the small "field" tier
   only, cannot arrive either. Airports with no `tier` are unrestricted
   (legacy behavior: any fleet size, no curfew). Curfew windows are given
   in minutes-since-midnight and never cross midnight. */
const AIRPORT_TIERS = {
  field:  { label: 'Airfield',   maxAircraft: 15,  maxFlights: 30,  curfewStart: 60,  curfewEnd: 360, blocksArrivals: true  }, // 01:00–06:00, no departures or arrivals
  normal: { label: 'Normal',     maxAircraft: 35,  maxFlights: 70,  curfewStart: 120, curfewEnd: 330, blocksArrivals: false }, // 02:00–05:30, departures only
  large:  { label: 'Large',      maxAircraft: 65,  maxFlights: 130, curfewStart: 150, curfewEnd: 270, blocksArrivals: false }, // 02:30–04:30, departures only
  mega:   { label: 'Mega-hub',   maxAircraft: 120, maxFlights: 240, curfewStart: 180, curfewEnd: 210, blocksArrivals: false }, // 03:00–03:30, departures only
};

function tierOf(ap) {
  return (ap && ap.tier) ? AIRPORT_TIERS[ap.tier] : null;
}

function formatClock(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function inCurfewWindow(minutes, tier) {
  if (!tier) return false;
  return minutes >= tier.curfewStart && minutes < tier.curfewEnd;
}

/* Can an aircraft depart from this airport right now (local time)?
   NOTE: localClockReading() lives in js/systems/fleet-tick.js — that's
   fine, it's only ever called here at runtime (never at file-load time),
   long after every script on the page has finished loading. */
function canDepartNow(ap, gameDate) {
  const tier = tierOf(ap);
  if (!tier) return true;
  const reading = localClockReading(gameDate, ap.tz);
  return !inCurfewWindow(reading.minutes, tier);
}

/* Can an aircraft land at this airport right now (local time)? Only the
   smallest "field" tier restricts arrivals; every other tier accepts
   landings around the clock. */
function canArriveNow(ap, gameDate) {
  const tier = tierOf(ap);
  if (!tier || !tier.blocksArrivals) return true;
  const reading = localClockReading(gameDate, ap.tz);
  return !inCurfewWindow(reading.minutes, tier);
}

/* Human-readable curfew summary shown in the route-scheduling modal. */
function curfewHintHTML(homeAp, destAp) {
  const parts = [];
  const homeTier = tierOf(homeAp);
  if (homeTier) {
    parts.push(`${homeAp.iata} (${homeTier.label}) has no departures ${formatClock(homeTier.curfewStart)}–${formatClock(homeTier.curfewEnd)} local time${homeTier.blocksArrivals ? ' — and no arrivals either' : ''}.`);
  }
  const destTier = tierOf(destAp);
  if (destTier) {
    parts.push(`${destAp.iata} (${destTier.label}) has no departures ${formatClock(destTier.curfewStart)}–${formatClock(destTier.curfewEnd)} local time${destTier.blocksArrivals ? ' — and no arrivals either' : ''}.`);
  }
  if (!parts.length) return '';
  return `<div class="ticket-hint">✈ Curfew: ${parts.join(' ')}</div>`;
}

