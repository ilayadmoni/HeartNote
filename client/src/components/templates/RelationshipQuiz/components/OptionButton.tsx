"use client";

/**
 * OptionButton Component
 * Single answer option with correct/wrong feedback styling
 */

import { motion } from "framer-motion";
import type { AnswerState } from "../types";
import { useReducedMotion } from "@/components/accessibility";

interface OptionButtonProps {
  option: string;
  isCorrect: boolean;
  isSelected: boolean;
  answerState: AnswerState;
  onClick: () => void;
}

export function OptionButton({
  option,
  isCorrect,
  isSelected,
  answerState,
  onClick,
}: OptionButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const getStyle = () => {
    if (answerState === "none") {
      return "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600";
    }
    if (isCorrect) return "bg-green-100 dark:bg-green-900/30 border-green-500";
    if (isSelected && !isCorrect)
      return "bg-red-100 dark:bg-red-900/30 border-red-500";
    return "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50";
  };

  return (
    <motion.button
      whileHover={!shouldReduceMotion && answerState === "none" ? { scale: 1.02 } : undefined}
      whileTap={!shouldReduceMotion && answerState === "none" ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={answerState !== "none"}
      className={`w-full p-5 md:p-4 rounded-xl border-2 text-right transition-all flex items-center justify-between min-h-[60px] ${getStyle()}`}
    >
      {/* Radio circle */}
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          answerState !== "none" && isCorrect
            ? "border-green-500 bg-green-500"
            : answerState !== "none" && isSelected && !isCorrect
              ? "border-red-500 bg-red-500"
              : "border-gray-300 dark:border-gray-500"
        }`}
      >
        {answerState !== "none" && isCorrect && (
          <span className="text-white text-xs">✓</span>
        )}
        {answerState !== "none" && isSelected && !isCorrect && (
          <span className="text-white text-xs">✗</span>
        )}
      </span>

      <span className="text-[#2e3c52] dark:text-white text-hebrew-body break-words flex-1 pr-3 max-w-[85%]">
        {option}
      </span>
    </motion.button>
  );
}
