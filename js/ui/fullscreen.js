/* ================================================================
   Fullscreen toggle button.
   ================================================================ */
/* ---------------- Fullscreen toggle ---------------- */
(function setupFullscreenToggle() {
  const btn = document.getElementById('fullscreenBtn');
  if (!btn) return;
  const target = document.documentElement;

  function currentFsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
  }

  function requestFs(el) {
    const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fn) return fn.call(el);
    return Promise.reject(new Error('Fullscreen API unavailable'));
  }

  function exitFs() {
    const fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (fn) return fn.call(document);
    return Promise.reject(new Error('Fullscreen API unavailable'));
  }

  function syncBtnState() {
    const active = !!currentFsElement();
    btn.classList.toggle('is-fullscreen', active);
    btn.title = active ? 'Exit fullscreen' : 'Enter fullscreen';
    btn.setAttribute('aria-label', btn.title);
  }

  btn.addEventListener('click', () => {
    if (currentFsElement()) {
      exitFs().catch(() => {});
    } else {
      requestFs(target).catch(() => {});
    }
  });

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, syncBtnState);
  });
  syncBtnState();
})();

/* ================================================================
   FLEET / AIRCRAFT SYSTEM
   ================================================================ */

