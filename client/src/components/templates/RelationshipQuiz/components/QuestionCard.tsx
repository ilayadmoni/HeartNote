"use client";

/**
 * QuestionCard Component
 * Animated card with question text and shuffled answer options
 */

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
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
  const locale = useLocale();
  const isRtl = locale === "he";
  const entranceX = isRtl ? -50 : 50;
  const exitX = isRtl ? 50 : -50;

  return (
    <motion.div
      key={questionIndex}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: entranceX }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: exitX }}
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      className="bg-surface-raised rounded-card shadow-lift p-6"
    >
      {/* Question */}
      <h2 className="text-title-md font-bold text-ink mb-6 text-center break-words max-w-[90%] mx-auto" dir="auto">
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
