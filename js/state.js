/* ================================================================
   Core player state: money, owned airports, home airport, and
   reputation. Other modules read/write these globals directly
   (classic-script global scope, same as the original file).
   ================================================================ */
/* ---------------- Money & ownership state ---------------- */
let playerMoney = 400000000;
const ownedAirports = new Set();
let myAirportCode = null; // IATA of the airport shown in the top-right "My Airport" panel
const moneyValueEl = document.getElementById('moneyValue');

/* ---------------- Manually-created port points ----------------
   Per spec: there are NO predefined port points anywhere in this game.
   This starts empty and is filled in at boot from the server (GET
   /api/port-points, see js/systems/port-points-sync.js's
   loadPortPointsFromServer, called from js/main.js) and kept live after
   that via Socket.IO — it is GLOBAL, shared game-world data, not this
   player's own save, so every player ends up with the same points here
   regardless of who placed them. Keyed by IATA -> array of
   { id, stopPoint: [lat, lon] }. js/data/taxi-graph.js's
   groundObjectsForAirport merges these in as real parking positions, so
   every downstream system (route creation's "dots", taxi pathfinding,
   the published route's ground phases) treats a point exactly like real
   ground-truth data — because functionally, once it exists here, it is
   the real data. Additions/removals go through js/systems/port-editor.js,
   which sends them to the server first and only updates this object once
   that's confirmed (see that file and port-points-sync.js). */
const userPortPoints = {};

function formatMoney(n) {
  const millions = n / 1000000;
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(millions).toFixed(1)}M`;
}

function updateMoneyDisplay() {
  moneyValueEl.textContent = formatMoney(playerMoney);
}

/* ---------------- Airline identity + game-started state ----------------
   Set once during the "Start New Game" wizard (js/ui/main-menu.js).
   gameStarted flips true the moment the player buys their first
   airport — that's the point at which the game is considered "begun",
   which gates the main menu's Play/Shop buttons. */
let airlineName = null;
let airlineLogoId = null;
let gameStarted = false;

/* Refreshes every on-page spot that shows the player's airline identity.
   Safe to call before an airline has been named (falls back to the
   app's own branding). */
function updateAirlineDisplays() {
  const subEl = document.getElementById('brandSub');
  if (subEl) subEl.textContent = airlineName ? airlineName : 'World Airport Map';

  const menuSubEl = document.getElementById('mainMenuSub');
  if (menuSubEl) menuSubEl.textContent = airlineName ? airlineName : 'World Airport Map';

  const logoEl = document.getElementById('brandLogo');
  if (logoEl) logoEl.innerHTML = airlineLogoId ? airlineLogoSVG(airlineLogoId, 26) : '';
}

/* ---------------- Reputation state ---------------- */
let playerReputation = 70; // 0–100, starts respectable
const reputationValueEl = document.getElementById('reputationValue');
const reputationLabelEl = document.getElementById('reputationLabel');
const reputationRowEl = document.getElementById('reputationRow');

function reputationTier(rep) {
  if (rep >= 85) return { label: 'Excellent', cls: 'rep-great' };
  if (rep >= 65) return { label: 'Good', cls: 'rep-good' };
  if (rep >= 40) return { label: 'Fair', cls: 'rep-fair' };
  if (rep >= 20) return { label: 'Poor', cls: 'rep-poor' };
  return { label: 'Terrible', cls: 'rep-bad' };
}

function applyReputationDelta(delta) {
  if (!delta) return;
  playerReputation = Math.min(100, Math.max(0, playerReputation + delta));
  updateReputationDisplay();
}

function updateReputationDisplay() {
  if (!reputationValueEl || !reputationLabelEl || !reputationRowEl) return;
  const tier = reputationTier(playerReputation);
  reputationValueEl.textContent = Math.round(playerReputation);
  reputationLabelEl.textContent = tier.label;
  reputationRowEl.classList.remove('rep-great', 'rep-good', 'rep-fair', 'rep-poor', 'rep-bad');
  reputationRowEl.classList.add(tier.cls);
}
updateReputationDisplay();

