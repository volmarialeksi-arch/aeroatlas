/* ================================================================
   Buy New Airport panel: floating search + budget filter over
   the main map.
   ================================================================ */
/* ================================================================
   BUY NEW AIRPORT panel — a floating search + budget filter over the
   single main map (no separate map instance). Selecting a result flies
   the main map to that airport and opens its normal info panel, so
   airports are always clickable and the clock/day-night overlay stay
   visible the whole time, buy panel open or not.
   ================================================================ */
const buyPanel = document.getElementById('buyPanel');
const buyNewAirportBtn = document.getElementById('buyNewAirportBtn');

function openBuyPanel() {
  buyPanel.classList.add('visible');
  applyBudgetFilter();
  searchInput.focus();
}

function closeBuyPanel() {
  buyPanel.classList.remove('visible');
  clearBudgetFilter();
  searchResults.classList.remove('show');
}

buyNewAirportBtn.addEventListener('click', () => {
  if (buyPanel.classList.contains('visible')) closeBuyPanel();
  else openBuyPanel();
});

