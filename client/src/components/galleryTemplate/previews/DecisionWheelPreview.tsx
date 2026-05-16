"use client";

import { motion } from "framer-motion";

const WHEEL_SEGMENTS = [
  { color: "#FECDD3", label: "🍽️" },
  { color: "#C7CEEA", label: "🎬" },
  { color: "#B5EAD7", label: "🌲" },
  { color: "#FFDAC1", label: "🎮" },
  { color: "#E2F0CB", label: "💆" },
  { color: "#FCE4EC", label: "🍳" },
];

export function DecisionWheelPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="relative w-20 h-20">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-[#d4826f]" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600"
          style={{
            background: `conic-gradient(${WHEEL_SEGMENTS.map(
              (s, i) =>
                `${s.color} ${(i / WHEEL_SEGMENTS.length) * 360}deg ${((i + 1) / WHEEL_SEGMENTS.length) * 360}deg`,
            ).join(", ")})`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#d4826f] rounded-full flex items-center justify-center text-white text-[6px] font-bold shadow">
            !סובבו
          </div>
        </div>
      </div>
    </div>
  );
}
