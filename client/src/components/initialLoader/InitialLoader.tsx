/**
 * InitialLoader – Pre-hydration Loading Screen
 *
 * This is a **Server Component** that renders raw HTML + inline CSS + an
 * inline <script> directly into the first server response.
 *
 * Purpose:
 *  - Cover the viewport immediately so fonts, images and other heavy assets
 *    can load behind an opaque overlay.
 *  - After `document.fonts.ready` AND the `window "load"` event both fire,
 *    the overlay fades out to reveal a fully-styled page — no FOUT, no
 *    layout shift.
 *
 * Why inline styles?
 *  External CSS files are render-blocking but may resolve *after* the first
 *  paint of the HTML.  An inline <style> is parsed with the HTML itself, so
 *  the loader is guaranteed to appear styled on the very first frame.
 *
 * Dark-mode:
 *  Because the ThemeProvider hasn't initialised yet, the script reads the
 *  `heartnote-theme` key from localStorage (same key used by useTheme) and
 *  falls back to `prefers-color-scheme`.
 */

/* ------------------------------------------------------------------ */
/*  Inline critical CSS                                                */
/* ------------------------------------------------------------------ */
const LOADER_CSS = /* css */ `
  /* ── Overlay ─────────────────────────────────────────────────────── */
  #initial-loader {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #faf7f5;
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  /* Dark mode – class-based (applied by the script below) */
  #initial-loader.dark-loader {
    background: #111827;
  }
  #initial-loader.dark-loader .il-text  { color: #ffffff !important; }
  #initial-loader.dark-loader .il-heart { fill: #cb8e7c !important; stroke: #f2e9e4 !important; }
  #initial-loader.dark-loader .il-gear  { fill: #f2e9e4 !important; }

  /* Fade-out state */
  #initial-loader.il-hidden {
    opacity: 0;
    pointer-events: none;
  }

  /* ── Background glow ─────────────────────────────────────────────── */
  .il-glow {
    position: absolute;
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(212, 130, 111, 0.2),
      rgba(232, 145, 122, 0.1)
    );
    filter: blur(48px);
    animation: ilGlow 2s ease-in-out infinite;
  }

  /* ── Animations ──────────────────────────────────────────────────── */
  @keyframes ilGlow {
    0%, 100% { transform: scale(1);   opacity: 0.3; }
    50%      { transform: scale(1.2); opacity: 0.5; }
  }

  @keyframes ilPulse {
    0%, 100% { transform: scale(1);    }
    50%      { transform: scale(1.05); }
  }

  @keyframes ilSpin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }

  @keyframes ilTextPulse {
    0%, 100% { opacity: 0.7; }
    50%      { opacity: 1;   }
  }

  @keyframes ilDot {
    0%, 100% { transform: scale(1);   opacity: 0.5; }
    50%      { transform: scale(1.3); opacity: 1;   }
  }
`;

/* ------------------------------------------------------------------ */
/*  Inline bootstrap script                                            */
/* ------------------------------------------------------------------ */
const LOADER_SCRIPT = /* js */ `
(function () {
  /* — 1. Dark-mode detection (before first paint) — */
  var stored = null;
  try { stored = localStorage.getItem('heartnote-theme'); } catch (_) {}
  var isDark =
    stored === 'dark' ||
    (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var el = document.getElementById('initial-loader');
  if (isDark && el) el.classList.add('dark-loader');

  /* — 2. Wait for fonts + full window load — */
  var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  var windowReady = new Promise(function (resolve) {
    if (document.readyState === 'complete') return resolve();
    window.addEventListener('load', resolve);
  });

  Promise.all([fontsReady, windowReady]).then(function () {
    /* Small extra buffer so the browser can paint the final layout */
    setTimeout(function () {
      if (el) {
        el.classList.add('il-hidden');
        /* Remove from DOM after the CSS transition ends */
        setTimeout(function () { el.remove(); }, 600);
      }
    }, 100);
  });
})();
`;

/* ------------------------------------------------------------------ */
/*  React Server Component                                             */
/* ------------------------------------------------------------------ */
export function InitialLoader() {
  return (
    <>
      {/* Critical inline styles – parsed with the HTML, guaranteed first-frame */}
      <style dangerouslySetInnerHTML={{ __html: LOADER_CSS }} />

      {/* The actual overlay – pure HTML, zero client JS framework dependency */}
      <div id="initial-loader" aria-live="polite">
        {/* Background glow */}
        <div className="il-glow" />

        {/* Centred content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Heart + Gear icon */}
          <div style={{ position: "relative", width: "5rem", height: "5rem" }}>
            {/* Heart SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{
                width: "100%",
                height: "100%",
                animation: "ilPulse 1.5s ease-in-out infinite",
              }}
            >
              <defs>
                <linearGradient
                  id="ilHeartGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#d4826f" />
                  <stop offset="100%" stopColor="#c4735f" />
                </linearGradient>
              </defs>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                className="il-heart"
                fill="#f2e9e4"
                stroke="#cb8e7c"
                strokeWidth={2.5}
              />
            </svg>

            {/* Spinning gear */}
            <div
              style={{
                position: "absolute",
                bottom: "-2%",
                left: "-2%",
                width: "55%",
                height: "55%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "ilSpin 3s linear infinite",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="il-gear"
                fill="#2e3c52"
                style={{ width: "90%", height: "90%" }}
              >
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </div>
          </div>

          {/* Logo text */}
          <span
            className="il-text"
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#2e3c52",
              fontFamily: "var(--font-glacial-indifference, sans-serif)",
              animation: "ilTextPulse 1.5s ease-in-out infinite",
            }}
          >
            HeartNote
          </span>

          {/* Loading dots */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  background: "#d4826f",
                  animation: `ilDot 0.8s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Screen reader text */}
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
        >
          טוען...
        </span>
      </div>

      {/* Bootstrap script – runs synchronously before React hydration */}
      <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
    </>
  );
}
