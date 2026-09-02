"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { InteractiveGreetingData } from "../types";

interface HolidayRevealOverlayProps {
  data: InteractiveGreetingData;
  titleFallback: string;
  accentColor: string;
  onReplay: () => void;
}

export function HolidayRevealOverlay({
  data,
  titleFallback,
  accentColor,
  onReplay,
}: HolidayRevealOverlayProps) {
  const t = useTranslations("templates");
  const title = data.greetingTitle || titleFallback;
  const signature = data.signature || data.senderName;

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center rounded-card bg-surface/90 p-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42 }}
    >
      <motion.section
        className="w-full max-w-[22rem] overflow-hidden rounded-card border border-line bg-surface-raised/95 p-5 text-center shadow-2xl backdrop-blur-md"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        aria-live="polite"
      >
        {data.recipientName && (
          <p className="max-w-full break-words text-sm font-semibold text-ink-muted" dir="auto">
            {data.recipientName}
          </p>
        )}
        <h2
          className="mt-1 max-w-full break-words text-title-lg font-black"
          style={{ color: accentColor }}
          dir="auto"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-full whitespace-pre-line break-words text-base leading-7 text-ink-muted" dir="auto">
          {data.message || t("holidays.messageDefault")}
        </p>
        {signature && (
          <p className="mt-4 max-w-full break-words text-sm font-bold text-ink-muted" dir="auto">
            {signature}
          </p>
        )}
        <button
          type="button"
          onClick={onReplay}
          className="mt-5 rounded-pill bg-ink px-5 py-2.5 text-sm font-bold text-surface shadow-md transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("holidays.replay")}
        </button>
      </motion.section>
    </motion.div>
  );
}
