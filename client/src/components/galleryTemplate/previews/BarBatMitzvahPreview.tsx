"use client";

import { motion } from "framer-motion";

export function BarBatMitzvahPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        <div className="text-[8px] font-bold text-stone-600 dark:text-stone-300 mb-1">
          בר / בת
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-14 flex items-end justify-center relative"
        >
          <svg viewBox="0 0 100 120" className="w-full h-full">
            <path
              d="M 50,40 C 35,55 20,80 15,120 L 85,120 C 80,80 65,55 50,40 Z"
              fill="#fffcfa"
              stroke="#d4826f"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="30" r="10" fill="#f2e9e4" />
            <path
              d="M 40,25 C 35,20 30,25 35,35 C 40,28 60,28 65,35 C 70,25 65,20 60,25 Z"
              fill="#1b263b"
            />
            <g>
              <path d="M 38,20 L 42,12 L 50,18 L 58,12 L 62,20 Z" fill="#d4826f" />
              <circle cx="42" cy="15" r="1.5" fill="#fffcfa" />
              <circle cx="50" cy="20" r="2" fill="#fffcfa" />
              <circle cx="58" cy="15" r="1.5" fill="#fffcfa" />
            </g>
          </svg>
        </motion.div>

        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="px-2 py-1 rounded-full bg-[#d4826f] text-white text-[6px] font-bold shadow"
        >
          לחצו
        </motion.div>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-[5px] text-[#d4826f] font-bold text-center px-2 leading-tight"
        >
          ברכה מרגשת מחכה 🎉
        </motion.p>
      </div>
    </div>
  );
}
