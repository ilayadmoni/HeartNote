"use client";

/**
 * RelationshipQuiz Component
 * Interactive quiz with progress bar, feedback, and score results
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  TemplateComponentProps,
  RelationshipQuizData,
  QuizQuestion,
} from "./types";

type AnswerState = "none" | "correct" | "wrong";

export function RelationshipQuiz({
  data,
}: TemplateComponentProps<RelationshipQuizData>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("none");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = data.questions[currentIndex];
  const progress = ((currentIndex + 1) / data.questions.length) * 100;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answerState !== "none") return;

      setSelectedIndex(optionIndex);
      const isCorrect = optionIndex === currentQuestion.correctIndex;
      setAnswerState(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    },
    [answerState, currentQuestion],
  );

  // Auto-advance after answer
  useEffect(() => {
    if (answerState === "none") return;

    const timer = setTimeout(() => {
      if (currentIndex < data.questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswerState("none");
        setSelectedIndex(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [answerState, currentIndex, data.questions.length]);

  const scorePercentage = Math.round((score / data.questions.length) * 100);
  const scoreMessage = getScoreMessage(scorePercentage, data.scoreMessages);

  if (isFinished) {
    return (
      <QuizResults
        score={score}
        total={data.questions.length}
        message={scoreMessage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 text-hebrew-body">
            <span>
              שאלה {currentIndex + 1} מתוך {data.questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#d4826f] to-[#e8917a]"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            {/* Question */}
            <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-6 text-center text-hebrew-heading">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <OptionButton
                  key={index}
                  option={option}
                  index={index}
                  isCorrect={index === currentQuestion.correctIndex}
                  isSelected={selectedIndex === index}
                  answerState={answerState}
                  onClick={() => handleAnswer(index)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface OptionButtonProps {
  option: string;
  index: number;
  isCorrect: boolean;
  isSelected: boolean;
  answerState: AnswerState;
  onClick: () => void;
}

function OptionButton({
  option,
  isCorrect,
  isSelected,
  answerState,
  onClick,
}: OptionButtonProps) {
  const getButtonStyle = () => {
    if (answerState === "none") {
      return "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600";
    }
    if (isCorrect) {
      return "bg-green-100 dark:bg-green-900/30 border-green-500";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-100 dark:bg-red-900/30 border-red-500";
    }
    return "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50";
  };

  return (
    <motion.button
      whileHover={answerState === "none" ? { scale: 1.02 } : undefined}
      whileTap={answerState === "none" ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={answerState !== "none"}
      className={`w-full p-4 rounded-xl border-2 text-right transition-all ${getButtonStyle()}`}
    >
      <span className="text-[#2e3c52] dark:text-white text-hebrew-body">
        {option}
      </span>
      {answerState !== "none" && isCorrect && (
        <span className="float-left">✓</span>
      )}
      {answerState !== "none" && isSelected && !isCorrect && (
        <span className="float-left">✗</span>
      )}
    </motion.button>
  );
}

interface QuizResultsProps {
  score: number;
  total: number;
  message: { message: string; emoji?: string };
}

function QuizResults({ score, total, message }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl block mb-4"
        >
          {message.emoji ||
            (percentage >= 70 ? "🎉" : percentage >= 40 ? "😊" : "💪")}
        </motion.span>

        <h2 className="text-4xl font-black text-[#d4826f] mb-2 text-hebrew-heading">
          {score}/{total}
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body">
          {percentage}% הצלחה
        </p>

        <p className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          {message.message}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold rounded-full text-hebrew-heading"
        >
          נסה שוב
        </motion.button>
      </motion.div>
    </div>
  );
}

function getScoreMessage(
  percentage: number,
  messages: { minScore: number; message: string; emoji?: string }[],
): { message: string; emoji?: string } {
  const sorted = [...messages].sort((a, b) => b.minScore - a.minScore);
  for (const msg of sorted) {
    if (percentage >= msg.minScore) {
      return msg;
    }
  }
  return { message: "כל הכבוד על הניסיון!", emoji: "💪" };
}
