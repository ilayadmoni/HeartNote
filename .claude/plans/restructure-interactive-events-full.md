# Plan: Restructure interactive-events → Standard Architecture

## Research Summary

### Current structure
```
interactive-events/
├── birthday/           BirthdayCandlesInteractive (4 files + test)
├── wedding/            WeddingGlassInteractive (2 files)
├── holidays/           6 wrappers + shared infra + scenes/ (13 files)
├── shared/             InteractiveShell, GreetingReveal
├── types/              index.ts
├── interactive-registry.test.ts
└── index.ts
```

### Callers
| File | Line | Import |
|---|---|---|
| `templates/registry.ts` | 27 | `./interactive-events/birthday` |
| `templates/registry.ts` | 28 | `./interactive-events/wedding` |
| `templates/registry.ts` | 30-36 | `./interactive-events/holidays` |
| `templates/index.ts` | 33 | `./interactive-events/birthday` |
| `templates/index.ts` | 34 | `./interactive-events/wedding` |
| `templates/index.ts` | 35-42 | `./interactive-events/holidays` |
| `editor/configs/interactive-events.ts` | 2 | `@/…/interactive-events/holidays` |
| `editor/configs/interactive-events.ts` | 3 | `@/…/interactive-events/types` |

### Architecture decision
Interactive templates are **interaction-driven, not layout-driven** — no Desktop/Mobile split.
Reference pattern: `SurpriseGift/` (components/ + main.tsx + index.ts).

### Pre-existing test/implementation mismatch
`candle-utils.test.ts` expects:
- Ages 1–12: `candleCount == age`, `showAgeNumber: false`
- Ages 13+: `candleCount == 7`, `showAgeNumber: true`

Current implementation caps at 4 for ages 5+.  
**Fix**: update `candle-utils.ts` to match tests as part of Step 1 (tests define the contract — TDD).

---

## Target Structure

```
interactive-events/
├── BirthdayCandlesInteractive/
│   ├── components/
│   │   ├── BirthdayFlame.tsx
│   │   ├── BirthdayRevealOverlay.tsx   ← update: "../types" → "../../types"
│   │   └── index.ts
│   ├── utils/
│   │   ├── candle-utils.ts             ← fix implementation to match tests
│   │   └── candle-utils.test.ts
│   ├── BirthdayCandlesInteractive.tsx  ← update sub-imports
│   └── index.ts
├── WeddingGlassInteractive/
│   ├── components/
│   │   ├── WeddingRevealOverlay.tsx    ← update: "../types" → "../../types"
│   │   └── index.ts
│   ├── WeddingGlassInteractive.tsx     ← update sub-imports
│   └── index.ts
├── HolidayRoshHashanahInteractive/
│   ├── HolidayRoshHashanahInteractive.tsx
│   └── index.ts
├── HolidayPassoverInteractive/
│   ├── HolidayPassoverInteractive.tsx
│   └── index.ts
├── HolidayPurimInteractive/
│   ├── HolidayPurimInteractive.tsx
│   └── index.ts
├── HolidayShavuotInteractive/
│   ├── HolidayShavuotInteractive.tsx
│   └── index.ts
├── HolidaySukkotInteractive/
│   ├── HolidaySukkotInteractive.tsx
│   └── index.ts
├── HolidayHanukkahInteractive/
│   ├── HolidayHanukkahInteractive.tsx
│   └── index.ts
├── holidays-shared/                    ← same depth as holidays/, ../shared still works
│   ├── scenes/
│   │   ├── FrameSequenceScene.tsx      ← no import changes
│   │   ├── HanukkahScene.tsx           ← no import changes
│   │   ├── HolidayAssetLayer.tsx       ← no import changes
│   │   ├── HolidayReferenceLayer.tsx   ← no import changes
│   │   ├── PassoverScene.tsx           ← no import changes
│   │   ├── PurimScene.tsx              ← no import changes
│   │   ├── RoshHashanahScene.tsx       ← no import changes
│   │   ├── ShavuotScene.tsx            ← no import changes
│   │   ├── SukkotScene.tsx             ← no import changes
│   │   └── index.ts
│   ├── HolidayInteractiveCard.tsx      ← no import changes (same depth)
│   ├── HolidayCardFrame.tsx            ← no import changes
│   ├── HolidayRevealOverlay.tsx        ← no import changes
│   ├── HolidayScene.tsx                ← no import changes
│   ├── holiday-config.ts               ← no import changes
│   ├── holiday-config.test.ts          ← no import changes
│   ├── holiday-scene-types.ts
│   └── index.ts
├── shared/
│   ├── InteractiveShell.tsx
│   ├── GreetingReveal.tsx
│   └── index.ts
├── types/
│   └── index.ts
├── interactive-registry.test.ts
└── index.ts                            ← re-export from all new sub-paths
```

---

## Execution Steps

### Step 1 — BirthdayCandlesInteractive

1. Create `BirthdayCandlesInteractive/components/BirthdayFlame.tsx` (copy, no changes)
2. Create `BirthdayCandlesInteractive/components/BirthdayRevealOverlay.tsx` — update import `"../types"` → `"../../types"`
3. Create `BirthdayCandlesInteractive/components/index.ts`
4. Create `BirthdayCandlesInteractive/utils/candle-utils.ts` — **fix**: cap 1:1 up to age 12, cap at 7 for 13+
5. Create `BirthdayCandlesInteractive/utils/candle-utils.test.ts` (copy, no changes)
6. Create `BirthdayCandlesInteractive/BirthdayCandlesInteractive.tsx` — update: `./BirthdayFlame` → `./components/BirthdayFlame`, `./BirthdayRevealOverlay` → `./components/BirthdayRevealOverlay`, `./candle-utils` → `./utils/candle-utils`
7. Create `BirthdayCandlesInteractive/index.ts`
8. Update `registry.ts` line 27: `birthday` → `BirthdayCandlesInteractive`
9. Update `templates/index.ts` line 33: `birthday` → `BirthdayCandlesInteractive`
10. Update `interactive-events/index.ts` line 1: `./birthday` → `./BirthdayCandlesInteractive`
11. Delete `birthday/`
12. `npm run type-check && npm run lint`

### Step 2 — WeddingGlassInteractive

1. Create `WeddingGlassInteractive/components/WeddingRevealOverlay.tsx` — update `"../types"` → `"../../types"`
2. Create `WeddingGlassInteractive/components/index.ts`
3. Create `WeddingGlassInteractive/WeddingGlassInteractive.tsx` — update `./WeddingRevealOverlay` → `./components/WeddingRevealOverlay`
4. Create `WeddingGlassInteractive/index.ts`
5. Update `registry.ts` line 28: `wedding` → `WeddingGlassInteractive`
6. Update `templates/index.ts` line 34: `wedding` → `WeddingGlassInteractive`
7. Update `interactive-events/index.ts` line 2: `./wedding` → `./WeddingGlassInteractive`
8. Delete `wedding/`
9. `npm run type-check && npm run lint`

### Step 3 — holidays-shared

1. Create `holidays-shared/scenes/` with all 9 scene files (copy, no import changes)
2. Create `holidays-shared/scenes/index.ts`
3. Copy `holiday-scene-types.ts`, `HolidayCardFrame.tsx`, `HolidayRevealOverlay.tsx` → `holidays-shared/` (no import changes)
4. Copy `HolidayScene.tsx` → `holidays-shared/` (no import changes)
5. Copy `HolidayInteractiveCard.tsx` → `holidays-shared/` (no import changes — same parent depth)
6. Copy `holiday-config.ts` → `holidays-shared/` (no import changes)
7. Copy `holiday-config.test.ts` → `holidays-shared/` (no import changes)
8. Create `holidays-shared/index.ts` (export HOLIDAY_INTERACTIVE_CONFIGS, HOLIDAY_INTERACTIVE_SLUGS)
9. Update `editor/configs/interactive-events.ts` line 2: `…/holidays` → `…/holidays-shared`

### Step 4 — Individual holiday folders (6 templates)

For each: `HolidayXxxInteractive/HolidayXxxInteractive.tsx` + `index.ts`
Import: `../holidays-shared/HolidayInteractiveCard` (relative from sibling folder)

Holidays:
- HolidayRoshHashanahInteractive
- HolidayPassoverInteractive
- HolidayPurimInteractive
- HolidayShavuotInteractive
- HolidaySukkotInteractive
- HolidayHanukkahInteractive

Then:
- Update `registry.ts`: consolidate all holiday imports to use root `./interactive-events` barrel or per-folder
- Update `templates/index.ts`: same
- Update `interactive-events/index.ts`: replace `./holidays` exports with 6 individual folder exports
- Delete `holidays/`
- `npm run type-check && npm run lint`

### Step 5 — Final validation

```bash
cd client
npm run type-check && npm run lint && npm run build && npx vitest run
```

Then verify each migrated template renders in browser.

---

## Commit strategy
- One commit per template (Steps 1, 2, 4)
- holidays-shared in same commit as individual holiday folders (Step 3+4)
