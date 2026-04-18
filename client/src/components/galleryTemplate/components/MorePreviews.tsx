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
