"use client";

import { motion } from "framer-motion";

export function PunchingBagPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-px h-5 bg-gray-300" />
        <motion.div
          animate={{ rotate: [0, -12, 10, -5, 3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          className="w-9 h-14 rounded-[40%] flex items-center justify-center shadow-md"
          style={{ backgroundColor: "#d4826f" }}
        >
          <span className="text-white/60 font-bold text-[14px]">5</span>
        </motion.div>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-[6px] text-gray-500 font-medium mt-0.5"
        >
          🥊 לחצו להרביץ
        </motion.p>
      </div>
    </div>
  );
}
