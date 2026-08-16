/* ================================================================
   Fleet state: the array of owned aircraft and small helpers
   for looking up / minting aircraft records. Populated at boot
   by save.js's restoreGameState(), then mutated by shop.js
   (purchases), routes.js (assigning routes), fleet-tick.js
   (flights) and upgrade/service flows.
   ================================================================ */
/* ---------------- Fleet state ---------------- */
let fleet = []; // { uid, typeId, homeCode, status: 'storage'|'flying'|'grounded', route, progressNM, direction, flightsCompleted, lastServiceKey, marker }
let fleetUidCounter = 0;
let lastServiceDayKey = null; // guards against double-charging service on the same in-game day

function newFleetUid() {
  fleetUidCounter += 1;
  return 'ac' + Date.now().toString(36) + fleetUidCounter;
}

function aircraftAtHome(code) {
  return fleet.filter(f => f.homeCode === code);
}

