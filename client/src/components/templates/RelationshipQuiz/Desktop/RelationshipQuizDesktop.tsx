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
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-12 px-6 relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      <div className="max-w-lg mx-auto">
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
      <FooterBranding className="absolute bottom-4 left-1/2 -translate-x-1/2" />
    </div>
  );
}
