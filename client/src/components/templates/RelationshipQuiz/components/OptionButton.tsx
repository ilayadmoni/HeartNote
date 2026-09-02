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
      return "bg-surface-sunken hover:bg-line border-line";
    }
    if (isCorrect) return "bg-green-100 dark:bg-green-900/30 border-green-500";
    if (isSelected && !isCorrect) return "bg-red-100 dark:bg-red-900/30 border-red-500";
    return "bg-surface-sunken border-line opacity-50";
  };

  return (
    <motion.button
      whileHover={!shouldReduceMotion && answerState === "none" ? { scale: 1.02 } : undefined}
      whileTap={!shouldReduceMotion && answerState === "none" ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={answerState !== "none"}
      className={`w-full p-5 md:p-4 rounded-control border-2 text-end transition-all flex items-center justify-between min-h-[60px] ${getStyle()}`}
    >
      {/* Radio circle */}
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          answerState !== "none" && isCorrect
            ? "border-green-500 bg-green-500"
            : answerState !== "none" && isSelected && !isCorrect
              ? "border-red-500 bg-red-500"
              : "border-line-strong"
        }`}
      >
        {answerState !== "none" && isCorrect && (
          <span className="text-white text-xs">✓</span>
        )}
        {answerState !== "none" && isSelected && !isCorrect && (
          <span className="text-white text-xs">✗</span>
        )}
      </span>

      <span className="text-ink break-words flex-1 pe-3 max-w-[85%]" dir="auto">
        {option}
      </span>
    </motion.button>
  );
}
