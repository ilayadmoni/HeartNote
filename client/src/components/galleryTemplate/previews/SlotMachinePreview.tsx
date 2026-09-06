"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const SYMBOLS = ["🍒", "⭐", "🎰", "💎", "🍋", "🔔"] as const;

function Reel({ index }: { index: number }): JSX.Element {
  const [symbolIdx, setSymbolIdx] = useState(index);

  useEffect(() => {
    const interval = setInterval(
      () => setSymbolIdx((p) => (p + 1) % SYMBOLS.length),
      320 + index * 110,
    );
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="w-7 h-8 rounded border border-amber-400/50 bg-navy-950 flex items-center justify-center overflow-hidden">
      <motion.span
        key={symbolIdx}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="text-[14px] leading-none"
      >
        {SYMBOLS[symbolIdx]}
      </motion.span>
    </div>
  );
}

export function SlotMachinePreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="rounded-lg border border-navy-600 bg-navy-800 p-2 shadow-lift">
        {/* Screen */}
        <div className="mb-1.5 flex justify-center gap-1 rounded border border-amber-400/30 bg-navy-900 p-1.5">
          {[0, 1, 2].map((i) => (
            <Reel key={i} index={i} />
          ))}
        </div>

        {/* Lever button */}
        <div className="flex justify-center">
          <motion.div
            animate={{ scale: [1, 0.95, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-pill bg-amber-400 px-3 py-0.5 text-[6px] font-bold text-navy-900 shadow-soft"
          >
            {t("previews.slotMachine.cta")}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
