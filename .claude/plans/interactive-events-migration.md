# Interactive Events Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all 8 interactive-event template directories (plus 3 shared dirs) out of `interactive-events/` and place them directly under `templates/`, adding Desktop/Mobile viewport wrappers to each template.

**Architecture:** Templates are moved flat to `templates/<Name>/`, shared infrastructure moves to `templates/shared/` and `templates/holidays-shared/`, and interactive types are merged into the existing `templates/types.ts`. Each template gains thin Desktop/Mobile wrappers using `useMediaQuery("(max-width: 768px)")` matching the SurpriseGift pattern. External imports in registry.ts, index.ts, and editor/configs are updated to drop the `interactive-events/` path segment.

**Tech Stack:** Next.js 14, TypeScript strict, Tailwind CSS, Framer Motion, `@/` path aliases, Vitest

---

## Context

`interactive-events/` is a grouping directory that adds an extra path segment to 8 templates. The rest of the codebase (13 other templates) lives flat under `templates/`. This migration flattens the structure for consistency and adds the Desktop/Mobile layout pattern every other template already has.

---

## File Map — What Moves Where

### Shared infrastructure (no Desktop/Mobile, no structural change)

| Source | Destination | Import changes |
|--------|-------------|----------------|
| `interactive-events/shared/InteractiveShell.tsx` | `templates/shared/InteractiveShell.tsx` | None (uses `@/` alias only) |
| `interactive-events/shared/GreetingReveal.tsx` | `templates/shared/GreetingReveal.tsx` | None |
| `interactive-events/shared/index.ts` | `templates/shared/index.ts` | None |
| `interactive-events/types/index.ts` | **Merged into** `templates/types.ts` | N/A — content appended |
| `interactive-events/holidays-shared/*` (15 files) | `templates/holidays-shared/*` | `"../../types"` → `"../types"` |
| `interactive-events/interactive-registry.test.ts` | `templates/interactive-registry.test.ts` | None |

### 8 templates — new structure per template

```
templates/<Name>/
├── types/
│   └── index.ts        ← re-exports relevant types from ../types
├── components/
│   ├── <Sub>.tsx       ← existing sub-components, unchanged
│   ├── <Name>Core.tsx  ← BirthdayCandles + WeddingGlass only: extracted logic
│   └── index.ts
├── utils/              ← BirthdayCandlesInteractive only
│   ├── candle-utils.ts
│   └── candle-utils.test.ts
├── Desktop/
│   └── <Name>Desktop.tsx  ← thin wrapper: renders Core or HolidayInteractiveCard
├── Mobile/
│   └── <Name>Mobile.tsx   ← thin wrapper: renders Core or HolidayInteractiveCard
├── <Name>.tsx          ← root: useMediaQuery → Desktop or Mobile
└── index.ts            ← barrel: export { <Name> }
```

### External files updated (not moved)

| File | Change |
|------|--------|
| `templates/registry.ts` | 8 imports: remove `interactive-events/` prefix |
| `templates/index.ts` | 8 exports: remove `interactive-events/` prefix |
| `editor/configs/interactive-events.ts` | 2 absolute imports: update to new paths |
| `templates/types.ts` | Append 6 interfaces/types from interactive-events/types/index.ts |

---

## Import Change Rules (applied everywhere)

| Old pattern | New pattern | Reason |
|------------|-------------|--------|
| `"../../types"` (TemplateComponentProps) | `"../types"` | Template is now one level shallower |
| `"../types"` (BirthdayInteractiveData etc.) | `"../types"` | Unchanged — now resolves to templates/types.ts after merge |
| `"../shared/..."` | `"../shared/..."` | Unchanged — shared/ moved to templates/shared/ |
| `"../holidays-shared/..."` | `"../holidays-shared/..."` | Unchanged — holidays-shared/ moved to templates/ |
| `@/components/templates/interactive-events/holidays-shared` | `@/components/templates/holidays-shared` | Absolute alias |
| `@/components/templates/interactive-events/types` | `@/components/templates/types` | Absolute alias |

---

## Task 1: Merge interactive types into templates/types.ts

**Files:**
- Modify: `client/src/components/templates/types.ts`
- Delete later: `client/src/components/templates/interactive-events/types/index.ts`

- [ ] **Step 1: Append interactive types to templates/types.ts**

Open `client/src/components/templates/types.ts` and append after the last line:

```typescript
// =============================================================================
// INTERACTIVE EVENTS — shared greeting data
// =============================================================================
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

- [ ] **Step 2: Run type-check to confirm no regressions**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

Expected: same errors as before (none related to types.ts).

- [ ] **Step 3: Commit**

```bash
git add client/src/components/templates/types.ts
git commit -m "feat: merge interactive-events types into templates/types.ts"
```

---

## Task 2: Create templates/shared/ directory

**Files:**
- Create: `client/src/components/templates/shared/InteractiveShell.tsx`
- Create: `client/src/components/templates/shared/GreetingReveal.tsx`
- Create: `client/src/components/templates/shared/index.ts`

- [ ] **Step 1: Copy InteractiveShell.tsx (no import changes needed)**

The file uses only `@/components/templates/components` (absolute alias) — copy verbatim:

```powershell
New-Item -ItemType Directory -Path "client\src\components\templates\shared" -Force
Copy-Item "client\src\components\templates\interactive-events\shared\InteractiveShell.tsx" `
          "client\src\components\templates\shared\InteractiveShell.tsx"
```

- [ ] **Step 2: Copy GreetingReveal.tsx**

```powershell
Copy-Item "client\src\components\templates\interactive-events\shared\GreetingReveal.tsx" `
          "client\src\components\templates\shared\GreetingReveal.tsx"
```

- [ ] **Step 3: Copy shared/index.ts**

```powershell
Copy-Item "client\src\components\templates\interactive-events\shared\index.ts" `
          "client\src\components\templates\shared\index.ts"
```

- [ ] **Step 4: Confirm files exist**

```powershell
Get-ChildItem "client\src\components\templates\shared"
```

Expected: 3 files (GreetingReveal.tsx, InteractiveShell.tsx, index.ts).

---

## Task 3: Create templates/holidays-shared/ directory

**Files:**
- Create: `client/src/components/templates/holidays-shared/` (15 files from interactive-events/holidays-shared/)

- [ ] **Step 1: Copy the entire holidays-shared directory**

```powershell
Copy-Item -Recurse `
  "client\src\components\templates\interactive-events\holidays-shared" `
  "client\src\components\templates\holidays-shared"
```

- [ ] **Step 2: Fix `"../../types"` import in HolidayInteractiveCard.tsx**

In `client/src/components/templates/holidays-shared/HolidayInteractiveCard.tsx`, change:

```typescript
// OLD
import type { HolidayInteractiveSlug, InteractiveGreetingData } from "../types";
import type { TemplateComponentProps } from "../../types";

// NEW
import type { HolidayInteractiveSlug, InteractiveGreetingData, TemplateComponentProps } from "../types";
```

- [ ] **Step 3: Run type-check**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

Expected: 0 new errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/templates/shared/ client/src/components/templates/holidays-shared/
git commit -m "feat: copy shared and holidays-shared to templates root level"
```

---

## Task 4: Migrate BirthdayCandlesInteractive

**Files to create under `templates/BirthdayCandlesInteractive/`:**
- `types/index.ts`
- `components/BirthdayFlame.tsx` (copied)
- `components/BirthdayRevealOverlay.tsx` (copied)
- `components/BirthdayCandlesCore.tsx` (extracted from root)
- `components/index.ts`
- `utils/candle-utils.ts` (copied)
- `utils/candle-utils.test.ts` (copied)
- `Desktop/BirthdayCandlesInteractiveDesktop.tsx`
- `Mobile/BirthdayCandlesInteractiveMobile.tsx`
- `BirthdayCandlesInteractive.tsx` (new root: viewport check)
- `index.ts`

- [ ] **Step 1: Create directory structure**

```powershell
$base = "client\src\components\templates\BirthdayCandlesInteractive"
New-Item -ItemType Directory "$base\types"       -Force
New-Item -ItemType Directory "$base\components"  -Force
New-Item -ItemType Directory "$base\utils"       -Force
New-Item -ItemType Directory "$base\Desktop"     -Force
New-Item -ItemType Directory "$base\Mobile"      -Force
```

- [ ] **Step 2: Create types/index.ts**

```typescript
// client/src/components/templates/BirthdayCandlesInteractive/types/index.ts
export type { BirthdayInteractiveData } from "@/components/templates/types";
```

- [ ] **Step 3: Copy sub-components (no import changes — they use relative ./)**

```powershell
$src = "client\src\components\templates\interactive-events\BirthdayCandlesInteractive\components"
$dst = "client\src\components\templates\BirthdayCandlesInteractive\components"
Copy-Item "$src\BirthdayFlame.tsx"         "$dst\BirthdayFlame.tsx"
Copy-Item "$src\BirthdayRevealOverlay.tsx" "$dst\BirthdayRevealOverlay.tsx"
Copy-Item "$src\index.ts"                  "$dst\index.ts"
```

- [ ] **Step 4: Copy utils/**

```powershell
$src = "client\src\components\templates\interactive-events\BirthdayCandlesInteractive\utils"
$dst = "client\src\components\templates\BirthdayCandlesInteractive\utils"
Copy-Item "$src\candle-utils.ts"      "$dst\candle-utils.ts"
Copy-Item "$src\candle-utils.test.ts" "$dst\candle-utils.test.ts"
```

- [ ] **Step 5: Create BirthdayCandlesCore.tsx** (exact content from old root, imports updated)

```typescript
// client/src/components/templates/BirthdayCandlesInteractive/components/BirthdayCandlesCore.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InteractiveShell } from "@/components/templates/shared/InteractiveShell";
import { BirthdayFlame } from "./BirthdayFlame";
import { BirthdayRevealOverlay } from "./BirthdayRevealOverlay";
import { getBirthdayCandlePlan } from "../utils/candle-utils";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesCore({
  data,
}: TemplateComponentProps<BirthdayInteractiveData>) {
  const reduceMotion = Boolean(useReducedMotion());
  const plan = useMemo(() => getBirthdayCandlePlan(data.recipientAge), [data.recipientAge]);
  const [lit, setLit] = useState<boolean[]>(() => Array(plan.candleCount).fill(true));
  const [showGreeting, setShowGreeting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setLit(Array(plan.candleCount).fill(true));
    setShowGreeting(false);
  }, [plan.candleCount]);

  useEffect(() => {
    if (lit.every((item) => !item) && !showGreeting) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      if (reduceMotion) {
        setShowGreeting(true);
      } else {
        timers.current.push(setTimeout(() => setShowGreeting(true), 800));
      }
    }
    return () => timers.current.forEach(clearTimeout);
  }, [lit, showGreeting, reduceMotion]);

  const blowCandle = (index: number) => {
    setLit((current) => current.map((item, i) => (i === index ? false : item)));
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShowGreeting(false);
    setLit(Array(plan.candleCount).fill(true));
  };

  const title = data.greetingTitle || `יום הולדת שמח${data.recipientName ? `, ${data.recipientName}` : ""}`;

  return (
    <InteractiveShell title={title} instruction="לחצו על הלהבות כדי לכבות את הנרות">
      <div className="relative aspect-square w-full max-w-sm overflow-visible">
        <motion.div
          className="relative flex w-full flex-col items-center"
          animate={reduceMotion ? {} : { y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {plan.showAgeNumber && (
            <div className="absolute top-0 z-20 text-5xl font-black leading-none text-[#1b263b] drop-shadow-[0_3px_0_rgba(212,130,111,0.24)] dark:text-white">
              {plan.age}
            </div>
          )}
          <div className="relative mt-12 w-full max-w-[500px] sm:max-w-[1000px]">
            <div
              className="absolute left-1/2 z-10 flex -translate-x-1/2 justify-center gap-1 overflow-visible"
              style={{ top: "clamp(30px, 1%, 30px)", width: `${Math.min(92, 32 + plan.candleCount * 6)}%` }}
            >
              {lit.map((isLit, index) => (
                <BirthdayFlame
                  key={index}
                  index={index}
                  isLit={isLit}
                  reduceMotion={reduceMotion}
                  onClick={() => blowCandle(index)}
                />
              ))}
            </div>
            <Image
              src="/assets/images/birthday-interactive/birthday-cake.svg"
              alt="עוגת יום הולדת חגיגית"
              width={384}
              height={384}
              priority={false}
              className="mx-auto h-auto w-full drop-shadow-2xl"
            />
          </div>
        </motion.div>
        <AnimatePresence>
          {showGreeting && <BirthdayRevealOverlay data={data} onReplay={replay} />}
        </AnimatePresence>
      </div>
    </InteractiveShell>
  );
}
```

- [ ] **Step 6: Create Desktop/BirthdayCandlesInteractiveDesktop.tsx**

```typescript
// client/src/components/templates/BirthdayCandlesInteractive/Desktop/BirthdayCandlesInteractiveDesktop.tsx
"use client";

import { BirthdayCandlesCore } from "../components/BirthdayCandlesCore";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesInteractiveDesktop(
  props: TemplateComponentProps<BirthdayInteractiveData>,
) {
  return <BirthdayCandlesCore {...props} />;
}
```

- [ ] **Step 7: Create Mobile/BirthdayCandlesInteractiveMobile.tsx**

```typescript
// client/src/components/templates/BirthdayCandlesInteractive/Mobile/BirthdayCandlesInteractiveMobile.tsx
"use client";

import { BirthdayCandlesCore } from "../components/BirthdayCandlesCore";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesInteractiveMobile(
  props: TemplateComponentProps<BirthdayInteractiveData>,
) {
  return <BirthdayCandlesCore {...props} />;
}
```

- [ ] **Step 8: Create root BirthdayCandlesInteractive.tsx (viewport check)**

```typescript
// client/src/components/templates/BirthdayCandlesInteractive/BirthdayCandlesInteractive.tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BirthdayCandlesInteractiveDesktop } from "./Desktop/BirthdayCandlesInteractiveDesktop";
import { BirthdayCandlesInteractiveMobile } from "./Mobile/BirthdayCandlesInteractiveMobile";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesInteractive(
  props: TemplateComponentProps<BirthdayInteractiveData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <BirthdayCandlesInteractiveMobile {...props} />
    : <BirthdayCandlesInteractiveDesktop {...props} />;
}
```

- [ ] **Step 9: Create index.ts barrel**

```typescript
// client/src/components/templates/BirthdayCandlesInteractive/index.ts
export { BirthdayCandlesInteractive } from "./BirthdayCandlesInteractive";
```

- [ ] **Step 10: Run type-check**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

Expected: 0 new errors.

- [ ] **Step 11: Commit**

```bash
git add client/src/components/templates/BirthdayCandlesInteractive/
git commit -m "feat: migrate BirthdayCandlesInteractive to templates root with Desktop/Mobile wrappers"
```

---

## Task 5: Migrate WeddingGlassInteractive

**Files to create under `templates/WeddingGlassInteractive/`:**
- `types/index.ts`, `components/WeddingRevealOverlay.tsx`, `components/WeddingGlassCore.tsx`, `components/index.ts`, `Desktop/`, `Mobile/`, root + barrel

- [ ] **Step 1: Create directory structure**

```powershell
$base = "client\src\components\templates\WeddingGlassInteractive"
New-Item -ItemType Directory "$base\types"      -Force
New-Item -ItemType Directory "$base\components" -Force
New-Item -ItemType Directory "$base\Desktop"    -Force
New-Item -ItemType Directory "$base\Mobile"     -Force
```

- [ ] **Step 2: Create types/index.ts**

```typescript
// client/src/components/templates/WeddingGlassInteractive/types/index.ts
export type { WeddingInteractiveData } from "@/components/templates/types";
```

- [ ] **Step 3: Copy WeddingRevealOverlay.tsx**

```powershell
$src = "client\src\components\templates\interactive-events\WeddingGlassInteractive\components"
$dst = "client\src\components\templates\WeddingGlassInteractive\components"
Copy-Item "$src\WeddingRevealOverlay.tsx" "$dst\WeddingRevealOverlay.tsx"
```

- [ ] **Step 4: Create components/index.ts**

```typescript
// client/src/components/templates/WeddingGlassInteractive/components/index.ts
export { WeddingRevealOverlay } from "./WeddingRevealOverlay";
export { WeddingGlassCore } from "./WeddingGlassCore";
```

- [ ] **Step 5: Create WeddingGlassCore.tsx** (extracted from old root, imports updated)

```typescript
// client/src/components/templates/WeddingGlassInteractive/components/WeddingGlassCore.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InteractiveShell } from "@/components/templates/shared/InteractiveShell";
import { WeddingRevealOverlay } from "./WeddingRevealOverlay";
import type { WeddingInteractiveData, TemplateComponentProps } from "@/components/templates/types";

const FRAMES = [
  "/assets/images/wedding-interactive/wedding-1.svg",
  "/assets/images/wedding-interactive/wedding-2.svg",
  "/assets/images/wedding-interactive/wedding-3.svg",
] as const;

export function WeddingGlassCore({
  data,
}: TemplateComponentProps<WeddingInteractiveData>) {
  const reduceMotion = Boolean(useReducedMotion());
  const [frame, setFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!started) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduceMotion) {
      setFrame(2);
      timers.current.push(setTimeout(() => setShowGreeting(true), 260));
      return;
    }
    timers.current.push(setTimeout(() => setFrame(1), 620));
    timers.current.push(setTimeout(() => setFrame(2), 1240));
    timers.current.push(setTimeout(() => setShowGreeting(true), 1900));
    return () => timers.current.forEach(clearTimeout);
  }, [started, reduceMotion]);

  const start = () => {
    if (started) return;
    setShowGreeting(false);
    setStarted(true);
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStarted(false);
    setShowGreeting(false);
    setFrame(0);
  };

  return (
    <InteractiveShell
      title={data.greetingTitle || data.coupleNames || "מזל טוב לזוג האהוב"}
      instruction="לחצו כדי להפעיל את רגע החתונה"
    >
      <div className="relative aspect-square w-full max-w-md overflow-visible">
        {!started && (
          <button
            type="button"
            onClick={start}
            className="absolute inset-0 z-10 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
            aria-label="הפעילו את רגע החתונה"
          />
        )}
        {FRAMES.map((src, index) => (
          <motion.img
            key={src}
            src={src}
            alt={index === frame ? "איור חתונה אינטראקטיבי" : ""}
            aria-hidden={index !== frame}
            className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl"
            initial={false}
            animate={{
              opacity: index === frame ? (showGreeting ? 0.62 : 1) : 0,
              scale: index === frame ? (showGreeting ? 1.025 : 1) : 0.985,
              y: index === frame ? 0 : 6,
            }}
            transition={{ duration: reduceMotion ? 0.12 : 0.56, ease: "easeInOut" }}
          />
        ))}
        <AnimatePresence>
          {showGreeting && <WeddingRevealOverlay data={data} onReplay={replay} />}
        </AnimatePresence>
      </div>
      {!started && (
        <button
          type="button"
          onClick={start}
          className="rounded-full bg-[#d4826f] px-6 py-3 text-sm font-bold text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b263b]"
        >
          להפעיל את הרגע
        </button>
      )}
    </InteractiveShell>
  );
}
```

- [ ] **Step 6: Create Desktop/WeddingGlassInteractiveDesktop.tsx**

```typescript
// client/src/components/templates/WeddingGlassInteractive/Desktop/WeddingGlassInteractiveDesktop.tsx
"use client";

import { WeddingGlassCore } from "../components/WeddingGlassCore";
import type { WeddingInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function WeddingGlassInteractiveDesktop(
  props: TemplateComponentProps<WeddingInteractiveData>,
) {
  return <WeddingGlassCore {...props} />;
}
```

- [ ] **Step 7: Create Mobile/WeddingGlassInteractiveMobile.tsx**

```typescript
// client/src/components/templates/WeddingGlassInteractive/Mobile/WeddingGlassInteractiveMobile.tsx
"use client";

import { WeddingGlassCore } from "../components/WeddingGlassCore";
import type { WeddingInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function WeddingGlassInteractiveMobile(
  props: TemplateComponentProps<WeddingInteractiveData>,
) {
  return <WeddingGlassCore {...props} />;
}
```

- [ ] **Step 8: Create root WeddingGlassInteractive.tsx**

```typescript
// client/src/components/templates/WeddingGlassInteractive/WeddingGlassInteractive.tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WeddingGlassInteractiveDesktop } from "./Desktop/WeddingGlassInteractiveDesktop";
import { WeddingGlassInteractiveMobile } from "./Mobile/WeddingGlassInteractiveMobile";
import type { WeddingInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function WeddingGlassInteractive(
  props: TemplateComponentProps<WeddingInteractiveData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <WeddingGlassInteractiveMobile {...props} />
    : <WeddingGlassInteractiveDesktop {...props} />;
}
```

- [ ] **Step 9: Create index.ts**

```typescript
// client/src/components/templates/WeddingGlassInteractive/index.ts
export { WeddingGlassInteractive } from "./WeddingGlassInteractive";
```

- [ ] **Step 10: Run type-check, commit**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

```bash
git add client/src/components/templates/WeddingGlassInteractive/
git commit -m "feat: migrate WeddingGlassInteractive to templates root with Desktop/Mobile wrappers"
```

---

## Task 6: Migrate 6 Holiday Templates (batch)

All 6 holiday templates are structurally identical — each is a thin delegator passing `slug` to `HolidayInteractiveCard`. This task creates all 6 in one batch.

**Templates:** HolidayRoshHashanahInteractive, HolidayPassoverInteractive, HolidayPurimInteractive, HolidayShavuotInteractive, HolidaySukkotInteractive, HolidayHanukkahInteractive

**Slugs:**
- `HolidayRoshHashanahInteractive` → `"holiday-rosh-hashanah-interactive"`
- `HolidayPassoverInteractive` → `"holiday-passover-interactive"`
- `HolidayPurimInteractive` → `"holiday-purim-interactive"`
- `HolidayShavuotInteractive` → `"holiday-shavuot-interactive"`
- `HolidaySukkotInteractive` → `"holiday-sukkot-interactive"`
- `HolidayHanukkahInteractive` → `"holiday-hanukkah-interactive"`

**Pattern files (replace `HolidayHanukkahInteractive` + slug with the correct values for each):**

- [ ] **Step 1: Create directories for all 6 templates**

```powershell
$names = @(
  "HolidayRoshHashanahInteractive",
  "HolidayPassoverInteractive",
  "HolidayPurimInteractive",
  "HolidayShavuotInteractive",
  "HolidaySukkotInteractive",
  "HolidayHanukkahInteractive"
)
foreach ($name in $names) {
  $base = "client\src\components\templates\$name"
  New-Item -ItemType Directory "$base\types"      -Force
  New-Item -ItemType Directory "$base\components" -Force
  New-Item -ItemType Directory "$base\Desktop"    -Force
  New-Item -ItemType Directory "$base\Mobile"     -Force
}
```

- [ ] **Step 2: Create types/index.ts for each holiday template**

Same content for all 6 (they all use `InteractiveGreetingData`):

```typescript
// client/src/components/templates/<Name>/types/index.ts
export type { InteractiveGreetingData } from "@/components/templates/types";
```

- [ ] **Step 3: Create components/index.ts for each (empty barrel)**

```typescript
// client/src/components/templates/<Name>/components/index.ts
// No sub-components — delegates entirely to holidays-shared
```

- [ ] **Step 4: Create Desktop wrapper for each holiday template**

Example for `HolidayHanukkahInteractive` (repeat for all 6 with the correct name and slug):

```typescript
// client/src/components/templates/HolidayHanukkahInteractive/Desktop/HolidayHanukkahInteractiveDesktop.tsx
"use client";

import { HolidayInteractiveCard } from "@/components/templates/holidays-shared/HolidayInteractiveCard";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayHanukkahInteractiveDesktop(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  return <HolidayInteractiveCard {...props} slug="holiday-hanukkah-interactive" />;
}
```

- [ ] **Step 5: Create Mobile wrapper for each holiday template**

```typescript
// client/src/components/templates/HolidayHanukkahInteractive/Mobile/HolidayHanukkahInteractiveMobile.tsx
"use client";

import { HolidayInteractiveCard } from "@/components/templates/holidays-shared/HolidayInteractiveCard";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayHanukkahInteractiveMobile(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  return <HolidayInteractiveCard {...props} slug="holiday-hanukkah-interactive" />;
}
```

- [ ] **Step 6: Create root component for each holiday template**

```typescript
// client/src/components/templates/HolidayHanukkahInteractive/HolidayHanukkahInteractive.tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayHanukkahInteractiveDesktop } from "./Desktop/HolidayHanukkahInteractiveDesktop";
import { HolidayHanukkahInteractiveMobile } from "./Mobile/HolidayHanukkahInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayHanukkahInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidayHanukkahInteractiveMobile {...props} />
    : <HolidayHanukkahInteractiveDesktop {...props} />;
}
```

- [ ] **Step 7: Create index.ts barrel for each holiday template**

```typescript
// client/src/components/templates/HolidayHanukkahInteractive/index.ts
export { HolidayHanukkahInteractive } from "./HolidayHanukkahInteractive";
```

- [ ] **Step 8: Run type-check**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

Expected: 0 new errors.

- [ ] **Step 9: Commit all 6 holiday templates**

```bash
git add client/src/components/templates/Holiday*
git commit -m "feat: migrate 6 holiday interactive templates to templates root with Desktop/Mobile wrappers"
```

---

## Task 7: Update external references

**Files to update:**
- `client/src/components/templates/registry.ts`
- `client/src/components/templates/index.ts`
- `client/src/components/editor/configs/interactive-events.ts`

- [ ] **Step 1: Update registry.ts — remove `interactive-events/` from 8 imports**

In `client/src/components/templates/registry.ts`, change lines 24–31 from:

```typescript
import { BirthdayCandlesInteractive } from "./interactive-events/BirthdayCandlesInteractive";
import { WeddingGlassInteractive } from "./interactive-events/WeddingGlassInteractive";
import { HolidayRoshHashanahInteractive } from "./interactive-events/HolidayRoshHashanahInteractive";
import { HolidayPassoverInteractive } from "./interactive-events/HolidayPassoverInteractive";
import { HolidayPurimInteractive } from "./interactive-events/HolidayPurimInteractive";
import { HolidayShavuotInteractive } from "./interactive-events/HolidayShavuotInteractive";
import { HolidaySukkotInteractive } from "./interactive-events/HolidaySukkotInteractive";
import { HolidayHanukkahInteractive } from "./interactive-events/HolidayHanukkahInteractive";
```

To:

```typescript
import { BirthdayCandlesInteractive } from "./BirthdayCandlesInteractive";
import { WeddingGlassInteractive } from "./WeddingGlassInteractive";
import { HolidayRoshHashanahInteractive } from "./HolidayRoshHashanahInteractive";
import { HolidayPassoverInteractive } from "./HolidayPassoverInteractive";
import { HolidayPurimInteractive } from "./HolidayPurimInteractive";
import { HolidayShavuotInteractive } from "./HolidayShavuotInteractive";
import { HolidaySukkotInteractive } from "./HolidaySukkotInteractive";
import { HolidayHanukkahInteractive } from "./HolidayHanukkahInteractive";
```

- [ ] **Step 2: Update templates/index.ts — remove `interactive-events/` from 8 exports**

In `client/src/components/templates/index.ts`, change lines 30–37 from:

```typescript
export { BirthdayCandlesInteractive } from "./interactive-events/BirthdayCandlesInteractive";
export { WeddingGlassInteractive } from "./interactive-events/WeddingGlassInteractive";
export { HolidayRoshHashanahInteractive } from "./interactive-events/HolidayRoshHashanahInteractive";
export { HolidayPassoverInteractive } from "./interactive-events/HolidayPassoverInteractive";
export { HolidayPurimInteractive } from "./interactive-events/HolidayPurimInteractive";
export { HolidayShavuotInteractive } from "./interactive-events/HolidayShavuotInteractive";
export { HolidaySukkotInteractive } from "./interactive-events/HolidaySukkotInteractive";
export { HolidayHanukkahInteractive } from "./interactive-events/HolidayHanukkahInteractive";
```

To:

```typescript
export { BirthdayCandlesInteractive } from "./BirthdayCandlesInteractive";
export { WeddingGlassInteractive } from "./WeddingGlassInteractive";
export { HolidayRoshHashanahInteractive } from "./HolidayRoshHashanahInteractive";
export { HolidayPassoverInteractive } from "./HolidayPassoverInteractive";
export { HolidayPurimInteractive } from "./HolidayPurimInteractive";
export { HolidayShavuotInteractive } from "./HolidayShavuotInteractive";
export { HolidaySukkotInteractive } from "./HolidaySukkotInteractive";
export { HolidayHanukkahInteractive } from "./HolidayHanukkahInteractive";
```

- [ ] **Step 3: Update editor/configs/interactive-events.ts — 2 absolute imports**

In `client/src/components/editor/configs/interactive-events.ts`, change lines 2–3 from:

```typescript
import { HOLIDAY_INTERACTIVE_CONFIGS } from "@/components/templates/interactive-events/holidays-shared";
import type { HolidayInteractiveSlug } from "@/components/templates/interactive-events/types";
```

To:

```typescript
import { HOLIDAY_INTERACTIVE_CONFIGS } from "@/components/templates/holidays-shared";
import type { HolidayInteractiveSlug } from "@/components/templates/types";
```

- [ ] **Step 4: Run type-check**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

Expected: 0 errors. All 8 templates now resolved from new locations.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/templates/registry.ts \
        client/src/components/templates/index.ts \
        client/src/components/editor/configs/interactive-events.ts
git commit -m "feat: update registry, barrel, and editor configs to use flat template paths"
```

---

## Task 8: Move interactive-registry.test.ts

- [ ] **Step 1: Copy test file**

```powershell
Copy-Item `
  "client\src\components\templates\interactive-events\interactive-registry.test.ts" `
  "client\src\components\templates\interactive-registry.test.ts"
```

The file uses only `@/` aliases and `process.cwd()` — no import changes needed.

- [ ] **Step 2: Run the test to confirm it passes**

```powershell
cd client; npx vitest run src/components/templates/interactive-registry.test.ts 2>&1
```

Expected: All 3 tests PASS.

---

## Task 9: Delete interactive-events/ directory

Only run this task after **all previous tasks pass type-check and tests**.

- [ ] **Step 1: Verify zero remaining references to `interactive-events`**

```powershell
Select-String -Recurse -Path "client\src" -Pattern "interactive-events" -Include "*.ts","*.tsx" | Select-Object Filename, LineNumber, Line
```

Expected: **No output.**

- [ ] **Step 2: Delete the directory**

```powershell
Remove-Item -Recurse -Force "client\src\components\templates\interactive-events"
```

- [ ] **Step 3: Run type-check again**

```powershell
cd client; npx tsc --noEmit 2>&1 | Select-Object -First 30
```

Expected: 0 errors.

- [ ] **Step 4: Run all tests**

```powershell
cd client; npx vitest run 2>&1 | Tail -20
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: delete interactive-events/ directory — migration complete"
```

---

## Task 10: Final verification

- [ ] **Step 1: Lint**

```powershell
cd client; npm run lint 2>&1 | Select-Object -Last 10
```

Expected: No errors.

- [ ] **Step 2: Production build**

```powershell
cd client; npm run build 2>&1 | Select-Object -Last 20
```

Expected: Compiled successfully.

- [ ] **Step 3: Grep — confirm zero references**

```powershell
Select-String -Recurse -Path "client\src" -Pattern "interactive-events" -Include "*.ts","*.tsx"
```

Expected: **No output.**

- [ ] **Step 4: Confirm new structure**

```powershell
Get-ChildItem "client\src\components\templates" -Directory | Select-Object Name | Sort-Object Name
```

Expected: All 8 interactive templates appear flat alongside the other 13 templates.

---

## Post-Execution Checklist

- [ ] All 8 templates migrated to `templates/<Name>/` with types/, components/, Desktop/, Mobile/ structure
- [ ] `templates/shared/` contains InteractiveShell.tsx + GreetingReveal.tsx
- [ ] `templates/holidays-shared/` contains all 15 holiday scene files
- [ ] `templates/types.ts` includes all interactive types
- [ ] `interactive-events/` directory deleted
- [ ] Zero grep hits for "interactive-events" in src/
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] All vitest tests pass
- [ ] All commits on `dev` branch only
