"use client";

/**
 * QuizProgressBar Component
 * Shows question count and animated progress bar
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";

interface QuizProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

export function QuizProgressBar({ current, total, progress }: QuizProgressBarProps) {
  const t = useTranslations("templates");
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-ink-muted mb-2">
        <Lightbulb size={16} aria-hidden="true" />
        <span className="font-bold text-accent">
          {t("relationshipQuiz.questionLabel", { current, total })}
        </span>
      </div>
      <div className="h-3 bg-surface-sunken rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-gradient-to-r from-brand-400 to-accent rounded-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg, transparent, transparent 4px,
              rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 8px
            )`,
          }}
        />
      </div>
    </div>
  );
}
