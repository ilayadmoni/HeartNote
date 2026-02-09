"use client";

/**
 * FloatingIcons Component
 * Decorative animated emojis floating in the background
 * Fixed: Use absolute positioning instead of fixed to prevent stuck icons
 */

import { motion } from "framer-motion";
import { FLOATING_EMOJIS } from "../constants";

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {FLOATING_EMOJIS.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-10"
          style={{
            left: `${15 + i * 14}%`,
            top: `${10 + (i % 3) * 30}%`,
            willChange: "transform",
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
