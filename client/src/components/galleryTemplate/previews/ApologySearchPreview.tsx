"use client";

import { motion } from "framer-motion";

export function ApologySearchPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2 w-full max-w-[120px]">
        <div className="w-full bg-white border border-gray-200 rounded-full px-2 py-1.5 flex items-center gap-1 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#415a77"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <motion.span
            className="text-[6px] text-[#1b263b] font-medium"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
            style={{ overflow: "hidden", whiteSpace: "nowrap", display: "inline-block" }}
          >
            איך לבקש סליחה?
          </motion.span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-px h-2.5 bg-[#1b263b]"
          />
        </div>

        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#d4826f]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          className="w-full bg-[#fdf6f2] border border-[#e8ddd8] rounded-lg p-1.5 flex items-center gap-1 shadow-sm"
        >
          <span className="text-[8px]">❤️</span>
          <span className="text-[5px] font-bold text-[#1b263b]">סליחה שהייתי עצבנית</span>
        </motion.div>
      </div>
    </div>
  );
}
