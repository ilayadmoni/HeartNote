"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { DEFAULT_PRIMARY_COLOR } from "../types";
import type { InteractiveGreetingData } from "../types";

interface GreetingRevealProps {
  data: InteractiveGreetingData;
  titleFallback: string;
  accentColor?: string;
}

export function GreetingReveal({
  data,
  titleFallback,
  accentColor = DEFAULT_PRIMARY_COLOR,
}: GreetingRevealProps) {
  const t = useTranslations("templates");
  const title = data.greetingTitle || titleFallback;
  const signature = data.signature || data.senderName;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full rounded-card border border-line bg-surface-raised/88 p-6 text-center shadow-xl backdrop-blur-md"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-ink-muted" dir="auto">
        {data.recipientName ? `?${data.recipientName}` : ""}
      </p>
      <h2 className="mt-1 text-title-lg font-black" style={{ color: accentColor }} dir="auto">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-base leading-8 text-ink-muted" dir="auto">
        {data.message || t("holidays.messageDefault")}
      </p>
      {signature && (
        <p className="mt-5 text-sm font-bold text-ink-muted" dir="auto">
          {signature}
        </p>
      )}
    </motion.section>
  );
}
