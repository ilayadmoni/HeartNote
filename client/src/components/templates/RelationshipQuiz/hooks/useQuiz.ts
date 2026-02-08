"use client";

/**
 * useQuiz Hook
 * Manages quiz state: current question, score, answer feedback, auto-advance
 */

import { useState, useCallback, useEffect } from "react";
import type { QuizQuestion, AnswerState } from "../types";

interface UseQuizReturn {
  currentIndex: number;
  score: number;
  answerState: AnswerState;
  selectedIndex: number | null;
  isFinished: boolean;
  progress: number;
  handleAnswer: (optionIndex: number) => void;
}

export function useQuiz(questions: QuizQuestion[]): UseQuizReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("none");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const progress = questions.length > 0
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answerState !== "none" || !questions[currentIndex]) return;
      setSelectedIndex(optionIndex);
      const isCorrect = optionIndex === questions[currentIndex].correctIndex;
      setAnswerState(isCorrect ? "correct" : "wrong");
      if (isCorrect) setScore((prev) => prev + 1);
    },
    [answerState, currentIndex, questions],
  );

  // Auto-advance after 1.5s
  useEffect(() => {
    if (answerState === "none") return;
    const timer = setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswerState("none");
        setSelectedIndex(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [answerState, currentIndex, questions.length]);

  return {
    currentIndex,
    score,
    answerState,
    selectedIndex,
    isFinished,
    progress,
    handleAnswer,
  };
}
