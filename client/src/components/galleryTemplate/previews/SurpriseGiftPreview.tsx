"use client";

import { motion } from "framer-motion";

const SPARKLE_OFFSETS = ["-8px", "8px", "0px"] as const;

export function SurpriseGiftPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Floating sparkles */}
        <div className="relative h-6 w-20 flex items-end justify-center">
          {SPARKLE_OFFSETS.map((x, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              className="absolute text-[10px]"
              style={{ left: `calc(50% + ${x})` }}
            >
              ✨
            </motion.span>
          ))}
        </div>

        {/* Gift box */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          {/* Lid */}
          <div className="w-14 h-4 bg-coral-500 rounded-t-sm relative flex items-center justify-center">
            <div className="absolute inset-x-0 top-0 bottom-0 w-1.5 bg-amber-300 mx-auto" />
            <div className="absolute inset-y-0 left-0 right-0 h-1.5 bg-amber-300 my-auto" />
          </div>
          {/* Box body */}
          <div className="w-12 h-10 bg-coral-400 rounded-b-sm relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-y-0 w-1.5 bg-amber-300 left-1/2 -translate-x-1/2" />
            <div className="absolute inset-x-0 h-1.5 bg-amber-300 top-1/3" />
            <span className="relative z-10 text-[10px]">🎁</span>
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-coral-600 text-center">הפתעה מחכה!</p>
      </div>
    </div>
  );
}
