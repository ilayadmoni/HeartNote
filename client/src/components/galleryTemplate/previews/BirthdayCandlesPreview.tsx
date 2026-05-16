"use client";

import { motion } from "framer-motion";

export function BirthdayCandlesPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-0">
        <div className="flex gap-2.5 relative z-10" style={{ marginBottom: "-1px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.15, 0.9, 1.1, 1], opacity: [1, 0.85, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                style={{ color: "#ffde59" }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </motion.div>
              <div className="w-2 h-6 rounded-t-sm bg-[#f5f0e8] border border-gray-200" />
            </div>
          ))}
        </div>

        <div
          className="w-20 h-8 rounded-t-[12px] rounded-b-md shadow-md relative overflow-hidden"
          style={{ backgroundColor: "#d4826f" }}
        >
          <div className="absolute top-0 w-full h-1.5 bg-white opacity-25" />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-1.5 text-[6px] text-[#415a77] font-medium"
        >
          🎂 לחצו לכיבוי
        </motion.p>
      </div>
    </div>
  );
}
