/* ================================================================
   Main menu: Play / Start New Game / Settings / Shop / How to Play.

   initMainMenu() is called once from main.js, after restoreGameState()
   (so gameStarted/airlineName reflect any existing save) and after
   initSettingsPanel() (so the Settings button can just proxy to the
   settings panel's own open logic).
   ================================================================ */
function initMainMenu() {
  const mainMenuOverlay = document.getElementById('mainMenuOverlay');
  const menuPlayBtn = document.getElementById('menuPlayBtn');
  const menuNewGameBtn = document.getElementById('menuNewGameBtn');
  const menuSettingsBtn = document.getElementById('menuSettingsBtn');
  const menuShopBtn = document.getElementById('menuShopBtn');
  const menuEditPortsBtn = document.getElementById('menuEditPortsBtn');
  const menuHowToBtn = document.getElementById('menuHowToBtn');

  const wizardOverlay = document.getElementById('wizardOverlay');
  const wizardSub = document.getElementById('wizardSub');
  const wizardClose = document.getElementById('wizardClose');
  const wizardStepName = document.getElementById('wizardStepName');
  const wizardStepLogo = document.getElementById('wizardStepLogo');
  const airlineNameInput = document.getElementById('airlineNameInput');
  const wizardNameContinue = document.getElementById('wizardNameContinue');
  const logoGrid = document.getElementById('logoGrid');
  const wizardLogoBack = document.getElementById('wizardLogoBack');
  const wizardLogoContinue = document.getElementById('wizardLogoContinue');

  const howToOverlay = document.getElementById('howToOverlay');
  const howToClose = document.getElementById('howToClose');

  const hintEl = document.querySelector('.hint');
  const originalHintHTML = hintEl ? hintEl.innerHTML : '';
  const forcedHintHTML = `<b>Buy an airport</b> to begin — tap a search result or a pin, then confirm the purchase.`;

  let selectedLogoId = null;

  /* ---------------- Main menu open/close + gating ---------------- */
  function updateMenuButtonStates() {
    menuPlayBtn.disabled = !gameStarted;
    menuPlayBtn.title = gameStarted ? '' : 'Start a new game first';
    menuShopBtn.disabled = !gameStarted;
    menuShopBtn.title = gameStarted ? '' : 'Start a new game first';
    if (menuEditPortsBtn) {
      menuEditPortsBtn.disabled = !gameStarted;
      menuEditPortsBtn.title = gameStarted ? '' : 'Start a new game first';
    }
  }

  function openMainMenu() {
    updateMenuButtonStates();
    mainMenuOverlay.classList.add('visible');
  }

  function closeMainMenu() {
    mainMenuOverlay.classList.remove('visible');
  }

  /* ---------------- Forced first-airport-purchase flow ---------------- */
  function enterForcedPurchaseMode() {
    if (hintEl) hintEl.innerHTML = forcedHintHTML;
    if (typeof openBuyPanel === 'function') openBuyPanel();
  }

  function exitForcedPurchaseMode() {
    if (hintEl) hintEl.innerHTML = originalHintHTML;
  }

  // Called by airport-panel.js's purchaseAirport() the moment the player
  // buys their very first airport — the point at which the game "begins".
  window.onGameStarted = function() {
    exitForcedPurchaseMode();
    updateMenuButtonStates();
  };

  /* ---------------- Start New Game: reset any existing progress ---------------- */
  function resetGameState() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }

    fleet.forEach(f => {
      if (f.marker) { try { map.removeLayer(f.marker); } catch (e) { /* ignore */ } }
    });
    fleet.length = 0;

    ownedAirports.forEach(code => {
      const entry = markerByCode[code];
      if (entry) {
        const el = entry.marker.getElement();
        if (el) el.classList.remove('owned');
      }
    });
    ownedAirports.clear();
    myAirportCode = null;

    Object.keys(airportComfort).forEach(k => delete airportComfort[k]);
    // userPortPoints is now GLOBAL, server-backed data (see
    // js/systems/port-points-sync.js) — resetting *this player's* local
    // game must never delete it for everyone else. It simply isn't
    // touched here any more.

    playerMoney = 400000000;
    playerReputation = 70;
    airlineName = null;
    airlineLogoId = null;
    gameStarted = false;

    updateMoneyDisplay();
    updateReputationDisplay();
    updateMyAirportPanel();
    updateAirlineDisplays();
    exitForcedPurchaseMode();
    if (infoPanel) infoPanel.classList.remove('visible');
    if (activeMarkerEl) { activeMarkerEl.classList.remove('active'); activeMarkerEl = null; }
  }

  /* ---------------- New-game wizard ---------------- */
  function showWizardStep(step) {
    wizardStepName.style.display = step === 'name' ? '' : 'none';
    wizardStepLogo.style.display = step === 'logo' ? '' : 'none';
    wizardSub.textContent = step === 'name'
      ? 'Step 1 of 2 — Airline name'
      : 'Step 2 of 2 — Logo (optional)';
  }

  function renderLogoGrid() {
    const swatches = AIRLINE_LOGOS.map(l => `
      <button type="button" class="logo-swatch${selectedLogoId === l.id ? ' selected' : ''}" data-logo="${l.id}" title="${l.name}">
        ${airlineLogoSVG(l.id, 30)}
      </button>
    `).join('');
    const noneSwatch = `
      <button type="button" class="logo-swatch logo-none${selectedLogoId === null ? ' selected' : ''}" data-logo="">
        No logo
      </button>
    `;
    logoGrid.innerHTML = swatches + noneSwatch;
  }

  function openWizard() {
    airlineNameInput.value = airlineName || '';
    wizardNameContinue.disabled = !airlineNameInput.value.trim();
    selectedLogoId = airlineLogoId || null;
    showWizardStep('name');
    wizardOverlay.classList.add('visible');
    setTimeout(() => airlineNameInput.focus(), 0);
  }

  function closeWizard() {
    wizardOverlay.classList.remove('visible');
  }

  airlineNameInput.addEventListener('input', () => {
    wizardNameContinue.disabled = !airlineNameInput.value.trim();
  });
  airlineNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !wizardNameContinue.disabled) wizardNameContinue.click();
  });

  wizardNameContinue.addEventListener('click', () => {
    if (!airlineNameInput.value.trim()) return;
    renderLogoGrid();
    showWizardStep('logo');
  });

  wizardLogoBack.addEventListener('click', () => showWizardStep('name'));
  wizardClose.addEventListener('click', closeWizard);
  wizardOverlay.addEventListener('click', (e) => {
    if (e.target === wizardOverlay) closeWizard();
  });

  logoGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.logo-swatch');
    if (!btn) return;
    selectedLogoId = btn.dataset.logo || null;
    logoGrid.querySelectorAll('.logo-swatch').forEach(b => b.classList.toggle('selected', b === btn));
  });

  wizardLogoContinue.addEventListener('click', () => {
    const name = airlineNameInput.value.trim();
    if (!name) { showWizardStep('name'); return; }

    airlineName = name;
    airlineLogoId = selectedLogoId;
    updateAirlineDisplays();
    saveGameState();

    closeWizard();
    closeMainMenu();
    enterForcedPurchaseMode();
  });

  /* ---------------- Menu button wiring ---------------- */
  menuPlayBtn.addEventListener('click', () => {
    if (menuPlayBtn.disabled) return;
    closeMainMenu();
  });

  menuNewGameBtn.addEventListener('click', () => {
    if (gameStarted || airlineName) {
      const ok = window.confirm('Starting a new game will erase your current airline, fleet, and progress. Continue?');
      if (!ok) return;
      resetGameState();
    }
    openWizard();
  });

  menuSettingsBtn.addEventListener('click', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.click();
  });

  menuShopBtn.addEventListener('click', () => {
    if (menuShopBtn.disabled) return;
    closeMainMenu();
    const entry = myAirportCode ? markerByCode[myAirportCode] : null;
    if (entry && typeof openShop === 'function') openShop(entry.ap);
  });

  if (menuEditPortsBtn) {
    menuEditPortsBtn.addEventListener('click', () => {
      if (menuEditPortsBtn.disabled) return;
      closeMainMenu();
      if (typeof openPortEditor === 'function') openPortEditor();
    });
  }

  menuHowToBtn.addEventListener('click', () => howToOverlay.classList.add('visible'));
  howToClose.addEventListener('click', () => howToOverlay.classList.remove('visible'));
  howToOverlay.addEventListener('click', (e) => {
    if (e.target === howToOverlay) howToOverlay.classList.remove('visible');
  });

  /* ---------------- Boot ---------------- */
  updateAirlineDisplays();
  openMainMenu();

  // A returning player who quit mid-setup (airline named, no airport yet)
  // should land back in the forced-purchase flow rather than a bare menu.
  if (airlineName && !gameStarted) {
    closeMainMenu();
    enterForcedPurchaseMode();
  }
}
