/**
 * Typography, shape, elevation and motion tokens consumed by tailwind.config.
 * Scale ratio ~1.25 between steps; display sizes are fluid.
 */

type FontSizeEntry = [string, { lineHeight: string; letterSpacing?: string; fontWeight?: string }];

export const fontSize: Record<string, FontSizeEntry> = {
  "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
  "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.015em", fontWeight: "700" }],
  "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
  "title-lg": ["1.5rem", { lineHeight: "1.25", fontWeight: "700" }],
  "title-md": ["1.25rem", { lineHeight: "1.3", fontWeight: "700" }],
  "title-sm": ["1.0625rem", { lineHeight: "1.35", fontWeight: "700" }],
  "body-lg": ["1.125rem", { lineHeight: "1.65" }],
  "body-md": ["1rem", { lineHeight: "1.6" }],
  "body-sm": ["0.9375rem", { lineHeight: "1.55" }],
  caption: ["0.8125rem", { lineHeight: "1.45" }],
  overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "700" }],
};

export const fontFamily = {
  display: ["var(--font-glacial-indifference)", "var(--font-open-sans)", "system-ui", "sans-serif"],
  body: ["var(--font-open-sans)", "system-ui", "sans-serif"],
  sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
};

export const borderRadius = {
  control: "14px",
  card: "24px",
  pill: "9999px",
};

/** Shadows tinted to navy ink (never pure black) plus a terracotta glow. */
export const boxShadow = {
  soft: "0 1px 2px rgb(46 60 82 / 0.06), 0 2px 8px rgb(46 60 82 / 0.05)",
  card: "0 4px 16px rgb(46 60 82 / 0.08), 0 1px 3px rgb(46 60 82 / 0.06)",
  lift: "0 18px 40px rgb(46 60 82 / 0.14), 0 4px 12px rgb(46 60 82 / 0.06)",
  glow: "0 12px 32px rgb(216 90 48 / 0.28)",
  "glow-sm": "0 6px 18px rgb(216 90 48 / 0.22)",
  inset: "inset 0 1px 0 rgb(255 255 255 / 0.35)",
};

export const spacing = {
  section: "clamp(4rem, 8vw, 7rem)",
  "section-sm": "clamp(2.5rem, 5vw, 4.5rem)",
  gutter: "clamp(1rem, 4vw, 2.5rem)",
  header: "4.5rem",
};

export const maxWidth = {
  shell: "80rem",
  prose: "65ch",
};

export const transitionTimingFunction = {
  "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
  "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
};

export const transitionDuration = {
  fast: "160ms",
  base: "240ms",
  slow: "420ms",
};

export const animation = {
  "fade-in": "fadeIn 0.3s ease-in-out",
  "slide-up": "slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  "scale-in": "scaleIn 0.2s ease-out",
  shimmer: "shimmer 1.8s linear infinite",
};

export const keyframes = {
  fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
  slideUp: {
    "0%": { transform: "translateY(10px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },
  scaleIn: {
    "0%": { transform: "scale(0.95)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
  cookieSlideUp: {
    "0%": { transform: "translateY(100%)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
};
