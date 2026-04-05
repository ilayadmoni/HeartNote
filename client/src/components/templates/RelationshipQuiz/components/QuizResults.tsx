"use client";

/**
 * QuizResults Component
 * End-of-quiz score screen with percentage circle, message, and decorative stars
 * Uses theme color (coral) as prominent highlight, gender-neutral Hebrew text
 */

import { motion } from "framer-motion";
import { getScoreMessageByPercentage } from "../constants";
import { useReducedMotion } from "@/components/accessibility";

interface QuizResultsProps {
  score: number;
  total: number;
  message?: { message: string }; // Optional - we calculate internally for accuracy
  onPlayAgain: () => void;
}

/**
 * Get dynamic feedback message based on score percentage
 * Uses robust if/else chain for exact tier matching
 */
function getDynamicFeedbackMessage(percentage: number): string {
  // Ensure percentage is within bounds
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));

  if (pct <= 10) {
    return "אוי ואבוי... אנחנו בכלל מכירים?!";
  } else if (pct <= 20) {
    return "טוב, לפחות ידעת איך קוראים לי... נראה לי.  יש הרבה מקום לשיפור!";
  } else if (pct <= 30) {
    return "התחלה סבירה, אבל ציפיתי ליותר!";
  } else if (pct <= 40) {
    return "לא רע, אבל יש לנו עוד הרבה מה ללמוד אחד על השני";
  } else if (pct <= 50) {
    return "חצי כוח! אנחנו חברים סבבה, אבל אפשר להעמיק את הקשר. ";
  } else if (pct <= 60) {
    return "יפה מאוד! אתה בהחלט מכיר אותי לא רע בכלל. ";
  } else if (pct <= 70) {
    return "מרשים! אנחנו חברים טובים ורואים את זה. מתי קובעים שוב? ";
  } else if (pct <= 80) {
    return "וואו, כמעט מושלם! אתה מכיר את השריטות שלי כמעט כמוני.";
  } else if (pct <= 90) {
    return "מדהים! אין ספק שאנחנו חברי אמת. כמעט 100%! ";
  } else {
    // 91% to 100%
    return "טלפתיה מוחלטת! ציון מושלם! ";
  }
}

export function QuizResults({ score, total, onPlayAgain }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);
  const shouldReduceMotion = useReducedMotion();
  // Always use dynamic calculation for accurate tier matching
  const feedbackMessage = getDynamicFeedbackMessage(percentage);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-[#d4826f]/10 to-transparent rounded-2xl">
      {/* Decorative stars - only animate if motion is allowed */}
      <div className="relative w-full max-w-xs">
        {["⭐", "✨", "⭐", "✨", "⭐"].map((star, i) => (
          <motion.span
            key={i}
            className="absolute text-lg text-yellow-400 opacity-60"
            style={{
              top: `${10 + (i % 3) * 25}%`,
              left: `${5 + i * 20}%`,
            }}
            animate={shouldReduceMotion ? {} : { y: [0, -6, 0], rotate: [0, 15, 0] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 2 + i * 0.3, repeat: Infinity }}
          >
            {star}
          </motion.span>
        ))}
      </div>

      {/* Score Circle - theme color prominent highlight */}
      <motion.div
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 15 }}
        className="w-44 h-44 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#d4826f] to-[#c4735f] flex flex-col items-center justify-center shadow-xl mb-8 relative ring-4 ring-[#d4826f]/30"
      >
        <span className="text-[10px] uppercase tracking-widest text-yellow-300 font-bold text-english-heading bg-yellow-400/20 px-2 py-0.5 rounded-full absolute -top-3">
          Final Score
        </span>
        <span className="text-5xl font-black text-white text-english-heading">
          {percentage}%
        </span>
        <span className="text-xs text-white/80 mt-1">
          {score} / {total}
        </span>
      </motion.div>

      {/* Dynamic Feedback Message with theme accent */}
      <div className="bg-[#d4826f]/10 border border-[#d4826f]/20 rounded-xl px-6 py-4 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading text-center break-words max-w-[300px] mx-auto leading-relaxed">
          {feedbackMessage}
        </h2>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-hebrew-body text-center">
        כמה את/ה מכיר/ה אותי?
      </p>

      {/* Retry Button - theme color */}
      <motion.button
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        onClick={onPlayAgain}
        className="px-10 py-4 bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold rounded-full text-hebrew-heading transition-colors shadow-lg shadow-[#d4826f]/30"
      >
        לשחק שוב
      </motion.button>
    </div>
  );
}
