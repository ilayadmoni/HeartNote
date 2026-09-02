/**
 * Critical inline CSS for the pre-hydration loader overlay.
 * Runs before the design-token CSS variables exist, so it uses the brand
 * hex values directly: accent #D85A30, surface #F5EDE8, ink #2E3C52.
 */
export const LOADER_CSS = /* css */ `
  #initial-loader {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #F5EDE8;
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  #initial-loader.dark-loader {
    background: #1A1F2E;
  }
  #initial-loader.dark-loader .il-text  { color: #F5EDE8 !important; }
  #initial-loader.dark-loader .il-heart { fill: #D85A30 !important; stroke: #F5EDE8 !important; }
  #initial-loader.dark-loader .il-gear  { fill: #F5EDE8 !important; }

  #initial-loader.il-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .il-glow {
    position: absolute;
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(216, 90, 48, 0.2), rgba(216, 90, 48, 0.08));
    filter: blur(48px);
    animation: ilGlow 2s ease-in-out infinite;
  }

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
