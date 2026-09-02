"use client";

/**
 * QuizResults Component
 * End-of-quiz score screen with percentage circle, message, and decorative stars
 * Uses theme color (coral) as prominent highlight, gender-neutral Hebrew text
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/components/accessibility";
import { TemplateResetButton } from "@/components/templates/components";

interface QuizResultsProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
}

/**
 * Get dynamic feedback message based on score percentage.
 * Ten fixed tiers (<=10..<=100), sourced from `templates.relationshipQuiz.feedbackTiers`.
 */
function getFeedbackTierIndex(percentage: number): number {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  return Math.min(9, Math.max(0, Math.ceil(pct / 10) - 1));
}

export function QuizResults({ score, total, onPlayAgain }: QuizResultsProps) {
  const t = useTranslations("templates");
  const percentage = Math.round((score / total) * 100);
  const shouldReduceMotion = useReducedMotion();
  const feedbackTiers = t.raw("relationshipQuiz.feedbackTiers") as string[];
  const feedbackMessage = feedbackTiers[getFeedbackTierIndex(percentage)];

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-accent-soft to-transparent rounded-card">
      {/* Decorative stars - only animate if motion is allowed */}
      <div className="relative w-full max-w-xs">
        {["⭐", "✨", "⭐", "✨", "⭐"].map((star, i) => (
          <motion.span
            key={i}
            className="absolute text-lg text-yellow-400 opacity-60"
            style={{
              top: `${10 + (i % 3) * 25}%`,
              left: `${5 + i * 20}%`,
            }}
            animate={shouldReduceMotion ? {} : { y: [0, -6, 0], rotate: [0, 15, 0] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 2 + i * 0.3, repeat: Infinity }}
          >
            {star}
          </motion.span>
        ))}
      </div>

      {/* Score Circle - theme color prominent highlight */}
      <motion.div
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 15 }}
        className="w-44 h-44 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent to-accent-hover flex flex-col items-center justify-center shadow-xl mb-8 relative ring-4 ring-accent/30"
      >
        <span
          className="text-[10px] uppercase tracking-widest text-yellow-300 font-bold bg-yellow-400/20 px-2 py-0.5 rounded-full absolute -top-3"
          dir="ltr"
        >
          {t("relationshipQuiz.finalScore")}
        </span>
        <span className="text-5xl font-black text-white" dir="ltr">
          {percentage}%
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
