"use client";

import { Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Props {
  questionText: string;
  successText: string;
  colorActive: boolean;
}

export function Step2EditorSheet({ questionText, successText, colorActive }: Props): JSX.Element {
  const t = useTranslations("demo.step2");

  return (
    <motion.div
      id="editor-sheet"
      className="absolute bottom-0 inset-x-0 bg-surface rounded-t-card shadow-lift px-5 pt-4 pb-6 z-30"
      style={{ y: "100%" }}
    >
      <div className="flex justify-center mb-3">
        <div className="w-10 h-1 bg-line-strong rounded-pill" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button type="button" className="text-caption text-accent flex items-center gap-1">
          <ChevronDown className="w-3.5 h-3.5" />
          {t("closeEdit")}
        </button>
        <span className="text-caption text-ink-subtle bg-surface-sunken px-2.5 py-1 rounded-pill">
          {t("validUntil", { date: "12/03/2026" })}
        </span>
      </div>

      <div className="mb-3">
        <label className="text-caption text-ink-muted block mb-1.5">{t("questionLabel")}</label>
        <motion.div id="question-input" className="border-[1.5px] rounded-control p-3 text-body-sm text-ink border-line bg-surface shadow-soft text-center min-h-[44px]">
          {questionText}
          <span className="inline-block w-0.5 h-4 bg-ink ms-1 animate-pulse align-middle" />
        </motion.div>
        <div className="text-caption text-ink-subtle mt-1 text-end">{questionText.length}/35</div>
      </div>

      <div className="mb-4">
        <label className="text-caption text-ink-muted block mb-1.5">{t("successLabel")}</label>
        <motion.div id="success-input" className="border rounded-control p-3 text-body-sm text-ink border-line bg-surface-sunken text-center min-h-[44px]">
          {successText}
        </motion.div>
      </div>

      <div>
        <label className="text-caption text-ink-muted block mb-2 text-center">{t("colorLabel")}</label>
        <div className="flex flex-wrap gap-3 justify-center">
          <div id="color-salmon" className="w-8 h-8 rounded-pill bg-accent flex items-center justify-center shadow-soft ring-2 ring-accent ring-offset-2">
            {colorActive && <Check className="w-4 h-4 text-accent-ink" />}
          </div>
          <div className="w-8 h-8 rounded-pill bg-pink-200 shadow-soft" />
          <div className="w-8 h-8 rounded-pill bg-purple-200 shadow-soft" />
          <div className="w-8 h-8 rounded-pill bg-blue-300 shadow-soft" />
          <div className="w-8 h-8 rounded-pill bg-green-200 shadow-soft" />
        </div>
        <p className="text-center text-caption text-ink-subtle mt-2">{t("colorName")}</p>
      </div>
    </motion.div>
  );
}
