"use client";

/**
 * SparkleDecoration Component
 * Animated sparkle effects positioned around the card edges
 * Fixed: mobile glitch by using will-change and reducing animation on mobile
 */

import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SPARKLES = [
  { top: "20%", right: "10%", delay: 0 },
  { top: "15%", left: "10%", delay: 0.5 },
  { bottom: "20%", right: "12%", delay: 1 },
  { bottom: "15%", left: "8%", delay: 1.5 },
];

export function SparkleDecoration() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {SPARKLES.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-xl pointer-events-none"
          style={{
            top: pos.top,
            right: pos.right,
            bottom: pos.bottom,
            left: pos.left,
            willChange: "transform, opacity",
          }}
          animate={
            isMobile
              ? { opacity: [0.3, 0.8, 0.3] }
              : {
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.3, 0.9, 0.3],
                  rotate: [0, 180, 360],
                }
          }
          transition={{
            duration: isMobile ? 4 : 3,
            delay: pos.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      ))}
    </>
  );
}
