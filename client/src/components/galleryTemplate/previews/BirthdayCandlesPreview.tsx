"use client";

import { motion } from "framer-motion";

const CANDLE_CLASSES = [
  "bg-coral-400",
  "bg-coral-500",
  "bg-secondary-400",
  "bg-primary-400",
  "bg-navy-400",
] as const;

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Candle row */}
        <div className="flex items-end gap-1.5">
          {CANDLE_CLASSES.map((cls, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <motion.div
                animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
                transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-2.5 rounded-full bg-gradient-to-t from-coral-700 via-coral-400 to-transparent"
                style={{ transformOrigin: "bottom center" }}
              />
              {/* Wick */}
              <div className="w-px h-1 bg-navy-300" />
              {/* Candle body */}
              <div
                className={`w-2.5 rounded-sm opacity-85 ${cls}`}
                style={{ height: `${14 + i * 2}px` }}
              />
            </div>
          ))}
        </div>

        {/* Mini cake */}
        <div className="w-20">
          <div className="h-2 bg-primary-100 rounded-t-full border border-primary-200" />
          <div className="h-5 bg-coral-50 border border-coral-200 flex items-center justify-center">
            <span className="text-[6px] text-coral-700 font-bold">יום הולדת שמח!</span>
          </div>
          <div className="h-1.5 bg-coral-200 rounded-b-sm border border-coral-200" />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[6px] text-coral-600 font-bold"
        >
          🎂 לחצו לכיבוי
        </motion.p>
      </div>
    </div>
  );
}
