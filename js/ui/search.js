/* ================================================================
   Airport search box (autocomplete over the AIRPORTS list).
   ================================================================ */
/* ---------------- Search ---------------- */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('show'); searchResults.innerHTML=''; return; }

  const matches = AIRPORTS.filter(ap =>
    ap.iata.toLowerCase().includes(q) ||
    ap.icao.toLowerCase().includes(q) ||
    ap.city.toLowerCase().includes(q) ||
    ap.name.toLowerCase().includes(q) ||
    ap.country.toLowerCase().includes(q)
  ).slice(0, 8);

  if (!matches.length) {
    searchResults.innerHTML = `<div class="search-result-item">No matches found</div>`;
    searchResults.classList.add('show');
    return;
  }

  searchResults.innerHTML = matches.map(ap =>
    `<div class="search-result-item" data-code="${ap.iata}">
       <span>${ap.city}, ${ap.country}</span>
       <span class="sr-code">${ap.iata}</span>
     </div>`
  ).join('');
  searchResults.classList.add('show');
});

searchResults.addEventListener('click', (e) => {
  const item = e.target.closest('.search-result-item');
  if (!item || !item.dataset.code) return;
  const entry = markerByCode[item.dataset.code];
  if (!entry) return;
  selectAirport(entry.ap, entry.marker);
  searchResults.classList.remove('show');
  searchInput.value = `${entry.ap.iata} — ${entry.ap.city}`;
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) {
    searchResults.classList.remove('show');
  }
});

