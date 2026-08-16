/* ================================================================
   Settings panel: theme toggle + marker/plane size sliders,
   persisted via save.js's saveGameState()/loadGameState().

   IMPORTANT: initSettingsPanel() is NOT auto-invoked here. The
   original ran this as a self-executing IIFE that (via
   refreshAllMarkerIcons()) touched every already-spawned plane
   marker, which only works correctly if restoreGameState() has
   already populated the fleet. main.js calls restoreGameState()
   first, then initSettingsPanel(), preserving that ordering.
   ================================================================ */
/* ---------------- Settings panel: theme + marker/plane sizes ---------------- */
function initSettingsPanel() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const settingsClose = document.getElementById('settingsClose');
  const themeToggle = document.getElementById('themeToggle');
  const themeBtns = themeToggle.querySelectorAll('.theme-toggle-btn');
  const markerSlider = document.getElementById('markerSizeSlider');
  const markerValueEl = document.getElementById('markerSizeValue');
  const planeSlider = document.getElementById('planeSizeSlider');
  const planeValueEl = document.getElementById('planeSizeValue');

  function applyTheme(theme) {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    themeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
  }

  function openSettings() { settingsOverlay.classList.add('visible'); }
  function closeSettings() { settingsOverlay.classList.remove('visible'); }

  settingsBtn.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      saveGameState();
    });
  });

  markerSlider.addEventListener('input', () => {
    airportMarkerScale = Number(markerSlider.value) / 100;
    markerValueEl.textContent = `${markerSlider.value}%`;
    refreshAllMarkerIcons();
  });
  markerSlider.addEventListener('change', () => saveGameState());

  planeSlider.addEventListener('input', () => {
    planeMarkerScale = Number(planeSlider.value) / 100;
    planeValueEl.textContent = `${planeSlider.value}%`;
    fleet.forEach(f => { if (f.marker) refreshPlaneMarkerIcon(f); });
  });
  planeSlider.addEventListener('change', () => saveGameState());

  /* Restore persisted settings (if any) and apply them immediately. */
  const saved = loadGameState();
  const settings = (saved && saved.settings) || {};
  applyTheme(settings.theme === 'light' ? 'light' : 'dark');
  const savedMarkerPct = typeof settings.markerScale === 'number' ? Math.round(settings.markerScale * 100) : 100;
  const savedPlanePct = typeof settings.planeScale === 'number' ? Math.round(settings.planeScale * 100) : 100;
  markerSlider.value = savedMarkerPct;
  markerValueEl.textContent = `${savedMarkerPct}%`;
  airportMarkerScale = savedMarkerPct / 100;
  planeSlider.value = savedPlanePct;
  planeValueEl.textContent = `${savedPlanePct}%`;
  planeMarkerScale = savedPlanePct / 100;
  refreshAllMarkerIcons();

  window.getUISettings = function() {
    return {
      theme: document.documentElement.classList.contains('light-theme') ? 'light' : 'dark',
      markerScale: airportMarkerScale,
      planeScale: planeMarkerScale,
    };
  };
}
