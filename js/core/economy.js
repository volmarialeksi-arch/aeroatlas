/* ================================================================
   Ticket & demand pricing model: fare curves, load-factor demand
   simulation, and baggage-fee uptake. Pure math/data — no DOM.
   ================================================================ */
const NM_TO_KM = 1.852;
const GOOD_FARE_KM = [100, 200, 300, 400, 500, 600];
const GOOD_FARE_PRICE = [59, 90, 105, 110, 120, 140];
const OVERPRICE_KILL_RANGE = 60; // $ above the good price at which demand hits zero
const GOOD_BAGGAGE_PRICE = 35;   // at this price, ~half of passengers check a bag

/* Generic piecewise-linear interpolation over an anchored (km -> price)
   table, extrapolated (using the nearest segment's slope) for distances
   outside the table's range, floored at floorMin. */
function interpFareTable(km, xs, ys, floorMin) {
  if (km <= xs[0]) {
    const slope = (ys[1] - ys[0]) / (xs[1] - xs[0]);
    return Math.max(floorMin, ys[0] + slope * (km - xs[0]));
  }
  if (km >= xs[xs.length - 1]) {
    const n = xs.length;
    const slope = (ys[n - 1] - ys[n - 2]) / (xs[n - 1] - xs[n - 2]);
    return Math.max(floorMin, ys[n - 1] + slope * (km - xs[n - 1]));
  }
  for (let i = 0; i < xs.length - 1; i++) {
    if (km >= xs[i] && km <= xs[i + 1]) {
      const t = (km - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + t * (ys[i + 1] - ys[i]);
    }
  }
  return ys[ys.length - 1];
}

/* Piecewise-linear interpolation over the anchored fare table, extrapolated
   (using the nearest segment's slope) for distances outside 100–600 km.
   If the aircraft type carries its own fareTable (e.g. a longer-range jet
   with its own economics), that table is used instead of the generic one. */
function goodAdultFareForKm(km, type) {
  if (type && type.fareTable) {
    return interpFareTable(km, type.fareTable.km, type.fareTable.adult, 20);
  }
  return interpFareTable(km, GOOD_FARE_KM, GOOD_FARE_PRICE, 20);
}
function goodChildFareForKm(km, type) {
  if (type && type.fareTable) {
    return interpFareTable(km, type.fareTable.km, type.fareTable.child, 5);
  }
  return Math.max(5, goodAdultFareForKm(km, type) - 5);
}
function goodBabyFareForKm(km, type) { return Math.max(0, goodAdultFareForKm(km, type) - 20); }

/* Fraction of the plane that fills up (0–1) given the adult fare charged
   against the "good" fare for that distance. At/under the good price the
   flight is always full; $60 or more over it, nobody shows up at all. */
function demandLoadFactor(adultPrice, km, type) {
  const good = goodAdultFareForKm(km, type);
  if (adultPrice <= good) return 1;
  const over = adultPrice - good;
  if (over >= OVERPRICE_KILL_RANGE) return 0;
  return 1 - (over / OVERPRICE_KILL_RANGE);
}

/* Share of passengers who check a bag (0–1) given the checked-bag fee.
   ~50% at the "good" baggage price (aircraft-specific if set, else $35);
   rises as it gets cheaper, falls to 0% by $60 over. */
function baggageUptake(bagPrice, type) {
  const goodBag = (type && typeof type.baggageFee === 'number') ? type.baggageFee : GOOD_BAGGAGE_PRICE;
  if (bagPrice <= goodBag) {
    const t = goodBag > 0 ? Math.min(1, (goodBag - bagPrice) / goodBag) : 0;
    return Math.min(0.95, 0.5 + 0.42 * t);
  }
  const over = bagPrice - goodBag;
  if (over >= OVERPRICE_KILL_RANGE) return 0;
  return 0.5 * (1 - over / OVERPRICE_KILL_RANGE);
}

/* Sensible default fares scaled by distance — fully editable before saving. */
function defaultFareFor(nm, type) {
  const km = nm * NM_TO_KM;
  const adult = Math.round(goodAdultFareForKm(km, type));
  const child = Math.round(goodChildFareForKm(km, type));
  const baby = Math.round(goodBabyFareForKm(km, type));
  const luggage = (type && typeof type.baggageFee === 'number') ? type.baggageFee : GOOD_BAGGAGE_PRICE;
  return { adult, child, baby, luggage };
}

/* Estimate the outcome of one completed leg from the ticket prices set for
   that direction. Adult fare vs. the "good" fare for the distance sets the
   load factor (full at/under the good price, empty $60+ over it); the same
   shape governs checked-bag uptake around its own $35 reference. Passenger
   mix is capped at 0–15 children and 0–4 infants per flight, everyone else
   flies as an adult. Pricing above the going rate also drags reputation
   down; pricing at or under it builds reputation back up. */
function simulateLegRevenue(f, type, leg) {
  const price = leg === 'out' ? f.tickets.out : f.tickets.in;
  const distNM = leg === 'out' ? f.route.outDistanceNM : f.route.inDistanceNM;
  const km = distNM * NM_TO_KM;
  const seats = type.seats || 77;

  const loadFactor = demandLoadFactor(price.adult, km, type);
  // A little organic wobble, but a sold-out or dead-on-arrival route stays that way.
  const wobble = (loadFactor > 0 && loadFactor < 1) ? (Math.random() - 0.5) * 0.08 : 0;
  const effectiveLoad = Math.min(1, Math.max(0, loadFactor + wobble));

  const totalPax = Math.min(seats, Math.round(seats * effectiveLoad));
  const babies = Math.min(4, Math.round(totalPax * 0.05));
  const children = Math.min(15, Math.round(totalPax * 0.16));
  const adults = Math.max(0, totalPax - babies - children);

  const bagShare = baggageUptake(price.luggage, type);
  const luggagePax = Math.round(totalPax * bagShare);

  const revenue = adults * price.adult + children * price.child + babies * price.baby + luggagePax * price.luggage;

  const good = goodAdultFareForKm(km, type);
  let repDelta;
  if (price.adult <= good) {
    repDelta = 0.15;
  } else {
    const severity = Math.min(1, (price.adult - good) / OVERPRICE_KILL_RANGE);
    repDelta = -1.5 * severity;
  }

  return { revenue, repDelta, loadPct: Math.round(effectiveLoad * 100), totalPax };
}

/* Fuel burned for a leg, in $. Aircraft with their own fuelTable (km -> $,
   e.g. jets whose burn rate isn't a flat $/NM) are interpolated the same way
   fares are; everything else falls back to a flat $/NM rate. */
function fuelCostForKm(km, type) {
  if (type && type.fuelTable) {
    return interpFareTable(km, type.fuelTable.km, type.fuelTable.cost, 0);
  }
  return null;
}

/* Settle the money side of one leg at the moment the aircraft takes off:
   ticket revenue comes in from the passengers now on board, and fuel cost
   for the leg (proportional to distance) is deducted at the same time. */
function settleLegAtDeparture(f, type, leg) {
  const distNM = leg === 'out' ? f.route.outDistanceNM : f.route.inDistanceNM;
  const result = simulateLegRevenue(f, type, leg);
  const tableFuel = fuelCostForKm(distNM * NM_TO_KM, type);
  const fuelCost = (tableFuel !== null) ? tableFuel : (type.fuelCostPerNM || 0) * distNM;
  playerMoney += result.revenue - fuelCost;
  applyReputationDelta(result.repDelta);
  updateMoneyDisplay();
  markFirstFlightIfNeeded(f.homeCode);
  refreshInfoPanelIfHome(f.homeCode);
  return result;
}
