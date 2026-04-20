"use client";

/**
 * Extra Template Miniature Previews
 * Hand-crafted gallery card previews for DecisionWheel, SteamyWindow, SurpriseGift, ExcuseGenerator
 */

import { motion } from "framer-motion";

// ── Decision Wheel ──────────────────────────────────────────────────────────

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
        {/* Pointer */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-[#d4826f]" />
        {/* Wheel */}
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
        {/* Center button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#d4826f] rounded-full flex items-center justify-center text-white text-[6px] font-bold shadow">
            !סובבו
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Steamy Window ───────────────────────────────────────────────────────────

export function SteamyWindowPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="relative w-full max-w-[110px] aspect-[4/3] rounded-lg bg-gray-300/80 dark:bg-gray-600/80 overflow-hidden">
        {/* Steam particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
            style={{ left: `${20 + i * 13}%`, top: `${30 + (i % 3) * 15}%` }}
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        {/* Reveal swipe */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent"
          animate={{
            clipPath: [
              "circle(0% at 50% 50%)",
              "circle(25% at 50% 50%)",
              "circle(0% at 50% 50%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
        >
          <div className="h-full w-full bg-white/30 dark:bg-gray-500/30 flex items-center justify-center">
            <span className="text-lg">💖</span>
          </div>
        </motion.div>
        {/* Label */}
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-[7px] text-gray-600 dark:text-gray-300 font-bold">
            🫧 העבירו אצבע
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Slot Machine ────────────────────────────────────────────────────────────

const SLOT_LABELS = [
  ["לחצי", "אני", "מחר"],
  ["כדי", "להזמין", "לפנק"],
  ["לגלות", "פיצה", "מסאז׳"],
];

export function SlotMachinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-1.5">
        {/* Reels */}
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
        {/* Spin button */}
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

// ── Punching Bag ────────────────────────────────────────────────────────────

export function PunchingBagPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-1.5">
        {/* Rope */}
        <div className="w-px h-5 bg-gray-300" />
        {/* Bag */}
        <motion.div
          animate={{ rotate: [0, -12, 10, -5, 3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          className="w-9 h-14 rounded-[40%] flex items-center justify-center shadow-md"
          style={{ backgroundColor: "#d4826f" }}
        >
          <span className="text-white/60 font-bold text-[14px]">5</span>
        </motion.div>
        {/* Hit instruction */}
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-[6px] text-gray-500 font-medium mt-0.5"
        >
          🥊 לחצו להרביץ
        </motion.p>
      </div>
    </div>
  );
}

// ── Apology Search ──────────────────────────────────────────────────────────

export function ApologySearchPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2 w-full max-w-[120px]">
        {/* Search bar */}
        <div className="w-full bg-white border border-gray-200 rounded-full px-2 py-1.5 flex items-center gap-1 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#415a77"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <motion.span
            className="text-[6px] text-[#1b263b] font-medium"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
            style={{ overflow: "hidden", whiteSpace: "nowrap", display: "inline-block" }}
          >
            איך לבקש סליחה?
          </motion.span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-px h-2.5 bg-[#1b263b]"
          />
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#d4826f]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Mini result card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          className="w-full bg-[#fdf6f2] border border-[#e8ddd8] rounded-lg p-1.5 flex items-center gap-1 shadow-sm"
        >
          <span className="text-[8px]">❤️</span>
          <span className="text-[5px] font-bold text-[#1b263b]">סליחה שהייתי עצבנית</span>
        </motion.div>
      </div>
    </div>
  );
}

// ── Birthday Candles ────────────────────────────────────────────────────────

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-0">
        {/* Candles row */}
        <div className="flex gap-2.5 relative z-10" style={{ marginBottom: "-1px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <motion.div
                animate={{ scale: [1, 1.15, 0.9, 1.1, 1], opacity: [1, 0.85, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                style={{ color: "#ffde59" }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </motion.div>
              {/* Stick */}
              <div className="w-2 h-6 rounded-t-sm bg-[#f5f0e8] border border-gray-200" />
            </div>
          ))}
        </div>

        {/* Cake base */}
        <div
          className="w-20 h-8 rounded-t-[12px] rounded-b-md shadow-md relative overflow-hidden"
          style={{ backgroundColor: "#d4826f" }}
        >
          <div className="absolute top-0 w-full h-1.5 bg-white opacity-25" />
        </div>

        {/* Label */}
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

// ── Surprise Gift ───────────────────────────────────────────────────────────

export function SurpriseGiftPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="relative">
        {/* Gift box */}
        <motion.div
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
        >
          <svg width="60" height="66" viewBox="0 0 200 220" aria-hidden="true">
            {/* Box body */}
            <rect x="20" y="100" width="160" height="110" rx="8" fill="#e74c5e" />
            {/* Vertical ribbon */}
            <rect x="88" y="100" width="24" height="110" fill="#ffd700" />
            {/* Lid */}
            <rect x="10" y="80" width="180" height="30" rx="6" fill="#e74c5e" />
            <rect x="88" y="80" width="24" height="30" fill="#ffd700" />
            {/* Bow */}
            <ellipse cx="82" cy="78" rx="18" ry="14" fill="#ffd700" />
            <ellipse cx="118" cy="78" rx="18" ry="14" fill="#ffd700" />
            <circle cx="100" cy="80" r="8" fill="#ffd700" />
          </svg>
        </motion.div>
        {/* Sparkles */}
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

// ── Excuse Generator ────────────────────────────────────────────────────────

export function ExcuseGeneratorPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        {/* Spinning cog */}
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

        {/* Excuse box */}
        <div className="w-24 bg-white border border-gray-200 rounded-lg p-1.5 shadow-inner flex items-center justify-center min-h-[28px]">
          <motion.p
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}
            className="text-[6px] font-bold text-[#2e3c52] text-center leading-tight"
          >
            &ldquo;הכלב שלי אכל את הזמן הפנוי&rdquo;
          </motion.p>
        </div>

        {/* Generate button */}
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

// ── Wedding Glass ───────────────────────────────────────────────────────────

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        {/* Groom & Bride mini figures with glass */}
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

        {/* Stomp button */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-2 py-1 rounded-full bg-[#d4826f] text-white text-[6px] font-bold shadow"
        >
          💍 שבור!
        </motion.div>

        {/* Mazal Tov hint */}
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

// ── Holiday Card ────────────────────────────────────────────────────────────

const HOLIDAY_ICONS = {
  rosh: { emoji: "🍎", bgColor: "#fff5f2", label: "ראש השנה" },
  hanukkah: { emoji: "🕎", bgColor: "#f0f4f8", label: "חנוכה" },
  purim: { emoji: "🎭", bgColor: "#f8f0f8", label: "פורים" },
  pesach: { emoji: "🍷", bgColor: "#fffaeb", label: "פסח" },
};

export function HolidayCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col gap-2 w-full">
        {/* Holiday selector */}
        <div className="text-[9px] font-bold text-stone-600 dark:text-stone-300 text-center mb-1">
          בחר חג
        </div>

        {/* Small card showing current holiday */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[110px] mx-auto p-2 rounded-xl flex flex-col items-center text-center"
          style={{ backgroundColor: HOLIDAY_ICONS.rosh.bgColor }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl mb-1"
          >
            {HOLIDAY_ICONS.rosh.emoji}
          </motion.div>
          <p className="text-[7px] font-bold text-stone-700 dark:text-stone-800">
            {HOLIDAY_ICONS.rosh.label}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ── Bar/Bat Mitzvah ─────────────────────────────────────────────────────────

export function BarBatMitzvahPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        {/* Toggle indicator */}
        <div className="text-[8px] font-bold text-stone-600 dark:text-stone-300 mb-1">
          בר / בת
        </div>

        {/* Simple figure (bat with crown) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-14 flex items-end justify-center relative"
        >
          <svg viewBox="0 0 100 120" className="w-full h-full">
            {/* Dress */}
            <path
              d="M 50,40 C 35,55 20,80 15,120 L 85,120 C 80,80 65,55 50,40 Z"
              fill="#fffcfa"
              stroke="#d4826f"
              strokeWidth="1.5"
            />
            {/* Head */}
            <circle cx="50" cy="30" r="10" fill="#f2e9e4" />
            {/* Hair */}
            <path
              d="M 40,25 C 35,20 30,25 35,35 C 40,28 60,28 65,35 C 70,25 65,20 60,25 Z"
              fill="#1b263b"
            />
            {/* Crown (pulsing) */}
            <g className="origin-center">
              <path
                d="M 38,20 L 42,12 L 50,18 L 58,12 L 62,20 Z"
                fill="#d4826f"
              />
              <circle cx="42" cy="15" r="1.5" fill="#fffcfa" />
              <circle cx="50" cy="20" r="2" fill="#fffcfa" />
              <circle cx="58" cy="15" r="1.5" fill="#fffcfa" />
            </g>
          </svg>
        </motion.div>

        {/* Tap hint */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="px-2 py-1 rounded-full bg-[#d4826f] text-white text-[6px] font-bold shadow"
        >
          לחצו
        </motion.div>

        {/* Blessing preview */}
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
