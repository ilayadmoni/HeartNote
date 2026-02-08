"use client";

/**
 * FloatingHearts Component
 * Animated floating hearts decoration for romantic templates
 */

import { motion } from "framer-motion";
import { useMemo } from "react";

const HEARTS = ["💕", "💗", "💖", "❤️", "💓"];

export function FloatingHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: HEARTS[i % HEARTS.length],
      x: `${10 + ((i * 12) % 80)}%`,
      delay: i * 0.8,
      duration: 6 + (i % 3) * 2,
      size: 16 + (i % 3) * 8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0"
          style={{ left: heart.x, fontSize: heart.size }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 0.7, 0.7, 0],
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
}
