"use client";

/**
 * QuizProgressBar Component
 * Shows question count and animated progress bar
 */

import { motion } from "framer-motion";

interface QuizProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

export function QuizProgressBar({ current, total, progress }: QuizProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 text-hebrew-body">
        <span>💡</span>
        <span className="text-english-body font-bold text-[#d4826f]">
          QUESTION {current} / {total}
        </span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-gradient-to-r from-[#e8917a] to-[#d4826f] rounded-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg, transparent, transparent 4px,
              rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 8px
            )`,
          }}
        />
      </div>
    </div>
  );
}
