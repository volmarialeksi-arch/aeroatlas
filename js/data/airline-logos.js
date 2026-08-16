/* ================================================================
   Airline logo catalog — tail-fin style marks the player can
   optionally pick for their airline during new-game setup.

   Three groups, all individually selectable (each is its own
   separate option in the picker — nothing here selects a bundle):
     - AIRLINE_LOGOS_SIMPLE : the original small colored swoosh marks
     - AIRLINE_LOGOS_FLAGS  : national-flag tail liveries
     - AIRLINE_LOGOS_STRIPES: colored diagonal-stripe tail liveries

   AIRLINE_LOGOS is the flattened list of all of the above, in the
   order they should appear in the picker grid.
   ================================================================ */

/* ---------------- original simple swoosh marks ---------------- */
const AIRLINE_LOGOS_SIMPLE = [
  { id: 'amber-swoosh', name: 'Amber Swoosh', color: '#f2b33d' },
  { id: 'sky-blue',     name: 'Sky Blue',     color: '#4aa3e0' },
  { id: 'crimson',      name: 'Crimson',      color: '#e4572e' },
  { id: 'emerald',      name: 'Emerald',      color: '#3fb27f' },
  { id: 'violet',       name: 'Violet',       color: '#9b6bd6' },
  { id: 'slate',        name: 'Slate',        color: '#8fa0b8' },
  { id: 'rose',         name: 'Rose',         color: '#e0699b' },
  { id: 'gold',         name: 'Gold',         color: '#d4af37' },
];

/* ---------------- shared tail-fin silhouette ---------------- */
/* Same fin + pod shape used by every flag/stripe logo below, so they
   all read as one consistent "tail fin" family in the picker. */
const TAIL_FIN_D = 'M95,4 C110,6 118,13 119,23 L123,116 C123,126 116,131 107,131 L54,131 C45,131 39,125 41,117 L59,42 C63,20 76,8 95,4 Z';
const TAIL_POD_D = 'M8,124 C2,124 1,131 2,138 L4,152 C5,159 12,162 20,160 L60,148 C67,145 68,137 63,132 L54,123 Z';

/* Builds a full standalone <svg> for one tail-fin logo.
   finContent: raw SVG markup drawn full-canvas then clipped to the
               fin silhouette (so plain rects/circles/etc. "become"
               flag or stripe patterns on the fin shape).
   podFill:    fill for the little winglet pod at the base — either a
               flat color (stripe logos) or a chrome gradient ref
               (flag logos), matching the reference art. */
function tailFinSVG(id, size, finContent, podFill) {
  const s = size || 28;
  const clipId = `finclip-${id}`;
  const chromeId = `chrome-${id}`;
  return `
    <svg width="${s}" height="${s}" viewBox="0 0 140 170" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${clipId}"><path d="${TAIL_FIN_D}"/></clipPath>
        <linearGradient id="${chromeId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef2f6"/>
          <stop offset="55%" stop-color="#aab7c4"/>
          <stop offset="100%" stop-color="#6b7784"/>
        </linearGradient>
      </defs>
      <path d="${TAIL_POD_D}" fill="${podFill || `url(#${chromeId})`}" stroke="#141c26" stroke-width="1.6"/>
      <g clip-path="url(#${clipId})">${finContent}</g>
      <path d="${TAIL_FIN_D}" fill="none" stroke="#141c26" stroke-width="2.4"/>
    </svg>
  `;
}

/* Small geometry helpers used by a few flags below. */
function starPts(cx, cy, rOuter, rInner, points, rotationDeg) {
  const rot = ((rotationDeg == null ? -90 : rotationDeg) * Math.PI) / 180;
  const step = Math.PI / points;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = rot + i * step;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}
function star(cx, cy, rOuter, fill, points, rotationDeg) {
  return `<polygon points="${starPts(cx, cy, rOuter, rOuter * 0.42, points || 5, rotationDeg)}" fill="${fill}"/>`;
}
function dot(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

/* ---------------- national-flag tail liveries ---------------- */
const AIRLINE_LOGOS_FLAGS = [
  {
    id: 'flag-france', name: 'France',
    finContent: `<rect width="46.7" height="170" fill="#0055A4"/><rect x="46.7" width="46.6" height="170" fill="#fff"/><rect x="93.3" width="46.7" height="170" fill="#EF4135"/>`,
  },
  {
    id: 'flag-finland', name: 'Finland',
    finContent: `<rect width="140" height="170" fill="#fff"/><rect x="58" width="20" height="170" fill="#002F6C"/><rect y="64" width="140" height="20" fill="#002F6C"/>`,
  },
  {
    id: 'flag-china', name: 'China',
    finContent: `<rect width="140" height="170" fill="#DE2910"/>${star(90, 52, 15, '#FFDE00', 5, -78)}${star(112, 30, 4.5, '#FFDE00', 5, -34)}${star(119, 44, 4.5, '#FFDE00', 5, -6)}${star(117, 60, 4.5, '#FFDE00', 5, 40)}${star(108, 71, 4.5, '#FFDE00', 5, 80)}`,
  },
  {
    id: 'flag-norway', name: 'Norway',
    finContent: `<rect width="140" height="170" fill="#BA0C2F"/><rect x="56" width="24" height="170" fill="#fff"/><rect y="59" width="140" height="24" fill="#fff"/><rect x="62" width="12" height="170" fill="#00205B"/><rect y="65" width="140" height="12" fill="#00205B"/>`,
  },
  {
    id: 'flag-mexico', name: 'Mexico',
    finContent: `<rect width="46.7" height="170" fill="#006847"/><rect x="46.7" width="46.6" height="170" fill="#fff"/><rect x="93.3" width="46.7" height="170" fill="#CE1126"/><circle cx="70" cy="85" r="15" fill="#a9762f"/><circle cx="70" cy="85" r="9" fill="#3fb27f"/>`,
  },
  {
    id: 'flag-poland', name: 'Poland',
    finContent: `<rect width="140" height="85" fill="#fff"/><rect y="85" width="140" height="85" fill="#DC143C"/>`,
  },
  {
    id: 'flag-austria', name: 'Austria',
    finContent: `<rect width="140" height="170" fill="#ED2939"/><rect y="56.7" width="140" height="56.6" fill="#fff"/>`,
  },
  {
    id: 'flag-usa', name: 'United States',
    finContent: `<rect width="140" height="170" fill="#fff"/>${[0,1,2,3,4,5,6].map(i => `<rect y="${i*24.3}" width="140" height="12.15" fill="#B22234"/>`).join('')}<rect x="66" y="18" width="52" height="66" fill="#3C3B6E"/>${[0,1,2,3].map(r => [0,1,2].map(c => dot(76+c*16, 27+r*15, 2.6, '#fff')).join('')).join('')}`,
  },
  {
    id: 'flag-canada', name: 'Canada',
    finContent: `<rect width="35" height="170" fill="#D80621"/><rect x="35" width="70" height="170" fill="#fff"/><rect x="105" width="35" height="170" fill="#D80621"/>${star(70, 85, 17, '#D80621', 8, -90)}`,
  },
  {
    id: 'flag-spain', name: 'Spain',
    finContent: `<rect width="140" height="170" fill="#AA151B"/><rect y="42.5" width="140" height="85" fill="#F1BF00"/><rect x="68" y="62" width="15" height="36" fill="#AD1519" stroke="#F1BF00" stroke-width="1.5"/>`,
  },
  {
    id: 'flag-uk', name: 'United Kingdom',
    finContent: `<rect width="140" height="170" fill="#00247D"/><line x1="0" y1="0" x2="140" y2="170" stroke="#fff" stroke-width="30"/><line x1="140" y1="0" x2="0" y2="170" stroke="#fff" stroke-width="30"/><line x1="0" y1="0" x2="140" y2="170" stroke="#CF142B" stroke-width="12"/><line x1="140" y1="0" x2="0" y2="170" stroke="#CF142B" stroke-width="12"/><rect x="58" width="24" height="170" fill="#fff"/><rect y="61" width="140" height="24" fill="#fff"/><rect x="64" width="12" height="170" fill="#CF142B"/><rect y="67" width="140" height="12" fill="#CF142B"/>`,
  },
  {
    id: 'flag-japan', name: 'Japan',
    finContent: `<rect width="140" height="170" fill="#fff"/><circle cx="70" cy="85" r="30" fill="#BC002D"/>`,
  },
  {
    id: 'flag-australia', name: 'Australia',
    finContent: `<rect width="140" height="170" fill="#00247D"/><rect x="66" y="22" width="46" height="34" fill="#00247D"/><line x1="66" y1="22" x2="112" y2="56" stroke="#fff" stroke-width="8"/><line x1="112" y1="22" x2="66" y2="56" stroke="#fff" stroke-width="8"/><line x1="66" y1="22" x2="112" y2="56" stroke="#CF142B" stroke-width="3"/><line x1="112" y1="22" x2="66" y2="56" stroke="#CF142B" stroke-width="3"/><rect x="84.5" y="22" width="9" height="34" fill="#fff"/><rect x="66" y="34.5" width="46" height="9" fill="#fff"/><rect x="87" y="22" width="4" height="34" fill="#CF142B"/><rect x="66" y="37" width="46" height="4" fill="#CF142B"/>${star(60, 118, 8, '#fff', 7, -90)}${star(108, 78, 6, '#fff', 7, -90)}${star(118, 100, 6, '#fff', 7, -90)}${star(103, 108, 6, '#fff', 7, -90)}${star(93, 96, 4, '#fff', 7, -90)}`,
  },
  {
    id: 'flag-brazil', name: 'Brazil',
    finContent: `<rect width="140" height="170" fill="#009739"/><polygon points="70,25 128,85 70,145 12,85" fill="#FEDD00"/><circle cx="70" cy="85" r="26" fill="#002776"/>`,
  },
  {
    id: 'flag-italy', name: 'Italy',
    finContent: `<rect width="46.7" height="170" fill="#008C45"/><rect x="46.7" width="46.6" height="170" fill="#fff"/><rect x="93.3" width="46.7" height="170" fill="#CD212A"/>`,
  },
  {
    id: 'flag-germany', name: 'Germany',
    finContent: `<rect width="140" height="56.7" fill="#000"/><rect y="56.7" width="140" height="56.6" fill="#DD0000"/><rect y="113.3" width="140" height="56.7" fill="#FFCE00"/>`,
  },
].map(f => ({
  id: f.id,
  name: f.name,
  group: 'flag',
  render: (size) => tailFinSVG(f.id, size, f.finContent, null /* chrome pod */),
}));

/* ---------------- diagonal-stripe tail liveries ---------------- */
function stripeFin(base, stripe) {
  return `<rect width="140" height="170" fill="${base}"/><polygon points="46,170 76,170 130,0 100,0" fill="${stripe}"/>`;
}
const AIRLINE_LOGOS_STRIPES = [
  { id: 'stripe-navy',      name: 'Navy Streak',    base: '#152b4d', stripe: '#4aa3e0' },
  { id: 'stripe-maroon',    name: 'Maroon Streak',  base: '#7a1420', stripe: '#141619' },
  { id: 'stripe-onyx-lime', name: 'Onyx Lime',      base: '#161616', stripe: '#7ed321' },
  { id: 'stripe-violet',    name: 'Violet Streak',  base: '#4a1f63', stripe: '#c23fae' },
  { id: 'stripe-teal',      name: 'Teal Streak',    base: '#1f6b73', stripe: '#5bc7ce' },
  { id: 'stripe-gold',      name: 'Gold Streak',    base: '#e0a422', stripe: '#191919' },
  { id: 'stripe-cobalt',    name: 'Cobalt Streak',  base: '#1c3f8f', stripe: '#4aa3e0' },
  { id: 'stripe-orange',    name: 'Orange Streak',  base: '#e0631f', stripe: '#17181a' },
  { id: 'stripe-forest',    name: 'Forest Streak',  base: '#1f5c34', stripe: '#8ede4f' },
  { id: 'stripe-black-red', name: 'Onyx Red',       base: '#161616', stripe: '#d81e2c' },
].map(s => ({
  id: s.id,
  name: s.name,
  group: 'stripe',
  render: (size) => tailFinSVG(s.id, size, stripeFin(s.base, s.stripe), s.base),
}));

/* ---------------- flattened catalog used by the picker ---------------- */
const AIRLINE_LOGOS = [
  ...AIRLINE_LOGOS_SIMPLE,
  ...AIRLINE_LOGOS_FLAGS,
  ...AIRLINE_LOGOS_STRIPES,
];

/* Renders a small logo glyph in the given pixel size for whichever
   catalog entry matches logoId. Used both in the logo-picker grid
   (small) and anywhere the chosen logo is shown back to the player
   (e.g. the brand panel). Each entry is its own independent option —
   picking one never selects any of the others. */
function airlineLogoSVG(logoId, size) {
  const entry = AIRLINE_LOGOS.find(l => l.id === logoId);
  if (!entry) return '';
  if (typeof entry.render === 'function') return entry.render(size);
  const s = size || 28;
  return `
    <svg width="${s}" height="${s}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="${entry.color}" opacity="0.16"/>
      <path d="M16 4 L19 14 L27 17 L19 18.5 L17.3 27 L16 29 L14.7 27 L13 18.5 L5 17 L13 14 Z"
        fill="${entry.color}"/>
    </svg>
  `;
}
