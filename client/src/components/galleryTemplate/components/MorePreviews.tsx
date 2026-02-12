"use client";

/**
 * Extra Template Miniature Previews
 * Hand-crafted gallery card previews for DecisionWheel, SteamyWindow, SurpriseGift
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
