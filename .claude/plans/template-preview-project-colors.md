# Template Preview — Project Colors Alignment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every non-project color, inline hex value, and arbitrary Tailwind token in the 16 gallery template preview components with tokens from the HeartNote design system (coral, navy, primary, secondary scales).

**Architecture:** Each preview is an isolated `"use client"` component under `client/src/components/galleryTemplate/previews/`. Changes are purely cosmetic — layout and animation logic remain untouched. Tasks run file-by-file, smallest blast radius first.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS 3.4 with custom coral/navy/primary/secondary scales, Framer Motion 11.

---

## Design System Reference

Extracted from `tailwind.config.ts` and `globals.css`:

| Token | Example classes | Hex values |
|---|---|---|
| coral (brand warm) | `coral-50` … `coral-900` | 50:#fef7f5 100:#fdeee9 200:#fad5cc 300:#f5b5a5 400:#e8917a 500:#d4826f 600:#c4735f 700:#a35a49 800:#864a3d 900:#6e3f35 |
| navy (dark neutral) | `navy-50` … `navy-900` | 50:#f4f6f9 100:#e8ecf1 200:#c7d0dc 300:#94a5bb 400:#5f7794 500:#445a78 600:#374965 700:#2e3c52 800:#293445 900:#252d3b |
| primary (pink) | `primary-50` … `primary-900` | 50:#fdf2f8 100:#fce7f3 200:#fbcfe8 300:#f9a8d4 400:#f472b6 500:#ec4899 600:#db2777 700:#be185d 800:#9d174d 900:#831843 |
| secondary (purple) | `secondary-50` … `secondary-900` | 50:#f5f3ff 100:#ede9fe 200:#ddd6fe 300:#c4b5fd 400:#a78bfa 500:#8b5cf6 600:#7c3aed 700:#6d28d9 800:#5b21b6 900:#4c1d95 |

**Utility classes in globals.css:**
- `.gradient-coral` = `bg-gradient-to-r from-coral-400 to-coral-600`
- `.gradient-navy` = `bg-gradient-to-r from-navy-600 to-navy-800`

**Typography:** Headings = Playfair Display (loaded via `src/lib/fonts.ts`). Body = Heebo. Tailwind `font-sans` = Inter. Preview components inherit parent — no font-family changes needed.

**Compliant already (no changes):**
- `ExcuseGeneratorPreview.tsx` — uses `secondary-*` throughout ✓
- `TimelinePreview.tsx` — uses `coral-*` throughout ✓
- `RelationshipQuizPreview.tsx` — uses `coral-*`, neutral `stone-*` ✓
- `OpenWhenPreview.tsx` — uses `coral-*`, neutral `stone-*` ✓
- `ApologySearchPreview.tsx` — uses `coral-500` for cursor; stone for neutral UI ✓

---

## Task 1: BarBatMitzvahPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx`

**Violations found:**
- `style={{ background: "linear-gradient(135deg, #1b2a4a 0%, #2e3c52 100%)" }}` — inline hex
- `text-amber-400`, `text-amber-300`, `text-amber-100`, `text-amber-300/70` — non-project amber
- `border-amber-400/60`, `bg-amber-400/40`, `bg-amber-400` — non-project amber
- `style={{ color: "#1b2a4a" }}` — inline hex on CTA pill

**Mapping:** amber-* → coral-* (warm gold-adjacent); navy inline → `from-navy-900 to-navy-700` gradient class

- [ ] **Step 1: Replace BarBatMitzvahPreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

export function BarBatMitzvahPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-navy-900 to-navy-700">
        {/* Gold border frame */}
        <div className="absolute inset-[3px] rounded-md border border-coral-400/60 pointer-events-none z-10" />

        <div className="relative z-0 p-3 flex flex-col items-center gap-1.5">
          {/* Star of David */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-coral-400 text-[14px] leading-none"
          >
            ✡
          </motion.div>

          {/* Hebrew title */}
          <p className="text-[7px] font-bold text-coral-300 tracking-widest uppercase">
            בר מצווה
          </p>

          {/* Divider ornament */}
          <div className="flex items-center gap-1 w-full">
            <div className="flex-1 h-px bg-coral-400/40" />
            <span className="text-coral-400/60 text-[6px]">✦</span>
            <div className="flex-1 h-px bg-coral-400/40" />
          </div>

          {/* Name placeholder */}
          <p className="text-[8px] text-coral-100 font-semibold text-center leading-tight">
            נועם כהן
          </p>

          {/* Date & venue */}
          <p className="text-[5px] text-coral-300/70 text-center leading-relaxed">
            כ״ה אייר תשפ״ה
            <br />
            בית הכנסת המרכזי
          </p>

          {/* CTA pill */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-0.5 px-2 py-0.5 rounded-full bg-coral-400 text-navy-900 text-[5px] font-bold shadow-sm"
          >
            לברכה המיוחדת
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "amber\|#[0-9a-fA-F]\|style={{" client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx
git commit -m "style: align BarBatMitzvah preview to project design tokens"
```

---

## Task 2: WeddingGlassPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx`

**Violations found:**
- `style={{ background: "linear-gradient(160deg, #fdf8f0 0%, #f5ede0 100%)" }}` — inline hex background
- `border-rose-900/20` — rose (not project)
- `text-rose-900` — rose
- `text-amber-600` — amber
- `bg-amber-400/50` — amber
- `text-stone-500` — acceptable neutral, but can be navy-400 for consistency
- `style={{ background: "#9f1239" }}` — inline hex on CTA

**Mapping:** Background → `from-coral-50 to-coral-100`; rose → primary; amber → coral; CTA → `bg-primary-800`

- [ ] **Step 1: Replace WeddingGlassPreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg bg-gradient-to-b from-coral-50 to-coral-100">
        {/* Wine-red border accent */}
        <div className="absolute inset-0 border-2 border-primary-900/20 rounded-lg pointer-events-none" />

        <div className="relative p-3 flex flex-col items-center gap-1.5">
          {/* Broken glass SVG motif */}
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-10 h-10"
          >
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <line x1="30" y1="42" x2="30" y2="55" stroke="#9d174d" strokeWidth="2" />
              <line x1="22" y1="55" x2="38" y2="55" stroke="#9d174d" strokeWidth="2" />
              <path
                d="M 15,10 L 20,38 Q 30,44 40,38 L 45,10 Z"
                fill="none"
                stroke="#9d174d"
                strokeWidth="1.5"
              />
              <path d="M 15,10 L 22,18 L 18,10" fill="#9d174d" opacity="0.6" />
              <path d="M 38,13 L 34,20 L 45,10" fill="#9d174d" opacity="0.6" />
              <path
                d="M 20,28 Q 30,36 40,28 L 40,38 Q 30,44 20,38 Z"
                fill="#be185d"
                opacity="0.4"
              />
            </svg>
          </motion.div>

          {/* Couple names */}
          <div className="flex items-center gap-1 text-[7px] text-primary-900 font-semibold">
            <span>נועה</span>
            <span className="text-coral-500">❤</span>
            <span>יונתן</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-coral-400/50" />

          {/* Date & venue */}
          <p className="text-[5px] text-navy-400 text-center leading-relaxed">
            י״ב סיון תשפ״ה
            <br />
            אולמי גן עדן
          </p>

          {/* CTA */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="px-2 py-0.5 rounded-full text-[5px] font-bold text-white shadow bg-primary-800"
          >
            מזל טוב! 💍
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

**Note:** SVG `stroke` and `fill` use `primary-800` (#9d174d) and `primary-700` (#be185d) hex values — these are project token hex values, used inside SVG attributes (not Tailwind classes or style props on HTML elements).

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "rose\|amber\|#[0-9a-fA-F]\{6\}.*style\|style.*#[0-9a-fA-F]" client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx`
Expected: only SVG `stroke`/`fill` attributes (acceptable for SVG elements).

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx
git commit -m "style: align WeddingGlass preview to project design tokens"
```

---

## Task 3: BirthdayCandlesPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx`

**Violations found:**
- `CANDLE_COLORS` array of inline hex: `#f43f5e`, `#f59e0b`, `#8b5cf6`, `#06b6d4`, `#22c55e`
- `style={{ ..., backgroundColor: color, ... }}` — inline style with hex color
- `style={{ background: "radial-gradient(ellipse at 50% 80%, #fbbf24, #f97316, transparent)" }}` — flame gradient with amber/orange hex

**Mapping:** Replace JS hex array with Tailwind class array; replace flame gradient radial-gradient with project token hex values (coral-400, coral-700).

- [ ] **Step 1: Replace BirthdayCandlesPreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

const CANDLE_CLASSES = [
  "bg-coral-400",
  "bg-coral-500",
  "bg-secondary-400",
  "bg-primary-400",
  "bg-navy-400",
] as const;

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Candle row */}
        <div className="flex items-end gap-1.5">
          {CANDLE_CLASSES.map((cls, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <motion.div
                animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
                transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-2.5 rounded-full bg-gradient-to-t from-coral-700 via-coral-400 to-transparent"
                style={{ transformOrigin: "bottom center" }}
              />
              {/* Wick */}
              <div className="w-px h-1 bg-navy-300" />
              {/* Candle body */}
              <div
                className={`w-2.5 rounded-sm opacity-85 ${cls}`}
                style={{ height: `${14 + i * 2}px` }}
              />
            </div>
          ))}
        </div>

        {/* Mini cake */}
        <div className="w-20">
          <div className="h-2 bg-primary-100 rounded-t-full border border-primary-200" />
          <div className="h-5 bg-coral-50 border border-coral-200 flex items-center justify-center">
            <span className="text-[6px] text-coral-700 font-bold">יום הולדת שמח!</span>
          </div>
          <div className="h-1.5 bg-coral-200 rounded-b-sm border border-coral-200" />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[6px] text-coral-600 font-bold"
        >
          🎂 לחצו לכיבוי
        </motion.p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "style.*#\|#[0-9a-fA-F]\{3,6\}" client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx`
Expected: no matches (height px value in style is acceptable — not a color).

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx
git commit -m "style: align BirthdayCandles preview to project design tokens"
```

---

## Task 4: HolidayCardPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx`

**Violations found:**
- `style={{ backgroundColor: holiday.bg }}` — inline dynamic hex value
- HOLIDAYS array `bg` strings: `#fffbeb`, `#eff6ff`, `#fdf4ff`, `#fff1f2`

**Mapping:** Replace `bg` string with `bgClass` Tailwind class string. Holiday themes → project palette:
- Rosh Hashana (apple/honey/autumnal) → `bg-coral-50`
- Hanukkah (cool/blue) → `bg-navy-50`
- Purim (festive/purple) → `bg-secondary-50`
- Passover (wine/pink) → `bg-primary-50`

- [ ] **Step 1: Replace HolidayCardPreview.tsx**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HOLIDAYS = [
  { emoji: "🍎🍯", label: "ראש השנה", bgClass: "bg-coral-50" },
  { emoji: "🕎", label: "חנוכה", bgClass: "bg-navy-50" },
  { emoji: "🎭", label: "פורים", bgClass: "bg-secondary-50" },
  { emoji: "🍷", label: "פסח", bgClass: "bg-primary-50" },
] as const;

export function HolidayCardPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % HOLIDAYS.length), 2000);
    return () => clearInterval(timer);
  }, []);

  const holiday = HOLIDAYS[idx];

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] rounded-xl overflow-hidden shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col items-center gap-1.5 p-3 ${holiday.bgClass}`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl leading-none"
            >
              {holiday.emoji}
            </motion.div>
            <p className="text-[8px] font-bold text-navy-700 text-center">
              {holiday.label} שמח!
            </p>
            <div className="w-8 h-px bg-navy-300" />
            <p className="text-[5px] text-navy-400 text-center">חג בשמחה ובאהבה</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "style\|#[0-9a-fA-F]" client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx
git commit -m "style: align HolidayCard preview to project design tokens"
```

---

## Task 5: DecisionWheelPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx`

**Violations found:**
- `SEGMENTS` array with arbitrary external hex values: `#f43f5e`, `#f59e0b`, `#8b5cf6`, `#06b6d4`, `#22c55e`, `#f97316`
- `style={{ background: \`conic-gradient(...)\` }}` — necessary for spinning wheel, but hex must be project tokens

**Note:** The conic-gradient inline style cannot be avoided for the spinning wheel effect. The fix is to replace the arbitrary hex values with the exact hex values from the project's design token definitions (coral, navy, primary, secondary scales).

**Mapping:**
- `#f43f5e` (rose-500) → `#ec4899` (primary-500)
- `#f59e0b` (amber-500) → `#e8917a` (coral-400)
- `#8b5cf6` (violet-500) → `#8b5cf6` (secondary-500 — same value, stays)
- `#06b6d4` (cyan-500) → `#445a78` (navy-500)
- `#22c55e` (green-500) → `#d4826f` (coral-500)
- `#f97316` (orange-500) → `#f5b5a5` (coral-300)

- [ ] **Step 1: Replace DecisionWheelPreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

const SEGMENTS = [
  "#ec4899",  // primary-500
  "#e8917a",  // coral-400
  "#8b5cf6",  // secondary-500
  "#445a78",  // navy-500
  "#d4826f",  // coral-500
  "#f5b5a5",  // coral-300
];

const conicGradient = SEGMENTS.map(
  (color, i) =>
    `${color} ${(i / SEGMENTS.length) * 360}deg ${((i + 1) / SEGMENTS.length) * 360}deg`,
).join(", ");

export function DecisionWheelPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Pointer */}
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-navy-700 mb-[-2px]" />

        {/* Spinning wheel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16 rounded-full shadow-md border-2 border-navy-200"
          style={{ background: `conic-gradient(${conicGradient})` }}
        >
          {/* Center hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full border border-navy-300 shadow" />
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-navy-700 dark:text-navy-200 text-center">
          סובבו לגורל!
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify segments use only project token hex values**

Cross-check each hex in SEGMENTS against tailwind.config.ts token table above. All six values must appear in the table.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx
git commit -m "style: align DecisionWheel preview to project design tokens"
```

---

## Task 6: SlotMachinePreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx`

**Violations found:**
- `bg-stone-800`, `bg-stone-700`, `bg-stone-900`, `bg-stone-600`, `border-stone-600` — stone for machine casing
- `border-amber-400/50`, `border-amber-400/30`, `bg-amber-400`, `text-stone-900` — amber/stone

**Mapping:** stone (dark chrome) → navy; amber (accent) → coral

- [ ] **Step 1: Replace SlotMachinePreview.tsx**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SYMBOLS = ["🍒", "⭐", "🎰", "7️⃣", "💎", "🍋"];

function Reel({ delay }: { delay: number }) {
  const [symbolIdx, setSymbolIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setSymbolIdx((p) => (p + 1) % SYMBOLS.length),
      300 + delay * 100,
    );
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div className="w-7 h-8 bg-navy-900 rounded border border-coral-400/50 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={symbolIdx}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[14px] leading-none"
        >
          {SYMBOLS[symbolIdx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function SlotMachinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-navy-700 rounded-lg p-2 shadow-lg border border-navy-600">
          {/* Screen with reels */}
          <div className="bg-navy-900 rounded p-1.5 mb-1.5 flex gap-1 justify-center border border-coral-400/30">
            {[0, 1, 2].map((i) => (
              <Reel key={i} delay={i} />
            ))}
          </div>
          {/* Spin button */}
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 0.95, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-3 py-0.5 bg-coral-400 rounded text-[6px] font-bold text-navy-900 shadow"
            >
              🎰 סובבי!
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "stone\|amber\|#[0-9a-fA-F]" client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx
git commit -m "style: align SlotMachine preview to project design tokens"
```

---

## Task 7: PunchingBagPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx`

**Violations found:**
- `bg-red-700` — non-project red
- `style={{ background: "linear-gradient(180deg, #dc2626 0%, #991b1b 100%)" }}` — inline hex gradient
- `text-red-600` — non-project red

**Mapping:** red → coral (coral-700 for dark cap, coral-600/coral-800 gradient for bag, coral-600 for text)

- [ ] **Step 1: Replace PunchingBagPreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

export function PunchingBagPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-0.5">
        {/* Chain links */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-px h-2 bg-navy-300" />
        ))}

        {/* Bag */}
        <motion.div
          animate={{ rotate: [0, 14, -10, 7, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="flex flex-col items-center"
        >
          <div className="w-8 h-2 bg-coral-700 rounded-t-full" />
          <div className="w-10 h-12 rounded-b-full flex items-center justify-center shadow-lg bg-gradient-to-b from-coral-600 to-coral-800">
            <span className="text-[18px] mt-2">👊</span>
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-coral-600 text-center mt-1.5">
          🥊 שחרר לחץ!
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "red\|#[0-9a-fA-F]\|style.*background" client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx`
Expected: no matches (the `style={{ transformOrigin }}` is acceptable — not a color).

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx
git commit -m "style: align PunchingBag preview to project design tokens"
```

---

## Task 8: DateInvitePreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/DateInvitePreview.tsx`

**Violations found:**
- `style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)" }}` — inline hex
  - `#fdf2f8` = primary-50, `#fce7f3` = primary-100 (exact token values!)

**Mapping:** Replace inline style with `bg-gradient-to-br from-primary-50 to-primary-100`

- [ ] **Step 1: Replace DateInvitePreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

export function DateInvitePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="p-3 flex flex-col items-center gap-2">
          {/* Floating hearts */}
          <div className="flex gap-1 text-[10px]">
            {(["💕", "✨", "💕"] as const).map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
              >
                {e}
              </motion.span>
            ))}
          </div>

          <p className="text-[7px] font-bold text-primary-700 text-center">
            תצא/י איתי לדייט?
          </p>

          <div className="flex gap-1.5 w-full">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex-1 py-1 rounded-lg bg-primary-500 text-white text-[6px] font-bold text-center shadow"
            >
              כן! 💕
            </motion.div>
            <motion.div
              animate={{ x: [0, 6, -4, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex-1 py-1 rounded-lg bg-navy-100 text-navy-500 text-[6px] font-bold text-center"
            >
              לא
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "style.*background\|#[0-9a-fA-F]" client/src/components/galleryTemplate/previews/DateInvitePreview.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/DateInvitePreview.tsx
git commit -m "style: align DateInvite preview to project design tokens"
```

---

## Task 9: ScratchCardPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx`

**Violations found:**
- `bg-amber-50` — amber prize layer background
- `dark:bg-stone-700` — stone
- `text-amber-600` — amber
- `dark:text-amber-400` — amber
- `from-stone-300 to-stone-400` — stone scratch overlay
- `text-stone-600` — stone text on overlay
- `text-stone-500` — stone caption

**Mapping:** amber → coral; stone (scratch overlay) → navy

- [ ] **Step 1: Replace ScratchCardPreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

export function ScratchCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-md border border-navy-200 dark:border-navy-600">
          {/* Prize layer */}
          <div className="absolute inset-0 bg-coral-50 dark:bg-navy-700 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">🎁</p>
              <p className="text-[5px] font-bold text-coral-600 dark:text-coral-400 mt-0.5">פרס!</p>
            </div>
          </div>

          {/* Scratch overlay — partially revealed */}
          <motion.div
            initial={{ clipPath: "inset(0 0 0 0)" }}
            animate={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 100%, 55% 100%, 70% 40%, 25% 30%, 0 65%)",
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-navy-200 to-navy-300 flex items-center justify-center"
          >
            <p className="text-[6px] text-navy-600 font-bold">גרדו!</p>
          </motion.div>
        </div>

        <p className="text-[6px] text-navy-400 font-medium">גרדו לגלות</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "amber\|stone\|#[0-9a-fA-F]" client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx
git commit -m "style: align ScratchCard preview to project design tokens"
```

---

## Task 10: LoveCouponsPreview.tsx

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx`

**Violations found:**
- `text-green-600` — non-project green for the redeemed checkmark

**Mapping:** `text-green-600` → `text-secondary-600`

- [ ] **Step 1: Edit the single violation**

In `client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx`, line 32:

Change:
```tsx
<span className="text-[6px] text-green-600 font-bold">✓</span>
```
To:
```tsx
<span className="text-[6px] text-secondary-600 font-bold">✓</span>
```

- [ ] **Step 2: Verify no violations remain**

Run: `grep -n "green\|#[0-9a-fA-F]" client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx
git commit -m "style: align LoveCoupons preview to project design tokens"
```

---

## Task 11: Final Verification

**Files:** All 16 preview files (read-only verification).

- [ ] **Step 1: Type-check**

Run from `client/` directory:
```bash
npm run type-check
```
Expected: zero TypeScript errors.

- [ ] **Step 2: Lint**

Run from `client/` directory:
```bash
npm run lint
```
Expected: no ESLint errors or warnings in preview files.

- [ ] **Step 3: Build**

Run from `client/` directory:
```bash
npm run build
```
Expected: successful production build with no errors.

- [ ] **Step 4: Global color audit**

Run from `client/src/components/galleryTemplate/previews/`:
```bash
grep -rn "amber\|rose\|red-\|green-\|cyan-\|blue-\|orange-\|style.*#[0-9a-fA-F]\|#[0-9a-fA-F].*style" .
```
Expected: no matches (stone-* and dark:* neutrals are acceptable).

- [ ] **Step 5: Write post-execution checklist**

Write the checklist block to `.claude/plans/logs/template-preview-project-colors-<timestamp>.log`.

---

## Files Modified (Summary)

| File | Changes |
|---|---|
| `BarBatMitzvahPreview.tsx` | navy inline gradient → class; amber-* → coral-* |
| `WeddingGlassPreview.tsx` | inline bg gradient → class; rose/amber → primary/coral |
| `BirthdayCandlesPreview.tsx` | hex color array → Tailwind class array; flame gradient → coral gradient class |
| `HolidayCardPreview.tsx` | dynamic inline `backgroundColor` → dynamic Tailwind `bgClass` |
| `DecisionWheelPreview.tsx` | conic-gradient hex → project token hex values |
| `SlotMachinePreview.tsx` | stone/amber chrome → navy/coral |
| `PunchingBagPreview.tsx` | red inline gradient → coral gradient class |
| `DateInvitePreview.tsx` | inline primary-50/100 gradient → class |
| `ScratchCardPreview.tsx` | amber/stone → coral/navy |
| `LoveCouponsPreview.tsx` | `text-green-600` → `text-secondary-600` |
| No change needed | ExcuseGeneratorPreview, TimelinePreview, RelationshipQuizPreview, OpenWhenPreview, ApologySearchPreview |
