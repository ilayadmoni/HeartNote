"use client";

/**
 * RelationshipQuizDesktop Component
 * Desktop layout — centered card with progress bar and title
 */

import { AnimatePresence } from "framer-motion";
import type { QuizViewProps } from "../types";
import { useQuiz } from "../hooks/useQuiz";
import { getScoreMessage } from "../constants";
import { QuizProgressBar, QuestionCard, QuizResults } from "../components";
import { FooterBranding, BackToGallery } from "@/components/templates/components";

export function RelationshipQuizDesktop({ data }: QuizViewProps) {
  const quiz = useQuiz(data.questions);
  const percentage = Math.round((quiz.score / data.questions.length) * 100);
  const scoreMsg = getScoreMessage(percentage, data.scoreMessages);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f5] dark:bg-gray-900 relative">
      <div className="flex-1 w-full max-w-md mx-auto px-6 py-8">
        <BackToGallery className="mb-4" />

        {/* Title */}
        {data.title && (
          <h1 className="text-3xl font-bold text-center text-[#2e3c52] dark:text-white mb-8 text-hebrew-heading">
            {data.title}
          </h1>
        )}

        {quiz.isFinished ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <QuizResults
              score={quiz.score}
              total={data.questions.length}
              message={scoreMsg}
            />
          </div>
        ) : (
          <>
            <QuizProgressBar
              current={quiz.currentIndex + 1}
              total={data.questions.length}
              progress={quiz.progress}
            />
            <AnimatePresence mode="wait">
              <QuestionCard
                question={quiz.currentQuestion}
                questionIndex={quiz.currentIndex}
                selectedIndex={quiz.selectedIndex}
                answerState={quiz.answerState}
                onAnswer={quiz.handleAnswer}
              />
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
