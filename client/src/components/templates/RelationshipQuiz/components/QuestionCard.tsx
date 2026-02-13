"use client";

/**
 * QuestionCard Component
 * Animated card with question text and shuffled answer options
 */

import { motion } from "framer-motion";
import type { AnswerState } from "../types";
import { OptionButton } from "./OptionButton";

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
  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      {/* Question */}
      <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-6 text-center text-hebrew-heading break-words max-w-[280px] mx-auto">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
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
