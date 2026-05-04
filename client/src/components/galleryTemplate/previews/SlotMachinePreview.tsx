"use client";

import { motion } from "framer-motion";

const SLOT_LABELS = [
  ["לחצי", "אני", "מחר"],
  ["כדי", "להזמין", "לפנק"],
  ["לגלות", "פיצה", "מסאז׳"],
];

export function SlotMachinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1">
          {SLOT_LABELS.map((labels, col) => (
            <div
              key={col}
              className="w-7 h-10 rounded-md bg-[#f2e9e4] dark:bg-gray-600 border border-gray-300 dark:border-gray-500 shadow-inner overflow-hidden relative"
            >
              <motion.div
                animate={{ y: [0, -40, -80, -40, 0] }}
                transition={{
                  duration: 2,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: col * 0.15,
                  ease: "easeInOut",
                }}
                className="flex flex-col"
              >
                {labels.map((label, i) => (
                  <div
                    key={i}
                    className="h-10 flex items-center justify-center text-[8px] font-bold text-[#2e3c52] dark:text-white"
                  >
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-3 py-1 rounded-full bg-[#d4826f] text-white text-[8px] font-bold shadow"
        >
          🎰 סובבי
        </motion.div>
      </div>
    </div>
  );
}
