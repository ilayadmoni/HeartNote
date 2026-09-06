# Mobile SVG Black BG + Input Zoom Fixes

## Bug 1 — SVG black background on mobile
- Add global CSS in `globals.css`:
  - `img[src$=".svg"], img[src*=".svg?"] { background: transparent; -webkit-backface-visibility: hidden; backface-visibility: hidden; }`
- Audit confirmed: 5 components render SVG via `<Image>` / `motion.img`. None set a background. Adding the global rule will neutralize any WebKit compositing artifact.
- SVG file audit: `hand.svg` uses paths + clip masks (no full-viewport solid `<rect>`); other SVGs are figure assets. No file-level edits required.

## Bug 2 — Mobile input zoom
- Update viewport meta in `layout.tsx` via Next `Viewport` export: add `maximumScale: 1`. Leave `userScalable` enabled for a11y.
- Strengthen global CSS rule for inputs:
  - Move out of `@layer base` so Tailwind utility classes (`text-sm`, `text-xs`) cannot override.
  - Use `!important` minimum-16px on inputs/textarea/select.
- DecisionWheel uses `OptionsEditor` → `LimitedInput` with `text-sm` (14px) class. The `!important` rule resolves it.
- No tailwind.config.ts fontSize tokens override.

## Files to edit
1. `client/src/app/globals.css` — add SVG rule + replace input @layer base block with stronger rule.
2. `client/src/app/layout.tsx` — add `maximumScale: 1` to `viewport` export.
