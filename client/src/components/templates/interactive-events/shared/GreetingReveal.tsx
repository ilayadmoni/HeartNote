"use client";

import { motion } from "framer-motion";
import type { InteractiveGreetingData } from "../types";

interface GreetingRevealProps {
  data: InteractiveGreetingData;
  titleFallback: string;
  accentColor?: string;
}

export function GreetingReveal({
  data,
  titleFallback,
  accentColor = "#d4826f",
}: GreetingRevealProps) {
  const title = data.greetingTitle || titleFallback;
  const signature = data.signature || data.senderName;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full rounded-2xl border border-white/70 bg-white/88 p-6 text-center shadow-xl shadow-coral-900/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/88"
      dir="rtl"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
        {data.recipientName ? `?${data.recipientName}` : ""}
      </p>
      <h2
        className="mt-1 text-2xl font-black text-hebrew-heading"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-base leading-8 text-[#2e3c52] dark:text-slate-100">
        {data.message || "ברכה אישית שמחכה להתגלות."}
      </p>
      {signature && (
        <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-300">
          {signature}
        </p>
      )}
    </motion.section>
  );
}
