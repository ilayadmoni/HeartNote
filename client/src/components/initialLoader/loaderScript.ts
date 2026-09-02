/**
 * Bootstrap script for the pre-hydration loader. Detects dark mode before
 * first paint and fades the overlay out once fonts + window load settle.
 */
export const LOADER_SCRIPT = /* js */ `
(function () {
  var stored = null;
  try { stored = localStorage.getItem('heartnote-theme'); } catch (_) { console.warn('[InitialLoader] localStorage unavailable, falling back to prefers-color-scheme'); }
  var isDark =
    stored === 'dark' ||
    (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var el = document.getElementById('initial-loader');
  if (isDark && el) el.classList.add('dark-loader');

  var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  var windowReady = new Promise(function (resolve) {
    if (document.readyState === 'complete') return resolve();
    window.addEventListener('load', resolve);
  });

  Promise.all([fontsReady, windowReady]).then(function () {
    setTimeout(function () {
      if (el) {
        el.classList.add('il-hidden');
        setTimeout(function () { el.remove(); }, 600);
      }
    }, 100);
  });
})();
`;
