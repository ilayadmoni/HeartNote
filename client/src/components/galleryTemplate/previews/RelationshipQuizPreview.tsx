"use client";

import { motion } from "framer-motion";

const OPTIONS = ["א", "ב", "ג", "ד"];

export function RelationshipQuizPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] bg-white dark:bg-stone-800 rounded-xl p-2 shadow-md">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "33%" }}
              animate={{ width: "66%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="h-full bg-coral-400 rounded-full"
            />
          </div>
          <span className="text-[5px] text-stone-400">2/3</span>
        </div>

        {/* Question */}
        <p className="text-[6px] font-bold text-stone-700 dark:text-stone-200 text-center mb-1.5">
          איפה הדייט הראשון שלנו? 💕
        </p>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-1">
          {OPTIONS.map((opt, i) => (
            <div
              key={i}
              className={`py-1 rounded-lg text-center text-[6px] font-bold border ${
                i === 1
                  ? "bg-coral-500 text-white border-coral-500"
                  : "bg-stone-50 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
