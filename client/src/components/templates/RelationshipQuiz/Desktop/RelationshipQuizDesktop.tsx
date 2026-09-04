"use client";

/**
 * RelationshipQuizDesktop Component
 * Desktop layout — centered card with progress bar and title
 */

import { AnimatePresence } from "framer-motion";
import type { QuizViewProps } from "../types";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizProgressBar, QuestionCard, QuizResults } from "../components";
import { FooterBranding, BackToGallery } from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function RelationshipQuizDesktop({ data }: QuizViewProps) {
  const quiz = useQuiz(data.questions);
  const totalQuestions = data.questions.length;

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate">
      <FloatingIcons/>
      <BackToGallery className="top-4 end-4 absolute" />
      <div className="flex-1 w-full max-w-md mx-auto px-6 py-8">
        {/* Title */}
        {data.title && (
          <h1 className="text-display-md font-bold text-center text-ink mb-8 break-words max-w-[400px] mx-auto" dir="auto">
            {data.title}
          </h1>
        )}

        {quiz.isFinished ? (
          <div className="bg-surface-raised rounded-card shadow-lift p-8">
            <QuizResults
              score={quiz.score}
              total={totalQuestions}
              onPlayAgain={quiz.reset}
              scoreMessages={data.scoreMessages}
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
