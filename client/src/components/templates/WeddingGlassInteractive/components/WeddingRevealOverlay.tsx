"use client";

import { motion } from "framer-motion";
import type { WeddingInteractiveData } from "@/components/templates/types";

interface WeddingRevealOverlayProps {
  data: WeddingInteractiveData;
  onReplay: () => void;
}

export function WeddingRevealOverlay({ data, onReplay }: WeddingRevealOverlayProps) {
  const title = data.greetingTitle || "מזל טוב!";

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-[#faf7f5]/60 p-4 backdrop-blur-[1px] dark:bg-slate-950/60 sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.section
        className="w-full max-w-[22rem] overflow-hidden rounded-3xl border border-white/80 bg-[#fffaf4]/95 p-5 text-center shadow-2xl shadow-coral-900/15 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95 sm:p-6"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        dir="rtl"
        aria-live="polite"
      >
        <h2 className="max-w-full break-words text-2xl font-black text-[#1b263b] dark:text-white">
          {title}
        </h2>
        {data.coupleNames && (
          <p className="mt-1 max-w-full break-words text-sm font-bold text-[#d4826f]">
            {data.coupleNames}
          </p>
        )}
        <p className="mt-4 max-w-full whitespace-pre-line break-words text-base leading-7 text-[#2e3c52] dark:text-slate-100">
          {data.message || "שתבנו יחד בית מלא באהבה, צחוק וחברות טובה."}
        </p>
        {data.senderName && (
          <p className="mt-4 max-w-full break-words text-sm font-bold text-slate-600 dark:text-slate-300">
            {data.senderName}
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
