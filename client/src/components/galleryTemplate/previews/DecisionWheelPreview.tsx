"use client";

import { motion } from "framer-motion";

const SEGMENTS = [
  "#f43f5e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f97316",
];

const conicGradient = SEGMENTS.map(
  (color, i) =>
    `${color} ${(i / SEGMENTS.length) * 360}deg ${((i + 1) / SEGMENTS.length) * 360}deg`,
).join(", ");

export function DecisionWheelPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        {/* Pointer */}
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-navy-700 mb-[-2px]" />

        {/* Spinning wheel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16 rounded-full shadow-md border-2 border-navy-200"
          style={{ background: `conic-gradient(${conicGradient})` }}
        >
          {/* Center hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full border border-navy-300 shadow" />
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-navy-700 dark:text-navy-200 text-center">
          סובבו לגורל!
        </p>
      </div>
    </div>
  );
}
