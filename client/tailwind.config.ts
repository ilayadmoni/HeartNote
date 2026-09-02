import type { Config } from "tailwindcss";
import { brand, salmon, cream, navy, semanticColors } from "./src/styles/tokens/palette";
import {
  fontSize,
  fontFamily,
  borderRadius,
  boxShadow,
  spacing,
  maxWidth,
  transitionTimingFunction,
  transitionDuration,
  animation,
  keyframes,
} from "./src/styles/tokens/type";

/**
 * HeartNote design tokens.
 * Palette + semantic roles: src/styles/tokens/palette.ts (+ globals.css vars)
 * Type scale, shape, elevation, motion: src/styles/tokens/type.ts
 * `coral` is a legacy alias of `salmon` so older template code keeps compiling.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { brand, salmon, cream, navy, coral: salmon, ...semanticColors },
      fontFamily,
      fontSize,
      borderRadius,
      boxShadow,
      spacing,
      maxWidth,
      transitionTimingFunction,
      transitionDuration,
      animation,
      keyframes,
    },
  },
  plugins: [],
};

export default config;
