"use client";

/**
 * RelationshipQuizMobile Component
 * Mobile layout — full-width card with compact spacing
 */

import { AnimatePresence } from "framer-motion";
import type { QuizViewProps } from "../types";
import { useQuiz } from "../hooks/useQuiz";
import { getScoreMessage } from "../constants";
import { QuizProgressBar, QuestionCard, QuizResults } from "../components";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function RelationshipQuizMobile({ data }: QuizViewProps) {
  const quiz = useQuiz(data.questions);
  const percentage = Math.round((quiz.score / data.questions.length) * 100);
  const scoreMsg = getScoreMessage(percentage, data.scoreMessages);

  return (
    <div className="min-h-[420px] bg-[#faf7f5] dark:bg-gray-900 px-4 py-6 relative flex flex-col justify-between gap-6">
      {/* Main Content - Top */}
      <div className="max-w-md mx-auto w-full">
        <BackToGallery className="mb-3" />

        {/* Title */}
        {data.title && (
          <h1 className="text-2xl font-bold text-center text-[#2e3c52] dark:text-white mb-10 text-hebrew-heading break-words">
            {data.title.length > 50
              ? `${data.title.substring(0, 50)}...`
              : data.title}
          </h1>
        )}

        {quiz.isFinished ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
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

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
