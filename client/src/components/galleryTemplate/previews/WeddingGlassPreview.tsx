"use client";

import { motion } from "framer-motion";

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-20 h-16 flex items-end justify-center">
          {/* Groom (left) */}
          <div className="absolute left-0 bottom-0 w-5 h-10">
            <svg viewBox="0 0 50 80" className="w-full h-full">
              <path d="M 20,30 L 20,60 L 25,60 L 25,30 Z" fill="#1b263b" />
              <path d="M 25,30 L 25,60 L 30,60 L 30,30 Z" fill="#1b263b" />
              <path d="M 18,8 R 10,10 L 32,8 Z" fill="#f2e9e4" />
              <path d="M 18,10 L 32,10 L 30,28 L 20,28 Z" fill="#1b263b" />
            </svg>
          </div>

          {/* Glass (center) */}
          <motion.div
            animate={{ scale: [1, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 w-2.5 h-3.5 bg-[#415a77] opacity-60 rounded-sm shadow"
          />

          {/* Bride (right) */}
          <div className="absolute right-0 bottom-0 w-5 h-10">
            <svg viewBox="0 0 50 80" className="w-full h-full">
              <path d="M 25,20 C 20,25 10,50 8,65 L 42,65 C 40,50 30,25 25,20 Z" fill="#fffcfa" />
              <path d="M 25,12 C 15,8 10,10 15,20 Z" fill="#cb8e7c" />
              <circle cx="25" cy="10" r="5" fill="#f2e9e4" />
            </svg>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-2 py-1 rounded-full bg-[#d4826f] text-white text-[6px] font-bold shadow"
        >
          💍 שבור!
        </motion.div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[5px] text-[#415a77] font-medium"
        >
          לחצו לשבירה
        </motion.p>
      </div>
    </div>
  );
}
