"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function RelationshipQuizPreview(): JSX.Element {
  const t = useTranslations("gallery");
  const options = [
    t("previews.relationshipQuiz.optionA"),
    t("previews.relationshipQuiz.optionB"),
    t("previews.relationshipQuiz.optionC"),
    t("previews.relationshipQuiz.optionD"),
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] bg-surface-raised rounded-xl p-2 shadow-card">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex-1 h-1.5 bg-surface-sunken rounded-pill overflow-hidden">
            <motion.div
              initial={{ width: "33%" }}
              animate={{ width: "66%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="h-full bg-salmon-400 rounded-pill"
            />
          </div>
          <span className="text-[5px] text-ink-subtle">2/3</span>
        </div>

        {/* Question */}
        <p className="text-[6px] font-bold text-ink text-center mb-1.5">
          {t("previews.relationshipQuiz.question")} 💕
        </p>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-1">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`py-1 rounded-lg text-center text-[6px] font-bold border ${
                i === 1
                  ? "bg-salmon-500 text-white border-salmon-500"
                  : "bg-surface-sunken text-ink-muted border-line"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
