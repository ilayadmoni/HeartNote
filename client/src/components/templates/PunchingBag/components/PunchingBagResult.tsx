"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TemplateResetButton } from "@/components/templates/components";
import type { PunchingBagData } from "@/components/templates/types";

interface PunchingBagResultProps {
  data: PunchingBagData;
  primaryColor: string;
  onReset: () => void;
  size?: "sm" | "lg";
}

export function PunchingBagResult({
  data,
  primaryColor,
  onReset,
  size = "lg",
}: PunchingBagResultProps) {
  const t = useTranslations("templates");
  const iconSize = size === "lg" ? 64 : 48;
  return (
    <motion.div
      key="result-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
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

      <h2
        className={`${size === "lg" ? "text-title-lg" : "text-title-md"} font-bold mb-4 break-words`}
        style={{ color: primaryColor }}
        dir="auto"
      >
        {data.resultTitle ?? t("punchingBag.resultTitleDefault")}
      </h2>

      <p className="text-xl text-ink-muted max-w-md mb-8 leading-relaxed break-words" dir="auto">
        {data.resultMessage}
      </p>

      <TemplateResetButton onClick={onReset} label={t("punchingBag.anotherRound")} />
    </motion.div>
  );
}
