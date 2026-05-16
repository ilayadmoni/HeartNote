# Plan: migrate-interactive-events-templates

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add missing barrel `index.ts` files, restructure `types.ts` into a `types/` folder, and update all callers to use barrel imports — bringing `interactive-events/` into alignment with standard template architecture conventions without changing any visual or logic code.

**Architecture:** The `interactive-events/` folder is a feature module containing 8 interactive templates (1 birthday, 1 wedding, 6 holidays). It correctly uses `InteractiveShell` instead of a Desktop/Mobile split (these are interaction-driven, not layout-driven templates). The only structural gaps are missing barrel exports and a flat `types.ts` that should live in a `types/` subfolder. All file content stays unchanged; only the scaffolding changes.

**Tech Stack:** TypeScript 5.x, Next.js 14 App Router, Tailwind CSS, Framer Motion 11

---

## Context

Callers currently import directly from deep file paths:
```typescript
// registry.ts — currently broken pattern
import { BirthdayCandlesInteractive } from "./interactive-events/birthday/BirthdayCandlesInteractive";
```

After migration they will import from the folder barrel:
```typescript
// registry.ts — target pattern
import { BirthdayCandlesInteractive } from "./interactive-events/birthday";
```

No Desktop/Mobile split will be applied — this is intentionally different from standard card templates and correct for interactive templates.

---

## Canonical Standard Architecture

Every standard template folder must have:

```
FeatureName/
├── index.ts                        ← single-line barrel: export { X } from "./X"
├── types/
│   └── index.ts                    ← prop interfaces, local enums
├── ComponentName.tsx               ← main orchestrator
└── ... (Desktop/, Mobile/, etc.)
```

**Key rule:** Every folder must have an `index.ts` barrel. Callers always import from the folder, never from a specific file inside it.

---

## Current State Audit

### Folder tree
```
interactive-events/
├── types.ts                        ← DEVIATE: should be types/index.ts
├── interactive-registry.test.ts
├── birthday/
│   ├── BirthdayCandlesInteractive.tsx
│   ├── BirthdayFlame.tsx
│   ├── BirthdayRevealOverlay.tsx
│   ├── candle-utils.ts
│   └── candle-utils.test.ts
├── holidays/
│   ├── HolidayCardFrame.tsx
│   ├── HolidayInteractiveCard.tsx
│   ├── HolidayRevealOverlay.tsx
│   ├── HolidayScene.tsx
│   ├── HolidayWrappers.tsx
│   ├── holiday-config.ts
│   ├── holiday-config.test.ts
│   ├── holiday-scene-types.ts
│   └── scenes/
│       ├── FrameSequenceScene.tsx
│       ├── HanukkahScene.tsx
│       ├── HolidayAssetLayer.tsx
│       ├── HolidayReferenceLayer.tsx
│       ├── PassoverScene.tsx
│       ├── PurimScene.tsx
│       ├── RoshHashanahScene.tsx
│       ├── ShavuotScene.tsx
│       └── SukkotScene.tsx
├── shared/
│   ├── GreetingReveal.tsx
│   └── InteractiveShell.tsx
└── wedding/
    ├── WeddingGlassInteractive.tsx
    └── WeddingRevealOverlay.tsx
```

### Deviations (all structural — zero code quality issues)

| Issue | Details |
|---|---|
| Missing barrel exports | No `index.ts` in root, birthday/, wedding/, holidays/, shared/, or holidays/scenes/ |
| Flat types file | `types.ts` at root — should be `types/index.ts` |

### What is already compliant (do not change)
- All files ≤ 115 lines ✅
- No `console.*` usage ✅
- No `any` types ✅
- All `@/` aliases ✅
- Named exports throughout ✅
- Proper `"use client"` directives ✅
- Tests exist for utilities ✅

### Callers to update

| File | Current import | Updated import |
|---|---|---|
| `src/components/templates/registry.ts:27` | `./interactive-events/birthday/BirthdayCandlesInteractive` | `./interactive-events/birthday` |
| `src/components/templates/registry.ts:28` | `./interactive-events/wedding/WeddingGlassInteractive` | `./interactive-events/wedding` |
| `src/components/templates/registry.ts:29-36` | `./interactive-events/holidays/HolidayWrappers` | `./interactive-events/holidays` |
| `src/components/templates/index.ts:33` | `./interactive-events/birthday/BirthdayCandlesInteractive` | `./interactive-events/birthday` |
| `src/components/templates/index.ts:34` | `./interactive-events/wedding/WeddingGlassInteractive` | `./interactive-events/wedding` |
| `src/components/templates/index.ts:35-42` | `./interactive-events/holidays/HolidayWrappers` | `./interactive-events/holidays` |
| `src/components/editor/configs/interactive-events.ts:2` | `@/components/templates/interactive-events/holidays/holiday-config` | `@/components/templates/interactive-events/holidays` |

> `editor/configs/interactive-events.ts:3` imports `HolidayInteractiveSlug` from `@/components/templates/interactive-events/types` — this path resolves to `types.ts` today and will resolve to `types/index.ts` after migration automatically. **No change needed.**

---

## Target State

```
interactive-events/
├── index.ts                        ← NEW
├── types/
│   └── index.ts                    ← MOVED from types.ts (identical content)
├── interactive-registry.test.ts    ← unchanged
├── birthday/
│   ├── index.ts                    ← NEW
│   ├── BirthdayCandlesInteractive.tsx
│   ├── BirthdayFlame.tsx
│   ├── BirthdayRevealOverlay.tsx
│   ├── candle-utils.ts
│   └── candle-utils.test.ts
├── holidays/
│   ├── index.ts                    ← NEW
│   ├── HolidayCardFrame.tsx
│   ├── HolidayInteractiveCard.tsx
│   ├── HolidayRevealOverlay.tsx
│   ├── HolidayScene.tsx
│   ├── HolidayWrappers.tsx
│   ├── holiday-config.ts
│   ├── holiday-config.test.ts
│   ├── holiday-scene-types.ts
│   └── scenes/
│       ├── index.ts                ← NEW
│       ├── FrameSequenceScene.tsx
│       ├── HanukkahScene.tsx
│       ├── HolidayAssetLayer.tsx
│       ├── HolidayReferenceLayer.tsx
│       ├── PassoverScene.tsx
│       ├── PurimScene.tsx
│       ├── RoshHashanahScene.tsx
│       ├── ShavuotScene.tsx
│       └── SukkotScene.tsx
├── shared/
│   ├── index.ts                    ← NEW
│   ├── GreetingReveal.tsx
│   └── InteractiveShell.tsx
└── wedding/
    ├── index.ts                    ← NEW
    ├── WeddingGlassInteractive.tsx
    └── WeddingRevealOverlay.tsx
```

---

## Affected Files

**Create (7 files):**
- `client/src/components/templates/interactive-events/index.ts`
- `client/src/components/templates/interactive-events/types/index.ts`
- `client/src/components/templates/interactive-events/birthday/index.ts`
- `client/src/components/templates/interactive-events/wedding/index.ts`
- `client/src/components/templates/interactive-events/holidays/index.ts`
- `client/src/components/templates/interactive-events/shared/index.ts`
- `client/src/components/templates/interactive-events/holidays/scenes/index.ts`

**Delete (1 file):**
- `client/src/components/templates/interactive-events/types.ts`

**Modify (3 files):**
- `client/src/components/templates/registry.ts`
- `client/src/components/templates/index.ts`
- `client/src/components/editor/configs/interactive-events.ts`

---

## Migration Order

Tasks from smallest scope to largest, each independently verifiable:

1. scenes/index.ts (deepest level, no dependents inside the module)
2. shared/index.ts
3. birthday/index.ts
4. wedding/index.ts
5. holidays/index.ts (depends on nothing in the module changing)
6. types/ restructure (delete types.ts, create types/index.ts)
7. root interactive-events/index.ts
8. Update registry.ts callers
9. Update templates/index.ts callers
10. Update editor/configs/interactive-events.ts caller
11. Run type-check + lint
12. Run tests
13. Visual browser verification

---

## Tasks

### Task 1: Create `holidays/scenes/index.ts` barrel

**Files:**
- Create: `client/src/components/templates/interactive-events/holidays/scenes/index.ts`

- [ ] **Step 1: Create the barrel file**

```typescript
export { FrameSequenceScene } from "./FrameSequenceScene";
export { HanukkahScene } from "./HanukkahScene";
export { HolidayAssetLayer } from "./HolidayAssetLayer";
export { HolidayReferenceLayer } from "./HolidayReferenceLayer";
export { PassoverScene } from "./PassoverScene";
export { PurimScene } from "./PurimScene";
export { RoshHashanahScene } from "./RoshHashanahScene";
export { ShavuotScene } from "./ShavuotScene";
export { SukkotScene } from "./SukkotScene";
```

- [ ] **Step 2: Verify TypeScript accepts the new file**

Run from `d:\HeartNote\client\`:
```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: same errors as before (if any); no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/interactive-events/holidays/scenes/index.ts
git commit -m "feat(interactive-events): add barrel export for holidays/scenes"
```

---

### Task 2: Create `shared/index.ts` barrel

**Files:**
- Create: `client/src/components/templates/interactive-events/shared/index.ts`

- [ ] **Step 1: Create the barrel file**

Only `InteractiveShell` is consumed externally (by birthday/, wedding/, holidays/ via their own relative imports — and potentially by future callers). `GreetingReveal` is currently unused externally; omit from public barrel.

```typescript
export { InteractiveShell } from "./InteractiveShell";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/interactive-events/shared/index.ts
git commit -m "feat(interactive-events): add barrel export for shared"
```

---

### Task 3: Create `birthday/index.ts` barrel

**Files:**
- Create: `client/src/components/templates/interactive-events/birthday/index.ts`

- [ ] **Step 1: Create the barrel file**

Only `BirthdayCandlesInteractive` is consumed externally. `BirthdayFlame`, `BirthdayRevealOverlay`, and `candle-utils` are internal implementation details with no external callers.

```typescript
export { BirthdayCandlesInteractive } from "./BirthdayCandlesInteractive";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/interactive-events/birthday/index.ts
git commit -m "feat(interactive-events): add barrel export for birthday"
```

---

### Task 4: Create `wedding/index.ts` barrel

**Files:**
- Create: `client/src/components/templates/interactive-events/wedding/index.ts`

- [ ] **Step 1: Create the barrel file**

```typescript
export { WeddingGlassInteractive } from "./WeddingGlassInteractive";
export { WeddingRevealOverlay } from "./WeddingRevealOverlay";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/interactive-events/wedding/index.ts
git commit -m "feat(interactive-events): add barrel export for wedding"
```

---

### Task 5: Create `holidays/index.ts` barrel

**Files:**
- Create: `client/src/components/templates/interactive-events/holidays/index.ts`

- [ ] **Step 1: Create the barrel file**

External callers consume: the 6 wrapper components (via `registry.ts`), `HOLIDAY_INTERACTIVE_CONFIGS` (via `editor/configs/interactive-events.ts`), and `HOLIDAY_INTERACTIVE_SLUGS` (via `holiday-config.test.ts`). Internal components (`HolidayInteractiveCard`, `HolidayCardFrame`, `HolidayRevealOverlay`, `HolidayScene`) are not exported.

```typescript
export {
  HolidayRoshHashanahInteractive,
  HolidayPassoverInteractive,
  HolidayPurimInteractive,
  HolidayShavuotInteractive,
  HolidaySukkotInteractive,
  HolidayHanukkahInteractive,
} from "./HolidayWrappers";
export { HOLIDAY_INTERACTIVE_CONFIGS, HOLIDAY_INTERACTIVE_SLUGS } from "./holiday-config";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/interactive-events/holidays/index.ts
git commit -m "feat(interactive-events): add barrel export for holidays"
```

---

### Task 6: Restructure `types.ts` into `types/index.ts`

**Files:**
- Create: `client/src/components/templates/interactive-events/types/index.ts`
- Delete: `client/src/components/templates/interactive-events/types.ts`

- [ ] **Step 1: Create `types/index.ts` with the same content as `types.ts`**

```typescript
export interface InteractiveGreetingData {
  recipientName?: string;
  senderName?: string;
  greetingTitle?: string;
  message?: string;
  signature?: string;
}

export interface BirthdayInteractiveData extends InteractiveGreetingData {
  recipientAge?: number;
}

export interface WeddingInteractiveData {
  coupleNames?: string;
  senderName?: string;
  greetingTitle?: string;
  message?: string;
}

export type HolidayInteractiveSlug =
  | "holiday-rosh-hashanah-interactive"
  | "holiday-passover-interactive"
  | "holiday-purim-interactive"
  | "holiday-shavuot-interactive"
  | "holiday-sukkot-interactive"
  | "holiday-hanukkah-interactive";

export type HolidayInteraction =
  | "honey"
  | "matzah"
  | "mask"
  | "bloom"
  | "sukkah"
  | "hanukkah";

export interface HolidayInteractiveConfig {
  slug: HolidayInteractiveSlug;
  componentKey: string;
  name: string;
  galleryTitle: string;
  galleryDescription: string;
  defaultTitle: string;
  revealLine: string;
  prompt: string;
  accent: string;
  interaction: HolidayInteraction;
}
```

- [ ] **Step 2: Verify type-check (both files exist simultaneously — confirm no conflict)**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: TypeScript error about ambiguous module resolution (two paths resolve to `types`). If so, proceed immediately to Step 3 to delete the old file.

- [ ] **Step 3: Delete the old `types.ts`**

```bash
Remove-Item "client/src/components/templates/interactive-events/types.ts"
```

- [ ] **Step 4: Verify type-check resolves cleanly**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: no errors from this change. All existing imports like `from "../types"` and `from "@/components/templates/interactive-events/types"` continue to resolve to `types/index.ts` automatically.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/templates/interactive-events/types/index.ts
git add client/src/components/templates/interactive-events/types.ts
git commit -m "refactor(interactive-events): move types.ts to types/index.ts"
```

---

### Task 7: Create root `interactive-events/index.ts` barrel

**Files:**
- Create: `client/src/components/templates/interactive-events/index.ts`

- [ ] **Step 1: Create the barrel file**

```typescript
export { BirthdayCandlesInteractive } from "./birthday";
export { WeddingGlassInteractive } from "./wedding";
export {
  HolidayRoshHashanahInteractive,
  HolidayPassoverInteractive,
  HolidayPurimInteractive,
  HolidayShavuotInteractive,
  HolidaySukkotInteractive,
  HolidayHanukkahInteractive,
} from "./holidays";
export type {
  InteractiveGreetingData,
  BirthdayInteractiveData,
  WeddingInteractiveData,
  HolidayInteractiveSlug,
  HolidayInteraction,
  HolidayInteractiveConfig,
} from "./types";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/interactive-events/index.ts
git commit -m "feat(interactive-events): add root barrel export"
```

---

### Task 8: Update `registry.ts` — use barrel imports

**Files:**
- Modify: `client/src/components/templates/registry.ts` (lines 27–36)

- [ ] **Step 1: Replace the three deep-path imports with barrel imports**

Find this block (lines 27–36):
```typescript
import { BirthdayCandlesInteractive } from "./interactive-events/birthday/BirthdayCandlesInteractive";
import { WeddingGlassInteractive } from "./interactive-events/wedding/WeddingGlassInteractive";
import {
  HolidayHanukkahInteractive,
  HolidayPassoverInteractive,
  HolidayPurimInteractive,
  HolidayRoshHashanahInteractive,
  HolidayShavuotInteractive,
  HolidaySukkotInteractive,
} from "./interactive-events/holidays/HolidayWrappers";
```

Replace with:
```typescript
import { BirthdayCandlesInteractive } from "./interactive-events/birthday";
import { WeddingGlassInteractive } from "./interactive-events/wedding";
import {
  HolidayHanukkahInteractive,
  HolidayPassoverInteractive,
  HolidayPurimInteractive,
  HolidayRoshHashanahInteractive,
  HolidayShavuotInteractive,
  HolidaySukkotInteractive,
} from "./interactive-events/holidays";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/registry.ts
git commit -m "refactor(registry): use barrel imports for interactive-events"
```

---

### Task 9: Update `templates/index.ts` — use barrel exports

**Files:**
- Modify: `client/src/components/templates/index.ts` (lines 33–42)

- [ ] **Step 1: Replace the three deep-path exports with barrel exports**

Find this block (lines 33–42):
```typescript
export { BirthdayCandlesInteractive } from "./interactive-events/birthday/BirthdayCandlesInteractive";
export { WeddingGlassInteractive } from "./interactive-events/wedding/WeddingGlassInteractive";
export {
  HolidayHanukkahInteractive,
  HolidayPassoverInteractive,
  HolidayPurimInteractive,
  HolidayRoshHashanahInteractive,
  HolidayShavuotInteractive,
  HolidaySukkotInteractive,
} from "./interactive-events/holidays/HolidayWrappers";
```

Replace with:
```typescript
export { BirthdayCandlesInteractive } from "./interactive-events/birthday";
export { WeddingGlassInteractive } from "./interactive-events/wedding";
export {
  HolidayHanukkahInteractive,
  HolidayPassoverInteractive,
  HolidayPurimInteractive,
  HolidayRoshHashanahInteractive,
  HolidayShavuotInteractive,
  HolidaySukkotInteractive,
} from "./interactive-events/holidays";
```

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/index.ts
git commit -m "refactor(templates): use barrel exports for interactive-events"
```

---

### Task 10: Update `editor/configs/interactive-events.ts` — use barrel import

**Files:**
- Modify: `client/src/components/editor/configs/interactive-events.ts` (line 2)

- [ ] **Step 1: Replace the deep-path import with barrel import**

Find line 2:
```typescript
import { HOLIDAY_INTERACTIVE_CONFIGS } from "@/components/templates/interactive-events/holidays/holiday-config";
```

Replace with:
```typescript
import { HOLIDAY_INTERACTIVE_CONFIGS } from "@/components/templates/interactive-events/holidays";
```

Leave line 3 unchanged:
```typescript
import type { HolidayInteractiveSlug } from "@/components/templates/interactive-events/types";
```
This import already resolves correctly to `types/index.ts` via TypeScript folder resolution — no change needed.

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/editor/configs/interactive-events.ts
git commit -m "refactor(editor-configs): use barrel import for interactive-events holidays"
```

---

### Task 11: Full validation

- [ ] **Step 1: Type-check — must pass with zero errors**

Run from `d:\HeartNote\client\`:
```bash
npm run type-check
```
Expected: `Found 0 errors.`

- [ ] **Step 2: Lint — must pass with zero warnings/errors**

```bash
npm run lint
```
Expected: `✔ No ESLint warnings or errors`

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```
Expected: all tests pass including `interactive-registry.test.ts`, `candle-utils.test.ts`, `holiday-config.test.ts`.

- [ ] **Step 4: Build check**

```bash
npm run build
```
Expected: successful build with no errors.

---

### Task 12: Visual browser verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify each interactive template loads correctly**

Open each of these URLs and confirm the template renders and interacts identically to before migration:

| Template | URL |
|---|---|
| Birthday Candles Interactive | `http://localhost:3000/create/birthday-candles-interactive` |
| Wedding Glass Interactive | `http://localhost:3000/create/wedding-glass-interactive` |
| Rosh Hashanah Interactive | `http://localhost:3000/create/holiday-rosh-hashanah-interactive` |
| Passover Interactive | `http://localhost:3000/create/holiday-passover-interactive` |
| Purim Interactive | `http://localhost:3000/create/holiday-purim-interactive` |
| Shavuot Interactive | `http://localhost:3000/create/holiday-shavuot-interactive` |
| Sukkot Interactive | `http://localhost:3000/create/holiday-sukkot-interactive` |
| Hanukkah Interactive | `http://localhost:3000/create/holiday-hanukkah-interactive` |

For each template: click the interaction element, confirm animation plays, confirm greeting card reveals correctly.

---

## Risks & Edge Cases

| Risk | Mitigation |
|---|---|
| TypeScript resolves `types.ts` and `types/index.ts` ambiguously during Task 6 | Both files should not coexist; delete `types.ts` immediately after creating `types/index.ts` |
| `candle-utils.ts` exports — barrel may not match actual export names | Read `candle-utils.ts` before Task 3 and confirm function names: `getBirthdayCandlePlan`, `normalizeBirthdayAge`, `isValidBirthdayAge` |
| `interactive-registry.test.ts` reads `registry.ts` as text | Test checks for component key names in the file — these remain in the TEMPLATE_REGISTRY object, so test still passes |
| Asset path in `RoshHashanahScene.tsx` has spaces: `rh- 1.svg` | This is a **separate pre-existing bug**, not introduced by migration. Do NOT fix during migration. File a separate issue. |
| `GreetingReveal.tsx` appears unused | Do NOT delete during migration. Zero-scope-creep rule: structural migration only. |

## Rollback

Each task is committed independently. To roll back a single task:
```bash
git revert HEAD
```

To roll back all migration work:
```bash
git log --oneline  # find the commit before migration started
git revert <hash>..HEAD
```

---

## Post-Execution Checklist

Append to `d:\HeartNote\.claude\plans\logs\migrate-interactive-events-templates-<timestamp>.log`:

```markdown
## Post-Execution Checklist — migrate-interactive-events-templates — <timestamp>

### Structure
- [ ] `index.ts` barrel added to: interactive-events/, birthday/, wedding/, holidays/, shared/, holidays/scenes/
- [ ] `types.ts` deleted; `types/index.ts` created with identical content
- [ ] No file exceeds 150 lines

### Code Quality
- [ ] TypeScript: zero `any`, all return types explicit (unchanged from pre-migration)
- [ ] No raw `console.*` (unchanged from pre-migration)
- [ ] All imports use `@/*` aliases

### Callers Updated
- [ ] `registry.ts` — 3 imports now use barrel paths
- [ ] `templates/index.ts` — 3 exports now use barrel paths
- [ ] `editor/configs/interactive-events.ts` — 1 import now uses barrel path

### Validation
- [ ] `npm run type-check` — zero errors
- [ ] `npm run lint` — zero warnings/errors
- [ ] `npx vitest run` — all tests pass
- [ ] `npm run build` — successful build
- [ ] Visual verification — all 8 interactive templates render and interact correctly

### Git
- [ ] Working on `dev` branch only
- [ ] No changes to `main`
- [ ] Each task committed separately for easy rollback

### Plan
- [ ] Plan log written to `.claude/plans/logs/migrate-interactive-events-templates-<timestamp>.log`
- [ ] All checklist items verified ✅
```
