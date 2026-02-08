"use client";

/**
 * FloatingIcons Component
 * Decorative animated emojis floating in the background
 */

import { motion } from "framer-motion";
import { FLOATING_EMOJIS } from "../constants";

export function FloatingIcons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {FLOATING_EMOJIS.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-15"
          initial={{
            x: `${15 + i * 14}%`,
            y: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [`${10 + (i % 3) * 30}%`, `${5 + (i % 3) * 30}%`, `${10 + (i % 3) * 30}%`],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
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
