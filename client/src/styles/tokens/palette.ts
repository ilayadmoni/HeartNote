/**
 * HeartNote brand palette (raw scales).
 * Semantic roles (surface / ink / accent / line) live in globals.css as CSS
 * variables so light and dark themes swap in one place.
 */

export const brand = {
  50: "#FCF1EC",
  100: "#F9E1D7",
  200: "#F3C2AF",
  300: "#EC9E82",
  400: "#E37A57",
  500: "#D85A30",
  600: "#BD4A24",
  700: "#9B3C1E",
  800: "#7A301A",
  900: "#5E2716",
} as const;

export const salmon = {
  50: "#FAF1EC",
  100: "#F4E0D6",
  200: "#E9C3B2",
  300: "#DBA48C",
  400: "#CF8E70",
  500: "#C47A5A",
  600: "#A9644A",
  700: "#8A503B",
  800: "#6D402F",
  900: "#553226",
} as const;

export const cream = {
  50: "#FCFAF8",
  100: "#F9F4F0",
  200: "#F5EDE8",
  300: "#EBDFD6",
  400: "#DCCBBF",
  500: "#C9B3A4",
  600: "#A8917F",
} as const;

export const navy = {
  50: "#F4F6F9",
  100: "#E8ECF1",
  200: "#C7D0DC",
  300: "#94A5BB",
  400: "#5F7794",
  500: "#445A78",
  600: "#374965",
  700: "#2E3C52",
  800: "#293445",
  900: "#252D3B",
  950: "#1A1F2E",
} as const;

/** Tailwind color entry backed by an `rgb(r g b)` CSS variable triplet. */
export const rgbVar = (name: string): string => `rgb(var(--${name}) / <alpha-value>)`;

export const semanticColors = {
  surface: {
    DEFAULT: rgbVar("surface"),
    raised: rgbVar("surface-raised"),
    sunken: rgbVar("surface-sunken"),
  },
  ink: {
    DEFAULT: rgbVar("ink"),
    muted: rgbVar("ink-muted"),
    subtle: rgbVar("ink-subtle"),
  },
  accent: {
    DEFAULT: rgbVar("accent"),
    hover: rgbVar("accent-hover"),
    soft: rgbVar("accent-soft"),
    ink: rgbVar("accent-ink"),
  },
  line: {
    DEFAULT: rgbVar("line"),
    strong: rgbVar("line-strong"),
  },
} as const;
