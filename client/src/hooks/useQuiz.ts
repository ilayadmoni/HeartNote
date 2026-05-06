"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { QuizQuestion, AnswerState } from "@/components/templates/RelationshipQuiz/types";

interface ShuffledQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

function shuffleOptions(q: QuizQuestion): ShuffledQuestion {
  const indices = q.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    question: q.question,
    options: indices.map((i) => q.options[i]),
    correctIndex: indices.indexOf(q.correctIndex),
  };
}

interface UseQuizReturn {
  currentIndex: number;
  score: number;
  answerState: AnswerState;
  selectedIndex: number | null;
  isFinished: boolean;
  progress: number;
  handleAnswer: (optionIndex: number) => void;
  currentQuestion: ShuffledQuestion;
  reset: () => void;
}

export function useQuiz(questions: QuizQuestion[]): UseQuizReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("none");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const shuffledQuestions = useMemo(
    () => questions.map(shuffleOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, shuffleKey],
  );

  const currentQuestion = shuffledQuestions[currentIndex] ?? shuffledQuestions[0];

  const progress = questions.length > 0
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answerState !== "none" || !shuffledQuestions[currentIndex]) return;
      setSelectedIndex(optionIndex);
      const isCorrect = optionIndex === shuffledQuestions[currentIndex].correctIndex;
      setAnswerState(isCorrect ? "correct" : "wrong");
      if (isCorrect) setScore((prev) => prev + 1);
    },
    [answerState, currentIndex, shuffledQuestions],
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setAnswerState("none");
    setSelectedIndex(null);
    setIsFinished(false);
    setShuffleKey((k) => k + 1);
  }, []);

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
    currentQuestion,
    reset,
  };
}
