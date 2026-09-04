"use client";

/**
 * QuizResults Component
 * End-of-quiz score screen with percentage circle, message, and reset button
 * Uses theme color (coral) as prominent highlight, gender-neutral Hebrew text
 */

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/components/accessibility";
import { TemplateResetButton } from "@/components/templates/components";
import type { QuizScoreMessage } from "../types";

interface QuizResultsProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
  scoreMessages?: QuizScoreMessage[];
}

/**
 * Get dynamic feedback message based on score percentage.
 * Ten fixed tiers (<=10..<=100), sourced from `templates.relationshipQuiz.feedbackTiers`.
 */
function getFeedbackTierIndex(percentage: number): number {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  return Math.min(9, Math.max(0, Math.ceil(pct / 10) - 1));
}

function getScoreMessage(percentage: number, scoreMessages: QuizScoreMessage[] | undefined): string | null {
  if (!scoreMessages?.length) return null;
  const sorted = [...scoreMessages].sort((a, b) => b.minScore - a.minScore);
  const match = sorted.find((entry) => percentage >= entry.minScore);
  return match?.message ?? null;
}

export function QuizResults({ score, total, onPlayAgain, scoreMessages }: QuizResultsProps) {
  const t = useTranslations("templates");
  const percentage = Math.round((score / total) * 100);
  const shouldReduceMotion = useReducedMotion();
  const feedbackTiers = t.raw("relationshipQuiz.feedbackTiers") as string[];
  const feedbackMessage =
    getScoreMessage(percentage, scoreMessages) ?? feedbackTiers[getFeedbackTierIndex(percentage)];

  const [displayScore, setDisplayScore] = useState(shouldReduceMotion ? percentage : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayScore(percentage);
      return;
    }
    const controls = animate(0, percentage, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setDisplayScore(Math.round(value)),
    });
    return () => controls.stop();
  }, [percentage, shouldReduceMotion]);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-accent-soft to-transparent rounded-card">
      {/* Score Circle - theme color prominent highlight */}
      <motion.div
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 15 }}
        className="w-44 h-44 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent to-accent-hover flex flex-col items-center justify-center shadow-xl mb-8 ring-4 ring-accent/30"
      >
        <span className="text-5xl font-black text-white" dir="ltr">
          {displayScore}%
        </span>
        <span className="text-xs text-white/80 mt-1">
          {score} / {total}
        </span>
      </motion.div>

      {/* Dynamic Feedback Message with theme accent */}
      <div className="bg-accent-soft border border-accent-soft rounded-card px-6 py-4 mb-4">
        <h2
          className="text-title-md md:text-title-lg font-bold text-ink text-center break-words max-w-[300px] mx-auto leading-relaxed"
          dir="auto"
        >
          {feedbackMessage}
        </h2>
      </div>

      <p className="text-sm text-ink-muted mb-8 text-center">{t("relationshipQuiz.titleDefault")}</p>

      {/* Retry Button - theme color */}
      <TemplateResetButton onClick={onPlayAgain} label={t("relationshipQuiz.playAgain")} />
    </div>
  );
}
