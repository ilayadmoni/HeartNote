"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { BirthdayInteractiveData } from "@/components/templates/types";

interface BirthdayRevealOverlayProps {
  data: BirthdayInteractiveData;
  onReplay: () => void;
}

export function BirthdayRevealOverlay({ data, onReplay }: BirthdayRevealOverlayProps) {
  const t = useTranslations("templates");
  const title = data.greetingTitle || t("birthdayCandles.mazalTov");

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-surface/80 p-4 backdrop-blur-[1px] sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.section
        className="w-full max-w-[22rem] overflow-hidden rounded-card border border-line bg-surface-raised/95 p-5 text-center shadow-2xl backdrop-blur-md sm:p-6"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        aria-live="polite"
      >
        <h2 className="max-w-full break-words text-title-lg font-black text-ink" dir="auto">
          {title}
        </h2>
        {data.recipientName && (
          <p className="mt-1 max-w-full break-words text-sm font-bold text-accent" dir="auto">
            {data.recipientName}
          </p>
        )}
        <p className="mt-4 max-w-full whitespace-pre-line break-words text-base leading-7 text-ink-muted" dir="auto">
          {data.message || t("birthdayCandles.messageDefault")}
        </p>
        <button
          type="button"
          onClick={onReplay}
          className="mt-5 rounded-pill bg-ink px-5 py-2.5 text-sm font-bold text-surface shadow-md transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("birthdayCandles.relight")}
        </button>
      </motion.section>
    </motion.div>
  );
}
