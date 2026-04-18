"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ReelProps {
  text: string;
  isSpinning: boolean;
  primaryColor: string;
  size?: "desktop" | "mobile";
}

export function Reel({ text, isSpinning, primaryColor, size = "desktop" }: ReelProps) {
  const isDesktop = size === "desktop";

  return (
    <motion.div
      animate={isSpinning ? { scale: [1, 0.97, 1.02, 0.98, 1] } : { scale: 1 }}
      transition={
        isSpinning
          ? { repeat: Infinity, duration: 0.15, ease: "easeInOut" }
          : { duration: 0.2 }
      }
      className={`
        flex items-center justify-center rounded-2xl shadow-inner border-2
        transition-colors duration-100
        ${isDesktop ? "w-40 h-40" : "w-24 h-24"}
        ${isSpinning ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-[#f8f4f1]"}
      `}
      style={{
        borderColor: isSpinning ? "#e5e7eb" : `${primaryColor}30`,
        backgroundColor: isSpinning ? "#f3f4f6" : "#f8f4f1",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, y: isSpinning ? -8 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isSpinning ? 8 : 0 }}
          transition={{ duration: isSpinning ? 0.06 : 0.25, ease: "easeOut" }}
          className={`font-bold text-[#1b263b] text-center px-2 leading-tight break-words
            ${isDesktop ? "text-2xl" : "text-base"}
          `}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
