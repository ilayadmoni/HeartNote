"use client";

import { motion } from "framer-motion";
import { TemplateResetButton } from "@/components/templates/components";
import { useTranslations } from "next-intl";
import type { ApologySearchData } from "@/components/templates/types";

interface ApologySearchResultProps {
  data: ApologySearchData;
  primaryColor: string;
  onReset: () => void;
}

export function ApologySearchResult({ data, primaryColor, onReset }: ApologySearchResultProps) {
  const t = useTranslations("templates");
  return (
    <motion.div
      key="result-area"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center gap-6"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill={primaryColor}
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </motion.div>

      <div className="bg-surface-raised border border-line rounded-card px-10 py-8 shadow-xl flex flex-col items-center gap-3 max-w-sm">
        <h2 className="text-title-lg font-extrabold text-ink break-words w-full" dir="auto">
          {data.resultTitle}
        </h2>
        {data.resultSubtitle && (
          <p className="text-ink-muted leading-relaxed break-words w-full" dir="auto">
            {data.resultSubtitle}
          </p>
        )}
      </div>

      <TemplateResetButton onClick={onReset} label={t("apologySearch.searchAgain")} />
    </motion.div>
  );
}
