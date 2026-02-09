"use client";

/**
 * QuizResults Component
 * End-of-quiz score screen with percentage circle, message, and decorative stars
 * Uses theme color (coral) instead of purple, gender-neutral text
 */

import { motion } from "framer-motion";

interface QuizResultsProps {
  score: number;
  total: number;
  message: { message: string; emoji?: string };
}

export function QuizResults({ score, total, message }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Decorative stars */}
      <div className="relative w-full max-w-xs">
        {["⭐", "✨", "⭐", "✨", "⭐"].map((star, i) => (
          <motion.span
            key={i}
            className="absolute text-lg text-yellow-400 opacity-60"
            style={{
              top: `${10 + (i % 3) * 25}%`,
              left: `${5 + i * 20}%`,
            }}
            animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
          >
            {star}
          </motion.span>
        ))}
      </div>

      {/* Score Circle - theme color */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-40 h-40 rounded-full bg-gradient-to-br from-[#d4826f] to-[#c4735f] flex flex-col items-center justify-center shadow-xl mb-6 relative"
      >
        <span className="text-[10px] uppercase tracking-widest text-yellow-300 font-bold text-english-heading bg-yellow-400/20 px-2 py-0.5 rounded-full absolute -top-3">
          Final Score
        </span>
        <span className="text-4xl font-black text-white text-english-heading">
          {percentage}%
        </span>
      </motion.div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading text-center">
        {message.message}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-hebrew-body text-center">
        מכירים אותי הכי טוב בעולם
      </p>

      {/* Retry Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold rounded-full text-hebrew-heading transition-colors"
      >
        חזרה להתחלה
      </motion.button>
    </div>
  );
}
