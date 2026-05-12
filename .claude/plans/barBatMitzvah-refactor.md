# Plan — BarBatMitzvah Template Refactor

## Goal
Refactor `BarBatMitzvah` to (a) mirror WeddingGlass's modular structure and visual rhythm, (b) replace hand-drawn SVG figures with the real PNG/SVG assets in `public/assets/images/BarBatMitzva/`, and (c) replace `canvas-confetti` emoji shower with a Framer Motion candy burst using `bar_mitzvah_candys.png`.

## Context Findings

### Existing structure (already partially WeddingGlass-shaped)
```
BarBatMitzvah/
├── BarBatMitzvah.tsx          (orchestrator, 33 lines — owns mounted+media-query)
├── index.ts
├── types/index.ts             (re-export only)
├── Desktop/BarBatMitzvahDesktop.tsx   (159 lines — over budget)
├── Mobile/BarBatMitzvahMobile.tsx     (147 lines)
└── components/
    ├── BarFigure.tsx          (217 lines, hand-drawn SVG boy)
    ├── BatFigure.tsx          (166 lines, hand-drawn SVG girl)
    └── fireCandyShower.ts     (canvas-confetti emoji shower)
```

### Available assets in `public/assets/images/BarBatMitzva/`
| File | Type | Use |
|---|---|---|
| `bar_mitzvah_boy.png` | PNG | Boy figure (`kind === "bar"`) |
| `bat_mitzvah_girl.svg` | SVG | Girl figure (`kind === "bat"`) |
| `bar_mitzvah_candys.png` | PNG | Candy burst particle (both kinds) |
| `bat_mitzvaha_cake.svg` | SVG | (Optional accent; not required by spec) |

### Existing data contract — must NOT change
```ts
interface BarBatMitzvahData {
  kind: "bar" | "bat";
  introTitle?: string;
  introSubtitle?: string;
  blessingTitle: string;
  blessingMessage: string;
  tapHintLabel?: string;
  primaryColor?: string;
}
```
No name/date/event-detail fields exist. The prompt-suggested `BarBatMitzvahHeader (name + date)` and `BarBatMitzvahDetails (event details)` files cannot be built without expanding the schema, which the constraint "Preserve all existing props and field names — do not break the editor integration" explicitly forbids. → **Drop those two files from the layout.**

### Deviation from prompt's proposed file layout
Prompt proposes a flat layout (`BarBatMitzvahHeader.tsx`, `BarBatMitzvahGallery.tsx`, `BarBatMitzvahDetails.tsx`, `GenderToggle.tsx`). This conflicts with:
1. "Model the visual language strictly after WeddingGlass" — WeddingGlass uses `Desktop/`+`Mobile/`+`components/` split.
2. "Preserve all existing props" — no Header/Details data exists.
3. "Keep existing boy/girl toggle logic exactly as-is" — toggle is editor-driven via `data.kind`, not a runtime tab UI.

→ **Adopt the WeddingGlass layout** instead. The "menu bar / toggle" is the existing `data.kind` conditional render.

## Target Structure
```
BarBatMitzvah/
├── BarBatMitzvah.tsx           (orchestrator — owns state, ≤ 80 lines)
├── index.ts                    (re-export only)
├── types/index.ts              (re-export only — unchanged)
├── Desktop/BarBatMitzvahDesktop.tsx   (≤ 150 lines — layout only)
├── Mobile/BarBatMitzvahMobile.tsx     (≤ 150 lines — layout only)
└── components/
    ├── BoyFigure.tsx           (next/image wrapper, ≤ 30 lines)
    ├── GirlFigure.tsx          (next/image wrapper, ≤ 30 lines)
    ├── CandyBurst.tsx          (framer-motion burst, ≤ 120 lines)
    └── candyBurstConfig.ts     (palette + variant helpers if CandyBurst exceeds 120)
```

Files removed:
- `components/BarFigure.tsx` (replaced by `BoyFigure.tsx`)
- `components/BatFigure.tsx` (replaced by `GirlFigure.tsx`)
- `components/fireCandyShower.ts` (replaced by `<CandyBurst />` component)

## Orchestrator State (lifted from current Desktop+Mobile)
```ts
// In BarBatMitzvah.tsx
const [mounted, setMounted] = useState(false);
const [isThrowing, setIsThrowing] = useState(false);
const [showGreeting, setShowGreeting] = useState(false);
const [burstKey, setBurstKey] = useState(0); // remounts CandyBurst for replay

const handleReveal = () => {
  if (isThrowing || showGreeting) return;
  setIsThrowing(true);
  setBurstKey(k => k + 1);
  setTimeout(() => { setShowGreeting(true); setIsThrowing(false); }, 600);
};

const handleReset = () => { setShowGreeting(false); };
```
Both Desktop and Mobile receive the same `sharedProps`, mirroring `WeddingGlass.tsx`.

## CandyBurst Component Design
- Renders absolutely positioned over the canvas area (z-index 50, pointer-events-none).
- Triggered by `burstKey` prop change (parent increments to re-burst).
- Spawns **14 candy `<motion.img>`** instances at center; each with randomized:
  - `translateX`: ±200–400 px
  - `translateY`: -150 to +400 px (downward bias, gravity feel)
  - `rotate`: 0–720 deg
  - `scale`: 0.8 → 1.0 → 0.6 (pulse + fade-out)
  - `opacity`: 0 → 1 → 0
- Per-particle duration 1.1–1.6 s, ease-out via `[0.2, 0.6, 0.4, 0.95]`.
- Uses `next/image` with `unoptimized` (PNG transparent, small file) — or plain `<motion.img>` for direct framer-motion target binding. Pick `<motion.img>` for the animated particles (next/image's wrapper makes transform animations awkward) but keep figure images on `next/image`.
- All randomness seeded inside `useMemo([burstKey], …)` so identical replay sequences across renders within a burst.
- Hebrew `alt="סוכריה"` on each particle.

## Figure Components
```tsx
// BoyFigure.tsx
<Image src="/assets/images/BarBatMitzva/bar_mitzvah_boy.png"
       alt="ילד בר מצווה" width={280} height={360}
       priority className="object-contain pointer-events-auto cursor-pointer drop-shadow-md"
       onClick={onClick} />
```
Same shape for `GirlFigure.tsx` (`bat_mitzvah_girl.svg`, alt="ילדת בת מצווה"). Wrapped by parent in a `motion.div` for hover/tap scale, matching WeddingGlass's bride/groom slot.

## Desktop Layout (mirrors WeddingGlassDesktop)
1. Outer container — `dir="rtl"`, full-bleed, `text-right` default.
2. `<BackToGallery />` top-right (RTL).
3. `motion.div` fade-in (opacity 0→1, y 20→0, 0.5s) — same as WeddingGlass.
4. Title (`text-4xl font-black text-hebrew-heading`) with `primaryColor`.
5. Subtitle (`text-stone-600`).
6. Stage container (`relative h-80 mb-8 border-b-4 border-cream pb-2 overflow-visible`):
   - `<CandyBurst key={burstKey} />` absolute over stage
   - Centered figure (Boy or Girl based on `data.kind`) inside `motion.div` with `filter: blur(6px)` when greeting is shown
   - "Tap hint" pill floating above figure (matches existing implementation)
   - Greeting overlay (`AnimatePresence`, white card with primary accent bar) — same shape as WeddingGlass MazalTov overlay.
7. CTA button: gradient (primary → primary 75%), rounded-full, `whileHover/whileTap`.
8. `<FooterBranding />`.

Color palette (per spec): gold (`#D4A14A`), deep navy (`#121C2E`), warm cream (`#F5EBDD`). Use as defaults when `primaryColor` is unspecified; otherwise primary drives accents and gold/cream remain as fixed background/cream-border tokens.

## Mobile Layout (mirrors WeddingGlassMobile)
- Same structure, tighter sizing (h-56 stage, `text-2xl` headings, `text-sm` body).
- Same Navy background as current implementation (preserves the floating glass-card greeting look — matches WeddingGlass mobile aesthetic).
- Button: full-width, gradient as above.

## Constraints Verified
| Constraint | Approach |
|---|---|
| ≤ 150 lines/file | Orchestrator 60–70, Desktop ~140, Mobile ~140, CandyBurst ~110, figures ~25 each |
| Zero `any` | All props typed; framer variants typed with `Variants` from `framer-motion` |
| No `console.*` | None used; no logging path needed for pure UI |
| Hebrew RTL | `dir="rtl"` on outer container; `text-right` default; all text strings already Hebrew |
| `next/image` for figures | Yes, with explicit width/height + Hebrew alt |
| CandyBurst particles | `<motion.img>` (transform-friendly) with Hebrew alt — acceptable since they are decorative ephemeral particles, not LCP candidates |
| Preserve props | `BarBatMitzvahData` interface untouched; all 7 fields consumed |
| `data.kind` toggle | Preserved exactly — Desktop and Mobile branch on `data.kind` to render BoyFigure or GirlFigure |

## Execution Order (for Sonnet)
1. Delete obsolete files: `components/BarFigure.tsx`, `components/BatFigure.tsx`, `components/fireCandyShower.ts`.
2. Create `components/CandyBurst.tsx` (framer-motion particle burst, 14 instances, candy PNG).
3. Create `components/BoyFigure.tsx` and `components/GirlFigure.tsx` (next/image wrappers, accept `onClick`).
4. Rewrite `Desktop/BarBatMitzvahDesktop.tsx` to consume shared props from orchestrator, render figure + burst + greeting overlay.
5. Rewrite `Mobile/BarBatMitzvahMobile.tsx` mirroring desktop layout at mobile sizes.
6. Rewrite `BarBatMitzvah.tsx` to own state (`isThrowing`, `showGreeting`, `burstKey`) and pass `sharedProps` to Desktop/Mobile.
7. `npm run type-check` from `client/`. Fix any errors.
8. `npm run build` from `client/`. Fix any errors.
9. Verify no other code imports `BarFigure`, `BatFigure`, or `fireCandyShower` (grep before deleting).

## Risk / Notes
- `canvas-confetti` is still used by WeddingGlass and other templates — do **not** uninstall the package, only remove this template's import.
- The current Mobile implementation already uses `data.kind` to swap figures; the refactor preserves this exactly.
- `bar_mitzvah_boy.png` is the only PNG figure — if it has transparent background it will composite cleanly on Navy mobile bg; verify visually after build.

## Post-Task Checklist
- [ ] No file exceeds 150 lines
- [ ] Zero TypeScript errors (`npm run type-check`)
- [ ] Build passes (`npm run build`)
- [ ] CandyBurst triggers on figure click + button click
- [ ] `data.kind === "bar"` shows BoyFigure, `"bat"` shows GirlFigure
- [ ] Figures load via `next/image` with explicit width/height + Hebrew alt
- [ ] RTL layout correct (`dir="rtl"` on outer container)
- [ ] `BarBatMitzvahData` interface unchanged
- [ ] No other files import the deleted `BarFigure` / `BatFigure` / `fireCandyShower`
- [ ] Plan log written to `.claude/plans/logs/barBatMitzvah-refactor-<timestamp>.log`
