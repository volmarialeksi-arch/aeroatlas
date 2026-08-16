/* ================================================================
   Upgrade Airport modal — comfort-improving services purchased
   per airport (lounges, catering, etc. — see data/upgrades-catalog.js).
   ================================================================ */
/* ---------------- Upgrade Airport modal (comfort services) ---------------- */
const upgradeOverlay = document.getElementById('upgradeOverlay');
const upgradeBody = document.getElementById('upgradeBody');
const upgradeSub = document.getElementById('upgradeSub');
const upgradeClose = document.getElementById('upgradeClose');
let upgradeAirport = null;

function upgradeCardHTML(u, ap) {
  const state = getComfortState(ap.iata);
  const owned = !!state.services[u.id];
  const affordable = playerMoney >= u.price;
  return `
    <div class="aircraft-card">
      <div class="aircraft-thumb">${planeIconMarkup()}</div>
      <div class="aircraft-details">
        <div class="aircraft-name">${u.name}</div>
        <div class="aircraft-specs">
          ${u.blurb}<br>
          Comfort: <b style="color:#4caf6d">+${u.comfortPct}%</b>
        </div>
        <div class="aircraft-price">${formatUpgradePrice(u.price)}</div>
        ${owned
          ? `<button class="aircraft-buy-btn" disabled>✓ Installed</button>`
          : `<button class="aircraft-buy-btn" data-upgrade="${u.id}" ${affordable ? '' : 'disabled'}>
              ${affordable ? 'Buy upgrade' : 'Insufficient funds'}
            </button>`
        }
      </div>
    </div>
  `;
}

function renderUpgradeBody() {
  if (!upgradeAirport) return;
  const pct = getComfortPct(upgradeAirport.iata);
  upgradeBody.innerHTML = `
    <div class="storage-section" style="border-top:none; margin-top:0; padding-top:0; margin-bottom:14px;">
      <div class="comfort-row">
        <span class="comfort-label">Current comfort level</span>
        <span class="comfort-pct">${pct}%</span>
      </div>
      <div class="comfort-bar"><div class="comfort-bar-fill" style="width:${pct}%"></div></div>
    </div>
    ${UPGRADE_CATALOG.map(u => upgradeCardHTML(u, upgradeAirport)).join('')}
  `;
  upgradeBody.querySelectorAll('[data-upgrade]').forEach(btn => {
    btn.addEventListener('click', () => buyUpgradeService(btn.dataset.upgrade));
  });
}

function openUpgradeShop(ap) {
  upgradeAirport = ap;
  upgradeSub.textContent = `${ap.iata} — ${ap.city}`;
  renderUpgradeBody();
  upgradeOverlay.classList.add('visible');
}

function closeUpgradeShop() {
  upgradeOverlay.classList.remove('visible');
  upgradeAirport = null;
}
upgradeClose.addEventListener('click', closeUpgradeShop);
upgradeOverlay.addEventListener('click', (e) => { if (e.target === upgradeOverlay) closeUpgradeShop(); });

function buyUpgradeService(upgradeId) {
  if (!upgradeAirport) return;
  const u = getUpgrade(upgradeId);
  if (!u) return;
  const state = getComfortState(upgradeAirport.iata);
  if (state.services[upgradeId]) return;
  if (playerMoney < u.price) return;

  playerMoney -= u.price;
  state.services[upgradeId] = true;

  updateMoneyDisplay();
  renderUpgradeBody();
  saveGameState();

  // Refresh the airport info panel behind the upgrade modal so its comfort
  // meter reflects the purchase immediately.
  const entry = markerByCode[upgradeAirport.iata];
  if (entry) selectAirport(entry.ap, entry.marker);
}

