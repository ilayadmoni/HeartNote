"use client";

/**
 * RelationshipQuizMobile Component
 * Mobile layout — full-width card with compact spacing
 */

import { AnimatePresence } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import type { QuizViewProps } from "../types";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizProgressBar, QuestionCard, QuizResults } from "../components";
import {
  FooterBranding,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function RelationshipQuizMobile({ data }: QuizViewProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const quiz = useQuiz(data.questions);
  const totalQuestions = data.questions.length;

  return (
    <div className={`bg-transparent px-4 py-6 relative isolate flex flex-col justify-between items-center gap-6 ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[100dvh]'
    }`}>
      <FloatingIcons />
      {/* Main Content - Top */}
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center">
        {/* Title */}
        {data.title && (
          <h1
            className="text-title-lg font-bold text-center text-ink mb-10 break-words max-w-[300px] mx-auto"
            dir="auto"
          >
            {data.title.length > 50 ? `${data.title.substring(0, 50)}...` : data.title}
          </h1>
        )}

        {quiz.isFinished ? (
          <div className="bg-surface-raised rounded-card shadow-lift p-6">
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

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
