"use client";

import { motion } from "framer-motion";

interface CandleProps {
  isLit: boolean;
  flameColor: string;
  onBlow: () => void;
  size?: "sm" | "md";
}

export function Candle({ isLit, flameColor, onBlow, size = "md" }: CandleProps) {
  const flameSize = size === "sm" ? 24 : 32;
  const stickW = size === "sm" ? "w-3" : "w-4";
  const stickH = size === "sm" ? "h-10" : "h-16";

  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none"
      onClick={isLit ? onBlow : undefined}
      role="button"
      aria-label={isLit ? "כבה את הנר" : "הנר כבוי"}
    >
      {/* Flame */}
      <motion.div
        animate={
          isLit
            ? { opacity: 1, scale: [1, 1.12, 0.93, 1.07, 1] }
            : { opacity: 0, scale: 0.4 }
        }
        transition={
          isLit
            ? {
                opacity: { duration: 0.3 },
                scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0.35 }
        }
        style={{ color: flameColor, height: flameSize }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={flameSize}
          height={flameSize}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
          aria-hidden="true"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      </motion.div>

      {/* Candle stick */}
      <div
        className={`${stickW} ${stickH} rounded-t-sm relative overflow-hidden border border-gray-200`}
        style={{ backgroundColor: "#f5f0e8" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 4px, #1b263b 4px, #1b263b 8px)",
          }}
        />
      </div>
    </div>
  );
}
