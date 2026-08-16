/* ================================================================
   Day/night terminator overlay + the in-game clock that drives
   window.onGameTimeTick (consumed by airport-panel.js, which
   wires it to updateFleetFlights/runScheduledService/local-time
   updates).
   ================================================================ */
/* ---------------- Day/night cycle + game clock ---------------- */
(function initDayNightAndClock() {
 try {

  /* ----- Sun-position math (approximate but realistic) ----- */
  function declinationDeg(date) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
    return -23.44 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  }

  function subsolarLngDeg(date) {
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    let lng = (12 - utcHours) * 15;
    lng = ((lng + 180) % 360 + 360) % 360 - 180;
    return lng;
  }

  /* Returns lat/lng points tracing the boundary where solar altitude == altDeg,
     closed at whichever pole lies within the "darker than altDeg" region. */
  function terminatorPoints(date, altDeg) {
    const D2R = Math.PI / 180, R2D = 180 / Math.PI;
    const dec = declinationDeg(date) * D2R;
    const sunLng = subsolarLngDeg(date);
    const h = altDeg * D2R;
    const pts = [];
    for (let lngDeg = -180; lngDeg <= 180; lngDeg += 3) {
      const H = (lngDeg - sunLng) * D2R;
      const a = Math.sin(dec), b = Math.cos(dec) * Math.cos(H);
      const R = Math.sqrt(a * a + b * b);
      const c = Math.sin(h);
      let ratio = R === 0 ? 0 : c / R;
      ratio = Math.max(-1, Math.min(1, ratio));
      const phi = Math.atan2(b, a);
      let lat = (Math.asin(ratio) - phi) * R2D;
      if (lat > 90) lat = 90;
      if (lat < -90) lat = -90;
      pts.push([lat, lngDeg]);
    }
    const closeNorth = dec < h; // altitude at north pole equals dec
    if (closeNorth) { pts.push([90, 180]); pts.push([90, -180]); }
    else { pts.push([-90, 180]); pts.push([-90, -180]); }
    return pts;
  }

  /* ----- Overlay layers (stacked bands = soft twilight gradient) ----- */
  map.createPane('nightPane');
  map.getPane('nightPane').classList.add('night-pane');
  map.getPane('nightPane').style.zIndex = 450;

  const BANDS = [
    { alt: 0,   opacity: 0.30, color: '#0a1a30' }, // civil edge — start of dusk/dawn
    { alt: -6,  opacity: 0.22, color: '#071427' }, // civil twilight
    { alt: -12, opacity: 0.20, color: '#050f20' }, // nautical twilight
    { alt: -18, opacity: 0.20, color: '#030a16' }, // astronomical twilight / full night
  ];
  const OFFSETS = [-360, 0, 360];

  const nightLayers = BANDS.map(band => OFFSETS.map(() =>
    L.polygon([[0, 0]], {
      pane: 'nightPane',
      stroke: false,
      fillColor: band.color,
      fillOpacity: band.opacity,
      interactive: false,
    }).addTo(map)
  ));

  function updateNightOverlay(date) {
    BANDS.forEach((band, i) => {
      const pts = terminatorPoints(date, band.alt);
      OFFSETS.forEach((off, j) => {
        const shifted = pts.map(([lat, lng]) => [lat, lng + off]);
        nightLayers[i][j].setLatLngs(shifted);
      });
    });
  }

  /* ----- Game clock state ----- */
  let gameTime = new Date();
  let paused = false;
  let speed = 1; // 1 or 2
  let lastFrame = null;
  let overlayAccum = 0;
  window.getGameTime = () => gameTime;
  // Lets save.js jump the clock forward after simulating an offline gap
  // (see fleet-tick.js's advanceFleetOffline), so the live per-frame loop
  // picks up exactly where the catch-up simulation left off.
  window.setGameTime = (date) => { gameTime = date; };

  const timeHud = document.getElementById('timeHud');
  const pauseBtn = document.getElementById('pauseBtn');
  const speed1Btn = document.getElementById('speed1Btn');
  const speed2Btn = document.getElementById('speed2Btn');
  const clockTimeEl = document.getElementById('clockTime');
  const clockPhaseEl = document.getElementById('clockPhase');

  // Uses the browser/OS locale to automatically pick 12h (AM/PM) vs 24h format.
  const clockFormatter = new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
  });

  function phaseForHour(hour) {
    if (hour >= 5 && hour < 8) return 'Morning';
    if (hour >= 8 && hour < 17) return 'Day';
    if (hour >= 17 && hour < 20) return 'Evening';
    return 'Night';
  }

  function updateClock() {
    clockTimeEl.textContent = clockFormatter.format(gameTime);
    clockPhaseEl.textContent = phaseForHour(gameTime.getHours());
    if (typeof window.onGameTimeTick === 'function') window.onGameTimeTick(gameTime);
  }

  function rateFactor() {
    // 1x: 30 real min = 1 game hr -> 2 game-ms per real-ms
    // 2x: 15 real min = 1 game hr -> 4 game-ms per real-ms
    return speed === 1 ? GAME_MS_PER_REAL_MS_AT_1X : GAME_MS_PER_REAL_MS_AT_1X * 2;
  }

  function setSpeed(s) {
    speed = s;
    speed1Btn.classList.toggle('active', speed === 1);
    speed2Btn.classList.toggle('active', speed === 2);
  }

  function setPaused(p) {
    paused = p;
    pauseBtn.innerHTML = paused ? '&#9654;' : '&#10073;&#10073;';
    pauseBtn.title = paused ? 'Resume' : 'Pause';
    pauseBtn.classList.toggle('is-paused', paused);
    timeHud.classList.toggle('is-paused', paused);
    lastFrame = null; // avoid a large dt jump when resuming
  }

  pauseBtn.addEventListener('click', () => setPaused(!paused));
  speed1Btn.addEventListener('click', () => setSpeed(1));
  speed2Btn.addEventListener('click', () => setSpeed(2));

  function frame(now) {
    if (lastFrame === null) lastFrame = now;
    const dt = now - lastFrame;
    lastFrame = now;

    if (!paused) {
      gameTime = new Date(gameTime.getTime() + dt * rateFactor());

      // Move aircraft every single animation frame (up to 60+ times/sec) so
      // the plane glides continuously along the route instead of jumping
      // every 250ms. The text clock and night-shading overlay are cheap to
      // skip most frames, so those stay throttled below for performance.
      if (typeof window.onGameTimeTick === 'function') window.onGameTimeTick(gameTime);

      overlayAccum += dt;
      if (overlayAccum >= 250) {
        overlayAccum = 0;
        updateClock();
        updateNightOverlay(gameTime);
      }
    }
    requestAnimationFrame(frame);
  }

  setSpeed(1);
  updateClock();
  updateNightOverlay(gameTime);
  requestAnimationFrame(frame);
 } catch (e) {
   console.error('Clock/day-night init failed:', e);
 }
})();
