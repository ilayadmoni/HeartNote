"use client";

import { motion } from "framer-motion";
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
  const title = data.greetingTitle || titleFallback;
  const signature = data.signature || data.senderName;

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.45rem] bg-[#faf7f5]/88 p-4 backdrop-blur-[2px] dark:bg-slate-950/88"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42 }}
    >
      <motion.section
        className="w-full max-w-[22rem] overflow-hidden rounded-3xl border border-white/90 bg-[#fffaf4]/98 p-5 text-center shadow-2xl shadow-coral-900/15 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/98"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        dir="rtl"
        aria-live="polite"
      >
        {data.recipientName && (
          <p className="max-w-full break-words text-sm font-semibold text-slate-500 dark:text-slate-300">
            {data.recipientName}
          </p>
        )}
        <h2
          className="mt-1 max-w-full break-words text-2xl font-black"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <p className="mt-4 max-w-full whitespace-pre-line break-words text-base leading-7 text-[#2e3c52] dark:text-slate-100">
          {data.message || "ברכה אישית שמחכה להתגלות."}
        </p>
        {signature && (
          <p className="mt-4 max-w-full break-words text-sm font-bold text-slate-600 dark:text-slate-300">
            {signature}
          </p>
        )}
        <button
          type="button"
          onClick={onReplay}
          className="mt-5 rounded-full bg-[#1b263b] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#2e3c52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
        >
          להפעיל שוב
        </button>
      </motion.section>
    </motion.div>
  );
}
