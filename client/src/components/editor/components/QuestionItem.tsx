"use client";

/** Single quiz-question editing card — extracted from QuestionsEditor.tsx (150-line file cap). */

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { QuizQuestion } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";

interface QuestionItemProps {
  question: QuizQuestion;
  index: number;
  canRemove: boolean;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, field: string, value: unknown) => void;
  onUpdateOption: (id: string, optIndex: number, value: string) => void;
}

const inputClass =
  "w-full px-3 py-2 text-body-sm rounded-control border border-line-strong bg-surface-raised text-ink " +
  "placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25";

export function QuestionItem({ question, index, canRemove, onRemove, onUpdateField, onUpdateOption }: QuestionItemProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-surface-sunken rounded-card p-3 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-caption font-bold text-ink-muted">{t("quiz.questionLabel", { num: index + 1 })}</span>
        <button
          onClick={() => onRemove(question.id)}
          disabled={!canRemove}
          className={`p-1 transition-colors rounded-control ${
            canRemove ? "text-ink-subtle hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-line-strong cursor-not-allowed opacity-50"
          }`}
          title={canRemove ? t("quiz.deleteQuestion") : t("quiz.mustKeepOne")}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <LimitedInput
        value={question.question}
        onChange={(v) => onUpdateField(question.id, "question", v)}
        maxLength={CHAR_LIMITS.QUESTION}
        placeholder={t("quiz.questionPlaceholder")}
        className={inputClass}
      />

      <div>
        <label className="text-[10px] text-green-600 dark:text-green-400 font-bold">✓ {t("quiz.correctAnswer")}</label>
        <LimitedInput
          value={question.options[question.correctIndex] || ""}
          onChange={(v) => onUpdateOption(question.id, question.correctIndex, v)}
          maxLength={CHAR_LIMITS.ANSWER}
          placeholder={t("quiz.correctAnswerPlaceholder")}
          className={`${inputClass} border-green-300 dark:border-green-700`}
        />
      </div>

      {question.options.map((opt, oi) => {
        if (oi === question.correctIndex) return null;
        return (
          <div key={oi}>
            <label className="text-[10px] text-red-400 font-bold">
              ✗ {t("quiz.wrongAnswer", { index: oi > question.correctIndex ? oi : oi + 1 })}
            </label>
            <LimitedInput
              value={opt}
              onChange={(v) => onUpdateOption(question.id, oi, v)}
              maxLength={CHAR_LIMITS.ANSWER}
              placeholder={t("quiz.wrongAnswerPlaceholder")}
              className={`${inputClass} border-red-200 dark:border-red-800`}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
