"use client";

import { motion } from "framer-motion";

export function SurpriseGiftPreview(): JSX.Element {
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
            style={{ top: i === 0 ? -4 : 2, [i === 0 ? "insetInlineStart" : "insetInlineEnd"]: -8 }}
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
