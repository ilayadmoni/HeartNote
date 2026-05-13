# Plan — Mobile Template Fixes

## Scope
Three mobile bugs across two templates.

### Bug 1 — WeddingGlass mobile: figures too small
File: `client/src/components/templates/WeddingGlass/Mobile/WeddingGlassMobile.tsx`

- Increase stage height: `h-56` → `h-72`
- Groom: `w-28 h-48` → `w-40 h-64`, left offset `left-2` → `left-1`
- Bride: `w-32 h-48` → `w-44 h-64`, right offset `right-2` → `right-1`
- Glass: `w-16 h-20` → `w-20 h-24`
- Adjust `min-h-[450px]` create-route height if needed (raise to 520px)

### Bug 2 — BarBatMitzvah mobile: confetti not fullscreen
File: `client/src/components/templates/BarBatMitzvah/Mobile/BarBatMitzvahMobile.tsx`

Root cause: `<CandyBurst>` is rendered inside `<motion.div animate={{ y, opacity }}>` and `<motion.div animate={{ filter, scale }}>`. Both apply CSS `transform`/`filter`, which create a new containing block — so its `position: fixed` becomes relative to the motion wrapper, not the viewport.

Fix: hoist `<CandyBurst>` to the root `<div>` (outside all `motion.div` wrappers). It already uses fixed/100vw/100vh/z-9999, so it will fill the viewport once it's not trapped by a transform ancestor.

### Bug 3 — BarBatMitzvah mobile: hardcoded dark background
File: `client/src/components/templates/BarBatMitzvah/Mobile/BarBatMitzvahMobile.tsx`

- Replace `style={{ backgroundColor: NAVY }}` with Tailwind `bg-white dark:bg-[#121721]`.
- Title color: `#F5F1EC` (hardcoded light) → `text-[#2e3c52] dark:text-[#F5F1EC]`.
- Subtitle: `text-stone-400` → `text-stone-500 dark:text-stone-400`.
- Greeting overlay: `bg-white/15` (visible only on dark) → keep but bump to `bg-black/5 dark:bg-white/15`, border `border-white/25` → `border-black/10 dark:border-white/25`, message text `text-stone-100/90` → `text-stone-700 dark:text-stone-100/90`.

## Constraints
- All files ≤150 lines (already).
- No raw `console.*`.
- TypeScript strict.
- No viewport meta changes.

## Verification
- `npm run type-check`, `npm run lint`, `npm run build` all pass.
- Manual: figures larger on 375px, confetti covers full viewport, background flips on dark/light.
