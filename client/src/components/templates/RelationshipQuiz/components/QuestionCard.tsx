"use client";

/**
 * QuestionCard Component
 * Animated card with question text and shuffled answer options
 */

import { motion } from "framer-motion";
import type { AnswerState } from "../types";
import { OptionButton } from "./OptionButton";
import { useReducedMotion } from "@/components/accessibility";

interface QuestionCardProps {
  question: { question: string; options: string[]; correctIndex: number };
  questionIndex: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  onAnswer: (index: number) => void;
}

export function QuestionCard({
  question,
  questionIndex,
  selectedIndex,
  answerState,
  onAnswer,
}: QuestionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={questionIndex}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      {/* Question */}
      <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-6 text-center text-hebrew-heading break-words max-w-[90%] mx-auto">
        {question.question}
      </h2>

      {/* Options - increased spacing for touch-friendly mobile */}
      <div className="space-y-4 md:space-y-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            isCorrect={index === question.correctIndex}
            isSelected={selectedIndex === index}
            answerState={answerState}
            onClick={() => onAnswer(index)}
          />
        ))}
      </div>
    </motion.div>
  );
}
