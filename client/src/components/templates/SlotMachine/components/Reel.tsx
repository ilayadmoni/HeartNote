"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ReelProps {
  text: string;
  isSpinning: boolean;
  primaryColor: string;
  size?: "desktop" | "mobile";
  hasWon?: boolean;
}

export function Reel({ text, isSpinning, primaryColor, size = "desktop", hasWon = false }: ReelProps) {
  const isDesktop = size === "desktop";

  return (
    <motion.div
      animate={
        isSpinning
          ? { scale: [1, 0.97, 1.02, 0.98, 1] }
          : hasWon
          ? { scale: 1, boxShadow: [`0 0 0 0 rgb(var(--accent) / 0.5)`, `0 0 0 8px rgb(var(--accent) / 0)`] }
          : { scale: 1 }
      }
      transition={
        isSpinning
          ? { repeat: Infinity, duration: 0.15, ease: "easeInOut" }
          : hasWon
          ? { repeat: Infinity, duration: 1.2, ease: "easeOut" }
          : { duration: 0.2 }
      }
      className={`
        flex items-center justify-center rounded-2xl shadow-inner border-2
        transition-colors duration-100
        ${isDesktop ? "w-40 h-40" : "w-24 h-24"}
        ${isSpinning ? "border-line-strong bg-surface-sunken" : hasWon ? "border-accent bg-surface-sunken" : "border-line bg-surface-sunken"}
      `}
      style={
        !isSpinning && !hasWon
          ? { borderColor: `${primaryColor}30` }
          : undefined
      }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, y: isSpinning ? -8 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isSpinning ? 8 : 0 }}
          transition={{ duration: isSpinning ? 0.06 : 0.25, ease: "easeOut" }}
          dir="auto"
          className={`font-bold text-ink text-center px-2 leading-tight break-words
            ${isDesktop ? "text-2xl" : "text-base"}
          `}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
