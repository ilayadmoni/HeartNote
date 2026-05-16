"use client";

import { motion } from "framer-motion";

const CANDLE_COLORS = ["#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#22c55e"];

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Candle row */}
        <div className="flex items-end gap-1.5">
          {CANDLE_COLORS.map((color, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <motion.div
                animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
                transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-2.5 rounded-full"
                style={{
                  background: "radial-gradient(ellipse at 50% 80%, #fbbf24, #f97316, transparent)",
                  transformOrigin: "bottom center",
                }}
              />
              {/* Wick */}
              <div className="w-px h-1 bg-stone-400" />
              {/* Candle body */}
              <div
                className="w-2.5 rounded-sm"
                style={{ height: `${14 + i * 2}px`, backgroundColor: color, opacity: 0.85 }}
              />
            </div>
          ))}
        </div>

        {/* Mini cake */}
        <div className="w-20">
          <div className="h-2 bg-pink-100 rounded-t-full border border-pink-200" />
          <div className="h-5 bg-amber-50 border border-amber-200 flex items-center justify-center">
            <span className="text-[6px] text-amber-700 font-bold">יום הולדת שמח!</span>
          </div>
          <div className="h-1.5 bg-coral-200 rounded-b-sm border border-amber-200" />
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
