# Template Preview Selective Revert Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revert all template previews to their pre-redesign appearance, keeping new designs only for: ApologySearch (חיפוש סליחה), PunchingBag (שג האיגרוף), RelationshipQuiz (חידון חברות), HolidayCard (מפעל חגים).

**Architecture:** The redesign modularised inline preview functions into separate files and re-styled all previews using design tokens. We restore original content to all non-kept files. TemplatePreview.tsx and MorePreviews.tsx stay unchanged (their structure is already correct). No deletions — each new file simply gets its original content restored.

**Tech Stack:** Next.js 14, TypeScript strict, Tailwind CSS, Framer Motion 11

**Pre-redesign commit (reference):** `7b29580`

---

## File Map

### Files to REVERT (restore exact original content from commit 7b29580)

**Existing files that were modified during redesign:**
- Modify: `client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx`

**New files created during redesign (restore to original inline content):**
- Modify: `client/src/components/galleryTemplate/previews/DateInvitePreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/TimelinePreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx`
- Modify: `client/src/components/galleryTemplate/previews/OpenWhenPreview.tsx`

### Files to KEEP unchanged (new design preserved)
- `client/src/components/galleryTemplate/previews/ApologySearchPreview.tsx` — חיפוש סליחה
- `client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx` — שג האיגרוף
- `client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx` — מפעל חגים
- `client/src/components/galleryTemplate/previews/RelationshipQuizPreview.tsx` — חידון חברות

### Files that need NO changes
- `client/src/components/galleryTemplate/components/TemplatePreview.tsx` — already correct
- `client/src/components/galleryTemplate/components/MorePreviews.tsx` — already correct

---

## Task 1: Revert BarBatMitzvahPreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function BarBatMitzvahPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        <div className="text-[8px] font-bold text-stone-600 dark:text-stone-300 mb-1">
          בר / בת
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-14 flex items-end justify-center relative"
        >
          <svg viewBox="0 0 100 120" className="w-full h-full">
            <path
              d="M 50,40 C 35,55 20,80 15,120 L 85,120 C 80,80 65,55 50,40 Z"
              fill="#fffcfa"
              stroke="#d4826f"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="30" r="10" fill="#f2e9e4" />
            <path
              d="M 40,25 C 35,20 30,25 35,35 C 40,28 60,28 65,35 C 70,25 65,20 60,25 Z"
              fill="#1b263b"
            />
            <g>
              <path d="M 38,20 L 42,12 L 50,18 L 58,12 L 62,20 Z" fill="#d4826f" />
              <circle cx="42" cy="15" r="1.5" fill="#fffcfa" />
              <circle cx="50" cy="20" r="2" fill="#fffcfa" />
              <circle cx="58" cy="15" r="1.5" fill="#fffcfa" />
            </g>
          </svg>
        </motion.div>

        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="px-2 py-1 rounded-full bg-[#d4826f] text-white text-[6px] font-bold shadow"
        >
          לחצו
        </motion.div>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-[5px] text-[#d4826f] font-bold text-center px-2 leading-tight"
        >
          ברכה מרגשת מחכה 🎉
        </motion.p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/BarBatMitzvahPreview.tsx
git commit -m "revert: restore BarBatMitzvahPreview to pre-redesign"
```

---

## Task 2: Revert BirthdayCandlesPreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-0">
        <div className="flex gap-2.5 relative z-10" style={{ marginBottom: "-1px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.15, 0.9, 1.1, 1], opacity: [1, 0.85, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                style={{ color: "#ffde59" }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </motion.div>
              <div className="w-2 h-6 rounded-t-sm bg-[#f5f0e8] border border-gray-200" />
            </div>
          ))}
        </div>

        <div
          className="w-20 h-8 rounded-t-[12px] rounded-b-md shadow-md relative overflow-hidden"
          style={{ backgroundColor: "#d4826f" }}
        >
          <div className="absolute top-0 w-full h-1.5 bg-white opacity-25" />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-1.5 text-[6px] text-[#415a77] font-medium"
        >
          🎂 לחצו לכיבוי
        </motion.p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/BirthdayCandlesPreview.tsx
git commit -m "revert: restore BirthdayCandlesPreview to pre-redesign"
```

---

## Task 3: Revert DecisionWheelPreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

const WHEEL_SEGMENTS = [
  { color: "#FECDD3", label: "🍽️" },
  { color: "#C7CEEA", label: "🎬" },
  { color: "#B5EAD7", label: "🌲" },
  { color: "#FFDAC1", label: "🎮" },
  { color: "#E2F0CB", label: "💆" },
  { color: "#FCE4EC", label: "🍳" },
];

export function DecisionWheelPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="relative w-20 h-20">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-[#d4826f]" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600"
          style={{
            background: `conic-gradient(${WHEEL_SEGMENTS.map(
              (s, i) =>
                `${s.color} ${(i / WHEEL_SEGMENTS.length) * 360}deg ${((i + 1) / WHEEL_SEGMENTS.length) * 360}deg`,
            ).join(", ")})`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#d4826f] rounded-full flex items-center justify-center text-white text-[6px] font-bold shadow">
            !סובבו
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/DecisionWheelPreview.tsx
git commit -m "revert: restore DecisionWheelPreview to pre-redesign"
```

---

## Task 4: Revert ExcuseGeneratorPreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function ExcuseGeneratorPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ backgroundColor: "#d4826f22" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4826f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </motion.div>

        <div className="w-24 bg-white border border-gray-200 rounded-lg p-1.5 shadow-inner flex items-center justify-center min-h-[28px]">
          <motion.p
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}
            className="text-[6px] font-bold text-[#2e3c52] text-center leading-tight"
          >
            &ldquo;הכלב שלי אכל את הזמן הפנוי&rdquo;
          </motion.p>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-3 py-1 rounded-full text-white text-[7px] font-bold shadow flex items-center gap-1"
          style={{ backgroundColor: "#d4826f" }}
        >
          ⚙️ ג&apos;נרט תירוץ
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/ExcuseGeneratorPreview.tsx
git commit -m "revert: restore ExcuseGeneratorPreview to pre-redesign"
```

---

## Task 5: Revert SlotMachinePreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

const SLOT_LABELS = [
  ["לחצי", "אני", "מחר"],
  ["כדי", "להזמין", "לפנק"],
  ["לגלות", "פיצה", "מסאז׳"],
];

export function SlotMachinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1">
          {SLOT_LABELS.map((labels, col) => (
            <div
              key={col}
              className="w-7 h-10 rounded-md bg-[#f2e9e4] dark:bg-gray-600 border border-gray-300 dark:border-gray-500 shadow-inner overflow-hidden relative"
            >
              <motion.div
                animate={{ y: [0, -40, -80, -40, 0] }}
                transition={{
                  duration: 2,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: col * 0.15,
                  ease: "easeInOut",
                }}
                className="flex flex-col"
              >
                {labels.map((label, i) => (
                  <div
                    key={i}
                    className="h-10 flex items-center justify-center text-[8px] font-bold text-[#2e3c52] dark:text-white"
                  >
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-3 py-1 rounded-full bg-[#d4826f] text-white text-[8px] font-bold shadow"
        >
          🎰 סובבי
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/SlotMachinePreview.tsx
git commit -m "revert: restore SlotMachinePreview to pre-redesign"
```

---

## Task 6: Revert SurpriseGiftPreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function SurpriseGiftPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="relative">
        <motion.div
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
        >
          <svg width="60" height="66" viewBox="0 0 200 220" aria-hidden="true">
            <rect x="20" y="100" width="160" height="110" rx="8" fill="#e74c5e" />
            <rect x="88" y="100" width="24" height="110" fill="#ffd700" />
            <rect x="10" y="80" width="180" height="30" rx="6" fill="#e74c5e" />
            <rect x="88" y="80" width="24" height="30" fill="#ffd700" />
            <ellipse cx="82" cy="78" rx="18" ry="14" fill="#ffd700" />
            <ellipse cx="118" cy="78" rx="18" ry="14" fill="#ffd700" />
            <circle cx="100" cy="80" r="8" fill="#ffd700" />
          </svg>
        </motion.div>
        {["✨", "🎁"].map((s, i) => (
          <motion.span
            key={i}
            className="absolute text-xs"
            style={{ top: i === 0 ? -4 : 2, [i === 0 ? "left" : "right"]: -8 }}
            animate={{ opacity: [0, 1, 0], y: [0, -6, 0] }}
            transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/SurpriseGiftPreview.tsx
git commit -m "revert: restore SurpriseGiftPreview to pre-redesign"
```

---

## Task 7: Revert WeddingGlassPreview

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-20 h-16 flex items-end justify-center">
          {/* Groom (left) */}
          <div className="absolute left-0 bottom-0 w-5 h-10">
            <svg viewBox="0 0 50 80" className="w-full h-full">
              <path d="M 20,30 L 20,60 L 25,60 L 25,30 Z" fill="#1b263b" />
              <path d="M 25,30 L 25,60 L 30,60 L 30,30 Z" fill="#1b263b" />
              <path d="M 18,8 R 10,10 L 32,8 Z" fill="#f2e9e4" />
              <path d="M 18,10 L 32,10 L 30,28 L 20,28 Z" fill="#1b263b" />
            </svg>
          </div>

          {/* Glass (center) */}
          <motion.div
            animate={{ scale: [1, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 w-2.5 h-3.5 bg-[#415a77] opacity-60 rounded-sm shadow"
          />

          {/* Bride (right) */}
          <div className="absolute right-0 bottom-0 w-5 h-10">
            <svg viewBox="0 0 50 80" className="w-full h-full">
              <path d="M 25,20 C 20,25 10,50 8,65 L 42,65 C 40,50 30,25 25,20 Z" fill="#fffcfa" />
              <path d="M 25,12 C 15,8 10,10 15,20 Z" fill="#cb8e7c" />
              <circle cx="25" cy="10" r="5" fill="#f2e9e4" />
            </svg>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-2 py-1 rounded-full bg-[#d4826f] text-white text-[6px] font-bold shadow"
        >
          💍 שבור!
        </motion.div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[5px] text-[#415a77] font-medium"
        >
          לחצו לשבירה
        </motion.p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/WeddingGlassPreview.tsx
git commit -m "revert: restore WeddingGlassPreview to pre-redesign"
```

---

## Task 8: Revert DateInvitePreview (new file → original inline content)

**Context:** This file was created during the redesign. The original content was an inline function inside `TemplatePreview.tsx`. We restore the original content as a proper standalone file (keeps the modular structure, restores original visual design).

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/DateInvitePreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function DateInvitePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="bg-white dark:bg-gray-600 px-4 py-3 rounded-xl shadow-md text-center">
        <p className="text-[10px] font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
          ?תצא/י איתי
        </p>
        <div className="flex gap-2 justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-12 bg-[#d4826f] rounded-md flex items-center justify-center text-[9px] text-white font-bold"
          >
            כן!
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-6 w-12 bg-gray-200 dark:bg-gray-500 rounded-md flex items-center justify-center text-[9px] text-gray-500 dark:text-gray-300"
          >
            לא
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/DateInvitePreview.tsx
git commit -m "revert: restore DateInvitePreview to pre-redesign"
```

---

## Task 9: Revert ScratchCardPreview (new file → original inline content)

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function ScratchCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="w-full max-w-[100px] aspect-[4/3] rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-600">
        {/* Prize behind */}
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-600">
          <span className="text-2xl">🎁</span>
        </div>
        {/* Scratch layer with hole */}
        <motion.div
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 50% 100%, 65% 45%, 30% 35%, 0 60%)",
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/ScratchCardPreview.tsx
git commit -m "revert: restore ScratchCardPreview to pre-redesign"
```

---

## Task 10: Revert TimelinePreview (new file → original inline content)

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/TimelinePreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function TimelinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex items-center gap-1 relative h-12">
        {/* Horizontal line */}
        <div className="absolute left-2 right-2 h-0.5 bg-[#d4826f]/50" />
        {/* Dots */}
        {["❤️", "✨", "💒"].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.3 }}
            className="z-10 w-7 h-7 bg-white dark:bg-gray-600 rounded-full border-2 border-[#d4826f] flex items-center justify-center text-xs shadow-sm"
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/TimelinePreview.tsx
git commit -m "revert: restore TimelinePreview to pre-redesign"
```

---

## Task 11: Revert LoveCouponsPreview (new file → original inline content)

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function LoveCouponsPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="space-y-1">
        {[
          { emoji: "💆", redeemed: false },
          { emoji: "🍽️", redeemed: true },
        ].map((coupon, i) => (
          <motion.div
            key={i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg border-2 border-dashed ${
              coupon.redeemed
                ? "border-gray-300 bg-gray-100 dark:bg-gray-700 opacity-60"
                : "border-[#d4826f] bg-white dark:bg-gray-600"
            }`}
          >
            <span className="text-sm">{coupon.emoji}</span>
            {coupon.redeemed && (
              <span className="text-[8px] text-red-500 font-bold">✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/LoveCouponsPreview.tsx
git commit -m "revert: restore LoveCouponsPreview to pre-redesign"
```

---

## Task 12: Revert OpenWhenPreview (new file → original inline content)

**Files:**
- Modify: `client/src/components/galleryTemplate/previews/OpenWhenPreview.tsx`

- [ ] **Step 1: Write the original content**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";

export function OpenWhenPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { emoji: "😢", locked: false },
          { emoji: "💪", locked: false },
          { emoji: "🎁", locked: true },
          { emoji: "💕", locked: true },
        ].map((env, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-8 h-6 rounded flex items-center justify-center text-xs ${
              env.locked
                ? "bg-gray-200 dark:bg-gray-600"
                : "bg-[#f5e6d3] dark:bg-gray-500"
            }`}
          >
            {env.locked ? "🔒" : env.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/galleryTemplate/previews/OpenWhenPreview.tsx
git commit -m "revert: restore OpenWhenPreview to pre-redesign"
```

---

## Task 13: Verify & Build

- [ ] **Step 1: Confirm kept templates are untouched**

Run these and confirm the files have NOT been modified (should show no diff):

```bash
git diff HEAD -- client/src/components/galleryTemplate/previews/ApologySearchPreview.tsx
git diff HEAD -- client/src/components/galleryTemplate/previews/PunchingBagPreview.tsx
git diff HEAD -- client/src/components/galleryTemplate/previews/HolidayCardPreview.tsx
git diff HEAD -- client/src/components/galleryTemplate/previews/RelationshipQuizPreview.tsx
```

Expected: no output (empty diff = files untouched)

- [ ] **Step 2: Type-check**

```bash
cd client && npm run type-check
```

Expected: zero errors

- [ ] **Step 3: Lint**

```bash
cd client && npm run lint
```

Expected: no errors or warnings

- [ ] **Step 4: Build**

```bash
cd client && npm run build
```

Expected: successful build, no errors

- [ ] **Step 5: Write log**

Create `d:\HeartNote\.claude\plans\logs\template-preview-selective-revert-<timestamp>.log` with the post-execution checklist filled in.

---

## Post-Execution Checklist Template

```markdown
## Post-Execution Checklist — template-preview-selective-revert — <timestamp>

### Git Archaeology
- [ ] Correct pre-redesign commit identified: 7b29580
- [ ] Full diff extracted to identify all changed files
- [ ] Original code retrieved via git show

### Revert Correctness
- [ ] All 12 non-kept templates reverted to exact original code
- [ ] No manual interpretation or modification of original code
- [ ] Only template preview code touched — no logic, types, or routing changed

### Protected Templates (new design preserved)
- [ ] חיפוש סליחה (ApologySearchPreview) — new design intact ✅
- [ ] שג האיגרוף (PunchingBagPreview) — new design intact ✅
- [ ] חידון חברות (RelationshipQuizPreview) — new design intact ✅
- [ ] מפעל חגים (HolidayCardPreview) — new design intact ✅

### Accessibility
- [ ] Global animation kill-switch still functional (not reverted)

### Code Quality
- [ ] No file exceeds 150 lines
- [ ] TypeScript: zero `any`, all return types explicit
- [ ] No `console.*` — using `logger.*`

### Git
- [ ] Working on `dev` branch only
- [ ] No changes to `main`

### Plan
- [ ] Plan written to `.claude/plans/template-preview-selective-revert.md`
- [ ] Log written to `.claude/plans/logs/template-preview-selective-revert-<timestamp>.log`
- [ ] All checklist items verified ✅
```
