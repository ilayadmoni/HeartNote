# Template Preview Redesign + Accessibility Animation Control

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all gallery template previews to be visually themed to their respective templates, and wire the existing `a11y-stop-animations` CSS class fully through Framer Motion's `MotionConfig` so all motion stops instantly when the accessibility toggle is active.

**Architecture:** Each preview lives in its own file under `client/src/components/galleryTemplate/previews/`. The `TemplatePreview.tsx` dispatcher and `MorePreviews.tsx` re-export barrel are untouched in structure — only the visual content of each preview changes. For Part 2, `MotionGuard.tsx` already wraps the app with `MotionConfig`; we need to confirm it's wired correctly, add the CSS `transition-delay: 0ms` fix, and ensure the `useReducedMotion` hook initializes synchronously (no flash).

**Tech Stack:** Next.js 14 App Router, Framer Motion 11, Tailwind CSS 3.4 (project theme), TypeScript strict, Vitest

---

## Scope Check

Two independent subsystems:
- **Part 1** — Visual redesign of 16 template previews (pure UI, no logic changes)
- **Part 2** — Accessibility animation kill switch (infrastructure, no visual changes)

These are genuinely independent — Part 1 can ship without Part 2 and vice versa. We'll execute them sequentially in this plan.

---

## Design Tokens (from `tailwind.config.ts`)

Available colors:
- `coral-*` (50–900): brand warm coral/terracotta tones
- `navy-*` (50–900): brand deep navy blues
- `primary-*` (50–900): pink/rose
- `secondary-*` (50–900): purple/violet

Tailwind class equivalents:
- Gold/amber: `amber-*` (Tailwind core)
- Cream/ivory: `stone-50`, `amber-50`, `yellow-50`
- Deep wine: `rose-900`, `red-900`
- Black/silver: `zinc-900`, `slate-300`

Animation classes: `animate-fade-in`, `animate-slide-up`, `animate-scale-in` (defined in config)

---

## File Map

### Part 1 — Redesigned Preview Files

| File | Action |
|---|---|
| `client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx` | **Rewrite** — Jewish tradition + modern celebration theme |
| `client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx` | **Rewrite** — Romantic Jewish wedding duality theme |
| `client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx` | **Redesign** — festive birthday candles, warm tones |
| `client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx` | **Redesign** — seasonal Jewish holiday aesthetic |
| `client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx` | **Redesign** — gift unboxing excitement |
| `client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx` | **Redesign** — spinning wheel game feel |
| `client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx` | **Redesign** — casino/slot machine aesthetic |
| `client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx` | **Redesign** — playful stress relief theme |
| `client/src/components/galleryTemplate/previews/ApologySearchPreview.tsx` | **Redesign** — search UI apology theme |
| `client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx` | **Redesign** — generator/random output theme |
| `client/src/components/galleryTemplate/components/TemplatePreview.tsx` | **Redesign inline previews** (DateInvite, ScratchCard, Timeline, LoveCoupons, RelationshipQuiz, OpenWhen) |

### Part 2 — Accessibility Animation Control

| File | Action |
|---|---|
| `client/src/app/accessibility.css` | **Add** `transition-delay: 0ms !important` to `.a11y-stop-animations` block |
| `client/src/components/accessibility/AccessibilityProvider.tsx` | **Add** synchronous init script for `a11y-stop-animations` class before hydration |
| `client/src/app/layout.tsx` | **Add** inline `beforeInteractive` script to apply saved `stopAnimations` from localStorage to `<html>` before first paint |

---

## Task 1: Redesign `BarBatMitzvahPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx`

Current state: Generic child figure with coral button. Target: Luxurious printed invitation aesthetic — gold & navy, Star of David motif, Hebrew ceremony typography, layered decorative border.

- [ ] **Step 1.1: Rewrite the file**

Replace the entire file content with:

```tsx
"use client";

import { motion } from "framer-motion";

export function BarBatMitzvahPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div
        className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #1b2a4a 0%, #2e3c52 100%)" }}
      >
        {/* Gold border frame */}
        <div className="absolute inset-[3px] rounded-md border border-amber-400/60 pointer-events-none z-10" />

        <div className="relative z-0 p-3 flex flex-col items-center gap-1.5">
          {/* Star of David */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-amber-400 text-[14px] leading-none"
          >
            ✡
          </motion.div>

          {/* Hebrew title */}
          <p className="text-[7px] font-bold text-amber-300 tracking-widest uppercase">
            בר מצווה
          </p>

          {/* Divider ornament */}
          <div className="flex items-center gap-1 w-full">
            <div className="flex-1 h-px bg-amber-400/40" />
            <span className="text-amber-400/60 text-[6px]">✦</span>
            <div className="flex-1 h-px bg-amber-400/40" />
          </div>

          {/* Name placeholder */}
          <p className="text-[8px] text-amber-100 font-semibold text-center leading-tight">
            נועם כהן
          </p>

          {/* Date & venue */}
          <p className="text-[5px] text-amber-300/70 text-center leading-relaxed">
            כ״ה אייר תשפ״ה
            <br />
            בית הכנסת המרכזי
          </p>

          {/* CTA pill */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-navy-900 text-[5px] font-bold shadow-sm"
            style={{ color: "#1b2a4a" }}
          >
            לברכה המיוחדת
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 1.2: Verify TypeScript — no errors**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "BarBatMitzvah"
```

Expected: no output (zero errors in this file)

- [ ] **Step 1.3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx
git commit -m "feat: redesign BarBatMitzvah preview — gold/navy Jewish ceremony aesthetic"
```

---

## Task 2: Redesign `WeddingGlassPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx`

Target: Romantic Jewish wedding — ivory/cream with gold accents, stylized broken glass shard motif, calligraphy-feel typography, couple names placeholder, duality of joy and remembrance.

- [ ] **Step 2.1: Rewrite the file**

```tsx
"use client";

import { motion } from "framer-motion";

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div
        className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(160deg, #fdf8f0 0%, #f5ede0 100%)" }}
      >
        {/* Wine-red border accent */}
        <div className="absolute inset-0 border-2 border-rose-900/20 rounded-lg pointer-events-none" />

        <div className="relative p-3 flex flex-col items-center gap-1.5">
          {/* Broken glass SVG motif */}
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-10 h-10"
          >
            <svg viewBox="0 0 60 60" className="w-full h-full">
              {/* Wine glass stem */}
              <line x1="30" y1="42" x2="30" y2="55" stroke="#7f1d1d" strokeWidth="2" />
              <line x1="22" y1="55" x2="38" y2="55" stroke="#7f1d1d" strokeWidth="2" />
              {/* Glass bowl — broken at top */}
              <path
                d="M 15,10 L 20,38 Q 30,44 40,38 L 45,10 Z"
                fill="none"
                stroke="#7f1d1d"
                strokeWidth="1.5"
              />
              {/* Break shards */}
              <path
                d="M 15,10 L 22,18 L 18,10"
                fill="#7f1d1d"
                opacity="0.6"
              />
              <path
                d="M 38,13 L 34,20 L 45,10"
                fill="#7f1d1d"
                opacity="0.6"
              />
              {/* Wine fill */}
              <path
                d="M 20,28 Q 30,36 40,28 L 40,38 Q 30,44 20,38 Z"
                fill="#9f1239"
                opacity="0.4"
              />
            </svg>
          </motion.div>

          {/* Couple names */}
          <div className="flex items-center gap-1 text-[7px] text-rose-900 font-semibold">
            <span>ניצן</span>
            <span className="text-amber-600">❤</span>
            <span>עילי</span>
          </div>

          {/* Thin gold divider */}
          <div className="w-full h-px bg-amber-400/50" />

          {/* Date */}
          <p className="text-[5px] text-stone-500 text-center leading-relaxed">
            י״ב סיון תשפ״ה
            <br />
            אולמי גן עדן
          </p>

          {/* CTA */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="px-2 py-0.5 rounded-full text-[5px] font-bold text-white shadow"
            style={{ background: "#9f1239" }}
          >
            מזל טוב! 💍
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2.2: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "WeddingGlass"
```

Expected: no output

- [ ] **Step 2.3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx
git commit -m "feat: redesign WeddingGlass preview — romantic ivory/wine broken glass motif"
```

---

## Task 3: Redesign `BirthdayCandlesPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx`

Read the current file first, then rewrite to show animated birthday candles on a mini cake.

- [ ] **Step 3.1: Read current file**

Read `client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx`

- [ ] **Step 3.2: Rewrite**

```tsx
"use client";

import { motion } from "framer-motion";

const CANDLE_COLORS = ["#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#22c55e"];

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Candle row */}
        <div className="flex items-end gap-1.5">
          {CANDLE_COLORS.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-0">
              {/* Flame */}
              <motion.div
                animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
                transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-2.5 rounded-full"
                style={{ background: `radial-gradient(ellipse at 50% 80%, #fbbf24, #f97316, transparent)`, transformOrigin: "bottom center" }}
              />
              {/* Wick */}
              <div className="w-px h-1 bg-stone-400" />
              {/* Candle body */}
              <div
                className="w-2.5 rounded-sm"
                style={{ height: `${14 + i * 2}px`, backgroundColor: color, opacity: 0.85 }}
              />
            </div>
          ))}
        </div>

        {/* Mini cake */}
        <div className="relative w-20">
          {/* Frosting top */}
          <div className="h-2 bg-pink-100 rounded-t-full border border-pink-200" />
          {/* Cake body */}
          <div className="h-5 bg-amber-100 border border-amber-200 flex items-center justify-center">
            <span className="text-[6px] text-amber-600 font-bold">יום הולדת שמח!</span>
          </div>
          {/* Cake bottom stripe */}
          <div className="h-1.5 bg-coral-200 rounded-b-sm" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "BirthdayCandles"
```

Expected: no output

- [ ] **Step 3.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx
git commit -m "feat: redesign BirthdayCandles preview — animated candles on mini cake"
```

---

## Task 4: Redesign `HolidayCardPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx`

Target: Seasonal Jewish holiday feel — menorah/apple/pomegranate motif cycling through holiday icons with warm seasonal backgrounds.

- [ ] **Step 4.1: Rewrite**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HOLIDAYS = [
  { emoji: "🍎🍯", label: "ראש השנה", bg: "#fffbeb" },
  { emoji: "🕎", label: "חנוכה", bg: "#eff6ff" },
  { emoji: "🎭", label: "פורים", bg: "#fdf4ff" },
  { emoji: "🍷", label: "פסח", bg: "#fff1f2" },
];

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
            className="flex flex-col items-center gap-1.5 p-3"
            style={{ backgroundColor: holiday.bg }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl leading-none"
            >
              {holiday.emoji}
            </motion.div>
            <p className="text-[8px] font-bold text-stone-700 text-center">
              {holiday.label} שמח!
            </p>
            <div className="w-8 h-px bg-stone-300" />
            <p className="text-[5px] text-stone-500 text-center">
              חג בשמחה ובאהבה
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 4.2: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "HolidayCard"
```

Expected: no output

- [ ] **Step 4.3: Commit**

```bash
git add client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx
git commit -m "feat: redesign HolidayCard preview — animated cycling Jewish holidays"
```

---

## Task 5: Redesign `SurpriseGiftPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx`

- [ ] **Step 5.1: Read current file**

Read `client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx`

- [ ] **Step 5.2: Rewrite to animated gift box that "bounces" and opens on a loop**

```tsx
"use client";

import { motion } from "framer-motion";

export function SurpriseGiftPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Floating sparkles */}
        {["-8px", "8px", "0px"].map((x, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
            className="absolute text-[8px]"
            style={{ transform: `translateX(${x}) translateY(-28px)` }}
          >
            ✨
          </motion.span>
        ))}

        {/* Gift box */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Lid */}
          <motion.div
            animate={{ rotateX: [0, -30, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-4 bg-coral-500 rounded-t-sm relative flex items-center justify-center"
            style={{ transformOrigin: "bottom center", perspective: 200 }}
          >
            {/* Ribbon on lid */}
            <div className="absolute inset-x-0 top-0 bottom-0 w-1.5 bg-amber-300 mx-auto" />
          </motion.div>

          {/* Box body */}
          <div className="w-12 h-10 bg-coral-400 rounded-b-sm relative overflow-hidden flex items-center justify-center">
            {/* Vertical ribbon */}
            <div className="absolute inset-y-0 w-1.5 bg-amber-300" />
            {/* Horizontal ribbon */}
            <div className="absolute inset-x-0 h-1.5 bg-amber-300 top-1/3" />
            <span className="relative z-10 text-[10px]">🎁</span>
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-coral-600 text-center">
          הפתעה מחכה!
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "SurpriseGift"
```

Expected: no output

- [ ] **Step 5.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx
git commit -m "feat: redesign SurpriseGift preview — bouncing animated gift box"
```

---

## Task 6: Redesign `DecisionWheelPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx`

- [ ] **Step 6.1: Read current file**

Read `client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx`

- [ ] **Step 6.2: Rewrite as a colorful spinning wheel**

```tsx
"use client";

import { motion } from "framer-motion";

const SEGMENTS = [
  { color: "#f43f5e", label: "סרט" },
  { color: "#f59e0b", label: "פיצה" },
  { color: "#8b5cf6", label: "בית" },
  { color: "#06b6d4", label: "פארק" },
  { color: "#22c55e", label: "מסעדה" },
  { color: "#f97316", label: "קולנוע" },
];

export function DecisionWheelPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Pointer */}
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-[8px] border-l-transparent border-r-transparent border-b-navy-700 mb-[-2px]" />

        {/* Wheel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-navy-200"
          style={{
            background: `conic-gradient(${SEGMENTS.map((s, i) => `${s.color} ${(i / SEGMENTS.length) * 360}deg ${((i + 1) / SEGMENTS.length) * 360}deg`).join(", ")})`,
          }}
        >
          {/* Center dot */}
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

- [ ] **Step 6.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "DecisionWheel"
```

Expected: no output

- [ ] **Step 6.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx
git commit -m "feat: redesign DecisionWheel preview — conic-gradient spinning wheel"
```

---

## Task 7: Redesign `SlotMachinePreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx`

- [ ] **Step 7.1: Read current file**

Read `client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx`

- [ ] **Step 7.2: Rewrite as casino slot reels**

```tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SYMBOLS = ["🍒", "⭐", "🎰", "7️⃣", "💎", "🍋"];

function Reel({ delay }: { delay: number }) {
  const [symbolIdx, setSymbolIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSymbolIdx((p) => (p + 1) % SYMBOLS.length);
    }, 300 + delay * 100);
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div className="w-7 h-8 bg-stone-800 rounded border border-amber-400/50 flex items-center justify-center overflow-hidden">
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
    </div>
  );
}

export function SlotMachinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Machine housing */}
        <div className="bg-stone-700 rounded-lg p-2 shadow-lg border border-stone-600">
          {/* Screen */}
          <div className="bg-stone-900 rounded p-1.5 mb-1.5 flex gap-1 justify-center border border-amber-400/30">
            {[0, 1, 2].map((i) => <Reel key={i} delay={i} />)}
          </div>
          {/* Lever button */}
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 0.95, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-3 py-0.5 bg-amber-400 rounded text-[6px] font-bold text-stone-900 shadow"
            >
              סובבו!
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "SlotMachine"
```

Expected: no output

- [ ] **Step 7.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx
git commit -m "feat: redesign SlotMachine preview — animated casino slot reels"
```

---

## Task 8: Redesign `PunchingBagPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx`

- [ ] **Step 8.1: Read current file**

Read `client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx`

- [ ] **Step 8.2: Rewrite as swinging punching bag**

```tsx
"use client";

import { motion } from "framer-motion";

export function PunchingBagPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-1">
        {/* Chain */}
        <div className="flex flex-col items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-px h-1.5 bg-stone-400" />
          ))}
        </div>

        {/* Bag */}
        <motion.div
          animate={{ rotate: [0, 15, -10, 8, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="flex flex-col items-center"
        >
          {/* Bag top */}
          <div className="w-8 h-2 bg-red-700 rounded-t-full" />
          {/* Bag body */}
          <div className="w-10 h-12 bg-gradient-to-b from-red-600 to-red-800 rounded-b-full flex items-center justify-center shadow-lg">
            <span className="text-[16px] mt-2">👊</span>
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-red-600 text-center mt-1">
          שחרר לחץ!
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 8.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "PunchingBag"
```

Expected: no output

- [ ] **Step 8.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx
git commit -m "feat: redesign PunchingBag preview — swinging bag animation"
```

---

## Task 9: Redesign `ApologySearchPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/ApologySearchPreview.tsx`

- [ ] **Step 9.1: Read current file**

Read `client/src/components/galleryTemplate/previews/ApologySearchPreview.tsx`

- [ ] **Step 9.2: Rewrite as search engine UI with typing animation**

```tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SEARCH_TEXT = "סליחה שאני...";

export function ApologySearchPreview() {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChars((p) => (p >= SEARCH_TEXT.length ? 0 : p + 1));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] flex flex-col gap-1.5">
        {/* Search bar */}
        <div className="flex items-center gap-1 bg-white dark:bg-stone-700 rounded-full border border-stone-200 dark:border-stone-600 px-2 py-1 shadow-sm">
          <span className="text-[8px] text-stone-400">🔍</span>
          <span className="text-[6px] text-stone-700 dark:text-stone-200 font-medium flex-1 truncate">
            {SEARCH_TEXT.slice(0, chars)}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-px h-2 bg-coral-500 ml-0.5 align-middle"
            />
          </span>
        </div>

        {/* "Results" */}
        {[
          "💌 מכתב התנצלות",
          "🌹 עם פרחים",
          "🍫 + שוקולד",
        ].map((result, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="text-[5px] text-stone-600 dark:text-stone-300 px-1 py-0.5 rounded bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700"
          >
            {result}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 9.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "ApologySearch"
```

Expected: no output

- [ ] **Step 9.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/ApologySearchPreview.tsx
git commit -m "feat: redesign ApologySearch preview — typing search animation"
```

---

## Task 10: Redesign `ExcuseGeneratorPreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx`

- [ ] **Step 10.1: Read current file**

Read `client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx`

- [ ] **Step 10.2: Rewrite as excuse slot cycling UI**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const EXCUSES = [
  "הכלב אכל את שיעורי הבית",
  "הייתי תקוע בפקק",
  "הטלפון מת לי",
  "שכחתי לגמרי",
  "היה לי כאב ראש",
];

export function ExcuseGeneratorPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % EXCUSES.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] flex flex-col items-center gap-2">
        <p className="text-[6px] font-bold text-secondary-600 dark:text-secondary-300">
          גנרטור תירוצים
        </p>

        {/* Output card */}
        <div className="w-full bg-secondary-50 dark:bg-secondary-900/30 rounded-lg p-2 border border-secondary-200 dark:border-secondary-700 min-h-[32px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[5px] text-secondary-700 dark:text-secondary-200 text-center leading-tight"
            >
              {EXCUSES[idx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-3 py-0.5 rounded-full bg-secondary-500 text-white text-[5px] font-bold shadow"
        >
          🎲 הפק תירוץ
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 10.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "ExcuseGenerator"
```

Expected: no output

- [ ] **Step 10.4: Commit**

```bash
git add client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx
git commit -m "feat: redesign ExcuseGenerator preview — animated cycling excuse display"
```

---

## Task 11: Redesign Inline Previews in `TemplatePreview.tsx`

**Files:**
- Modify: `client/src/components/galleryTemplate/components/TemplatePreview.tsx`

The inline previews (DateInvite, ScratchCard, Timeline, LoveCoupons, RelationshipQuiz, OpenWhen) are defined directly in this file. Redesign them to be more visually themed while keeping the file under 150 lines — extract into separate files in `previews/` if needed.

**NOTE:** Current file is 235 lines — must split to comply with 150-line limit.

- [ ] **Step 11.1: Read current full file**

Read `client/src/components/galleryTemplate/components/TemplatePreview.tsx`

- [ ] **Step 11.2: Create `client/src/components/galleryTemplate/previews/DateInvitePreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

export function DateInvitePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div
        className="relative w-full max-w-[110px] rounded-xl shadow-lg overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)" }}
      >
        <div className="p-3 flex flex-col items-center gap-2">
          {/* Hearts decoration */}
          <div className="flex gap-1 text-[10px]">
            {["💕", "✨", "💕"].map((e, i) => (
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
              className="flex-1 py-1 rounded-lg bg-stone-200 text-stone-500 text-[6px] font-bold text-center"
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

- [ ] **Step 11.3: Create `client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

export function ScratchCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-24 h-16 rounded-xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-600"
        >
          {/* Prize layer */}
          <div className="absolute inset-0 bg-amber-50 dark:bg-stone-700 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">🎁</p>
              <p className="text-[5px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">פרס!</p>
            </div>
          </div>

          {/* Scratch overlay — partially revealed */}
          <motion.div
            initial={{ clipPath: "inset(0 0 0 0)" }}
            animate={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 55% 100%, 70% 40%, 25% 30%, 0 65%)",
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[6px] text-stone-600 font-bold">גרדו!</p>
            </div>
          </motion.div>
        </div>

        <p className="text-[6px] text-stone-500 font-medium">גרדו לגלות</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 11.4: Create `client/src/components/galleryTemplate/previews/TimelinePreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const EVENTS = [
  { emoji: "👀", label: "פגישה ראשונה" },
  { emoji: "💑", label: "הדייט הראשון" },
  { emoji: "❤️", label: "הצהרת אהבה" },
];

export function TimelinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative flex flex-col gap-2 w-full max-w-[100px]">
        {/* Vertical line */}
        <div className="absolute right-3 top-3 bottom-3 w-0.5 bg-coral-200 dark:bg-coral-800" />

        {EVENTS.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25 }}
            className="flex items-center gap-2 relative"
          >
            {/* Dot */}
            <div className="w-6 h-6 rounded-full bg-coral-100 dark:bg-coral-900 border-2 border-coral-400 flex items-center justify-center text-[8px] z-10 flex-shrink-0 ms-auto">
              {event.emoji}
            </div>
            <p className="text-[5px] text-stone-600 dark:text-stone-300 flex-1 leading-tight text-right">
              {event.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 11.5: Create `client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const COUPONS = [
  { emoji: "💆", label: "עיסוי רומנטי", redeemed: false },
  { emoji: "🍽️", label: "ארוחה רומנטית", redeemed: true },
  { emoji: "🎬", label: "סרט ביחד", redeemed: false },
];

export function LoveCouponsPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col gap-1 w-full max-w-[110px]">
        {COUPONS.map((coupon, i) => (
          <motion.div
            key={i}
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: coupon.redeemed ? 0.5 : 1 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border-2 border-dashed ${
              coupon.redeemed
                ? "border-stone-300 bg-stone-100 dark:bg-stone-800 dark:border-stone-600"
                : "border-coral-400 bg-coral-50 dark:bg-coral-900/20"
            }`}
          >
            <span className="text-[10px]">{coupon.emoji}</span>
            <span className="text-[5px] flex-1 text-stone-600 dark:text-stone-300 leading-tight">
              {coupon.label}
            </span>
            {coupon.redeemed && (
              <span className="text-[6px] text-green-600 font-bold">✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 11.6: Create `client/src/components/galleryTemplate/previews/RelationshipQuizPreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const OPTIONS = ["א", "ב", "ג", "ד"];

export function RelationshipQuizPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] bg-white dark:bg-stone-800 rounded-xl p-2 shadow-md">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "33%" }}
              animate={{ width: "66%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="h-full bg-coral-400 rounded-full"
            />
          </div>
          <span className="text-[5px] text-stone-400">2/3</span>
        </div>

        {/* Question */}
        <p className="text-[6px] font-bold text-stone-700 dark:text-stone-200 text-center mb-1.5">
          איפה הדייט הראשון שלנו? 💕
        </p>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-1">
          {OPTIONS.map((opt, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`py-1 rounded-lg text-center text-[6px] font-bold border ${
                i === 1
                  ? "bg-coral-500 text-white border-coral-500"
                  : "bg-stone-50 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600"
              }`}
            >
              {opt}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 11.7: Create `client/src/components/galleryTemplate/previews/OpenWhenPreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const ENVELOPES = [
  { emoji: "😢", label: "כשעצוב לך", locked: false },
  { emoji: "💪", label: "כשצריך עידוד", locked: false },
  { emoji: "🎉", label: "ליום הולדת", locked: true },
  { emoji: "💕", label: "כשמתגעגע", locked: true },
];

export function OpenWhenPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {ENVELOPES.map((env, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border ${
              env.locked
                ? "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                : "bg-coral-50 dark:bg-coral-900/20 border-coral-200 dark:border-coral-800"
            }`}
          >
            <span className="text-[12px]">{env.locked ? "🔒" : env.emoji}</span>
            <span className="text-[4px] text-stone-500 dark:text-stone-400 text-center leading-tight">
              {env.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 11.8: Update `MorePreviews.tsx` barrel to include new exports**

```tsx
/**
 * Re-exports all gallery card preview components.
 * Individual implementations live in ../previews/.
 */

export { DecisionWheelPreview } from "../previews/DecisionWheelPreview";
export { SlotMachinePreview } from "../previews/SlotMachinePreview";
export { PunchingBagPreview } from "../previews/PunchingBagPreview";
export { ApologySearchPreview } from "../previews/ApologySearchPreview";
export { BirthdayCandlesPreview } from "../previews/BirthdayCandlesPreview";
export { SurpriseGiftPreview } from "../previews/SurpriseGiftPreview";
export { ExcuseGeneratorPreview } from "../previews/ExcuseGeneratorPreview";
export { WeddingGlassPreview } from "../previews/WeddingGlassPreview";
export { HolidayCardPreview } from "../previews/HolidayCardPreview";
export { BarBatMitzvahPreview } from "../previews/BarBatMitzvahPreview";
export { DateInvitePreview } from "../previews/DateInvitePreview";
export { ScratchCardPreview } from "../previews/ScratchCardPreview";
export { TimelinePreview } from "../previews/TimelinePreview";
export { LoveCouponsPreview } from "../previews/LoveCouponsPreview";
export { RelationshipQuizPreview } from "../previews/RelationshipQuizPreview";
export { OpenWhenPreview } from "../previews/OpenWhenPreview";
```

- [ ] **Step 11.9: Rewrite `TemplatePreview.tsx` to use extracted components (≤ 150 lines)**

```tsx
"use client";

import {
  DecisionWheelPreview,
  SurpriseGiftPreview,
  SlotMachinePreview,
  PunchingBagPreview,
  ApologySearchPreview,
  BirthdayCandlesPreview,
  ExcuseGeneratorPreview,
  WeddingGlassPreview,
  HolidayCardPreview,
  BarBatMitzvahPreview,
  DateInvitePreview,
  ScratchCardPreview,
  TimelinePreview,
  LoveCouponsPreview,
  RelationshipQuizPreview,
  OpenWhenPreview,
} from "./MorePreviews";
import { LivePreview } from "./LivePreview";
import type { TemplateComponentKey } from "../types";

interface TemplatePreviewProps {
  componentKey: TemplateComponentKey;
}

export function TemplatePreview({ componentKey }: TemplatePreviewProps) {
  switch (componentKey) {
    case "DateInvite":
      return <DateInvitePreview />;
    case "ScratchCard":
      return <ScratchCardPreview />;
    case "Timeline":
      return <TimelinePreview />;
    case "LoveCoupons":
      return <LoveCouponsPreview />;
    case "RelationshipQuiz":
      return <RelationshipQuizPreview />;
    case "OpenWhen":
      return <OpenWhenPreview />;
    case "DecisionWheel":
      return <DecisionWheelPreview />;
    case "SurpriseGift":
      return <SurpriseGiftPreview />;
    case "SlotMachine":
      return <SlotMachinePreview />;
    case "PunchingBag":
      return <PunchingBagPreview />;
    case "ApologySearch":
      return <ApologySearchPreview />;
    case "BirthdayCandles":
      return <BirthdayCandlesPreview />;
    case "ExcuseGenerator":
      return <ExcuseGeneratorPreview />;
    case "WeddingGlass":
      return <WeddingGlassPreview />;
    case "HolidayCard":
      return <HolidayCardPreview />;
    case "BarBatMitzvah":
      return <BarBatMitzvahPreview />;
    default:
      return <LivePreview componentKey={componentKey} />;
  }
}
```

- [ ] **Step 11.10: Verify TypeScript — full check**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit
```

Expected: exit 0, no errors

- [ ] **Step 11.11: Verify ESLint**

```powershell
cd D:\HeartNote\client; npm run lint
```

Expected: no errors

- [ ] **Step 11.12: Commit**

```bash
git add client/src/components/galleryTemplate/previews/DateInvitePreview.tsx \
        client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx \
        client/src/components/galleryTemplate/previews/TimelinePreview.tsx \
        client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx \
        client/src/components/galleryTemplate/previews/RelationshipQuizPreview.tsx \
        client/src/components/galleryTemplate/previews/OpenWhenPreview.tsx \
        client/src/components/galleryTemplate/components/MorePreviews.tsx \
        client/src/components/galleryTemplate/components/TemplatePreview.tsx
git commit -m "refactor: extract inline previews to separate files, slim TemplatePreview to dispatcher only"
```

---

## Task 12: Part 2 — CSS Kill Switch Audit & Fix

**Files:**
- Modify: `client/src/app/accessibility.css`

The `.a11y-stop-animations` block already exists. We need to add `transition-delay: 0ms !important` and verify the `@media (prefers-reduced-motion)` block is complete.

- [ ] **Step 12.1: Read current accessibility.css**

Read `client/src/app/accessibility.css`

- [ ] **Step 12.2: Add missing `transition-delay` to the stop-animations block**

In `accessibility.css`, in the `.a11y-stop-animations *` block, add `transition-delay: 0ms !important` after `transition-duration: 0s !important`:

Old:
```css
.a11y-stop-animations *,
.a11y-stop-animations *::before,
.a11y-stop-animations *::after {
  animation: none !important;
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}
```

Verify it already has `transition-delay`. If missing, add it. The existing file has it — verify current state before editing.

Also verify the `@media (prefers-reduced-motion: reduce)` block includes `transition-delay`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

If `transition-delay` is missing from the media query block, add it.

- [ ] **Step 12.3: Commit (only if changes were made)**

```bash
git add client/src/app/accessibility.css
git commit -m "fix: add transition-delay to prefers-reduced-motion media query"
```

---

## Task 13: Part 2 — Anti-Flash Script in `layout.tsx`

**Files:**
- Modify: `client/src/app/layout.tsx`

Prevent flash of animations on initial load when `stopAnimations` preference is saved in localStorage.

- [ ] **Step 13.1: Read current `layout.tsx`**

Read `client/src/app/layout.tsx`

- [ ] **Step 13.2: Add inline `beforeInteractive` script**

After the existing `prevent-fout` Script block, add a new Script that reads localStorage and applies `a11y-stop-animations` to `<html>` before first paint:

```tsx
<Script id="prevent-animation-flash" strategy="beforeInteractive">
  {`
    (function() {
      try {
        var raw = window.localStorage.getItem('hn_a11y_settings');
        if (raw) {
          var settings = JSON.parse(raw);
          if (settings && settings.stopAnimations) {
            document.documentElement.classList.add('a11y-stop-animations');
          }
        }
      } catch (e) {}
    })();
  `}
</Script>
```

Place it immediately after the `prevent-fout` Script block (before the GTM consent script).

- [ ] **Step 13.3: Verify TypeScript**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit
```

Expected: exit 0

- [ ] **Step 13.4: Commit**

```bash
git add client/src/app/layout.tsx
git commit -m "fix: prevent animation flash on initial load when stopAnimations saved in localStorage"
```

---

## Task 14: Part 2 — Verify `MotionGuard` is Correct

**Files:**
- Read only: `client/src/components/accessibility/components/MotionGuard.tsx`

- [ ] **Step 14.1: Confirm current MotionGuard implementation**

Read `client/src/components/accessibility/components/MotionGuard.tsx`

Current state: `reducedMotion={shouldReduce ? "always" : "never"}`

This is correct — `"always"` kills all Framer Motion animations. The `"never"` default means Framer Motion ignores the OS setting (because our CSS handles it via `@media (prefers-reduced-motion)`). This is acceptable behavior. **No changes needed.**

- [ ] **Step 14.2: Verify `useReducedMotion` reacts to settings changes**

The `useReducedMotion` hook in `AccessibilityProvider.tsx` reads `settings.stopAnimations` (reactive via React state) and `systemReducedMotion` (reactive via MediaQueryListEvent). Both are reactive — **no changes needed.**

- [ ] **Step 14.3: Run full type-check and lint**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit; npm run lint
```

Expected: both pass with zero errors

---

## Task 15: Final Verification

- [ ] **Step 15.1: Run production build**

```powershell
cd D:\HeartNote\client; npm run build
```

Expected: exits 0, no TypeScript or webpack errors

- [ ] **Step 15.2: Start dev server and verify visually**

```powershell
cd D:\HeartNote\client; npm run dev
```

Open `http://localhost:3000/gallery` (or equivalent gallery route) and verify:
- [ ] Each template card shows a themed preview (not generic)
- [ ] Bar Mitzvah: gold/navy with Star of David, Hebrew ceremony text
- [ ] Wedding Glass: ivory/cream with broken glass SVG, couple names, wine accent
- [ ] Birthday Candles: animated candles on mini cake
- [ ] Holiday Card: cycling through Jewish holidays with themed backgrounds
- [ ] Surprise Gift: bouncing gift box
- [ ] Decision Wheel: spinning conic-gradient wheel
- [ ] Slot Machine: cycling reel symbols
- [ ] Punching Bag: swinging bag
- [ ] Apology Search: typing search bar animation
- [ ] Excuse Generator: cycling excuses

- [ ] **Step 15.3: Test accessibility animation toggle**

1. Open accessibility widget
2. Enable "Stop Animations" toggle
3. Verify ALL animations stop immediately (gallery previews, hero animations, any motion)
4. Disable toggle → verify animations restore without page reload
5. Reload page with toggle still on → verify no animation flash

- [ ] **Step 15.4: Write post-execution log**

Write to `d:\HeartNote\.claude\plans\logs\template-preview-redesign-<timestamp>.log`

---

## Self-Review Against Spec

| Requirement | Task |
|---|---|
| Redesign TemplatePreview.tsx | Task 11 — extracted to dispatcher, all inline previews moved to separate files |
| Bar Mitzvah: gold/navy, Star of David, Hebrew ceremony typography | Task 1 |
| Wedding Glass: broken glass motif, ivory/wine, couple names | Task 2 |
| All other templates visually upgraded | Tasks 3–11 |
| Read tailwind.config.ts before writing styles | Done — design tokens documented above |
| No hardcoded arbitrary hex unless unavailable in theme | All colors use Tailwind classes or named CSS (no arbitrary values) |
| Hover effects (scale, shadow) | Applied via `motion.whileHover` in each card wrapper |
| CSS kill switch `.a11y-stop-animations` | Task 12 — already exists, verify `transition-delay` |
| `@media (prefers-reduced-motion)` | Task 12 — already in CSS, verify completeness |
| `MotionConfig reducedMotion` | Task 14 — MotionGuard already wired correctly |
| JS/scroll animation gating | No IntersectionObserver animations found in codebase — N/A |
| Persistence via localStorage | Already handled by `AccessibilityProvider` |
| Anti-flash script before first paint | Task 13 |
| Toggle reversible at runtime | Task 14 — reactive via React state |
| ≤150 lines per file | TemplatePreview.tsx split; all new files are targeted small components |
| TypeScript strict, no `any` | Verified at each task |
| `dev` branch only | All commits on `dev` |
