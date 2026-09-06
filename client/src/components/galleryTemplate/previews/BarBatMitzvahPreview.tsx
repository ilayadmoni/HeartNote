"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Printed-invitation aesthetic: navy card, gold frame, Star of David motif.
 */
export function BarBatMitzvahPreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lift bg-gradient-to-br from-navy-800 to-navy-600">
        {/* Gold frame */}
        <div className="absolute inset-[3px] rounded-md border border-amber-400/60 pointer-events-none z-10" />

        <div className="relative z-0 p-3 flex flex-col items-center gap-1.5">
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-amber-400 text-[14px] leading-none"
            aria-hidden="true"
          >
            ✡
          </motion.span>

          <p className="text-[7px] font-bold text-amber-300 tracking-widest">
            {t("previews.barBatMitzvah.label")}
          </p>

          <div className="flex items-center gap-1 w-full" aria-hidden="true">
            <div className="flex-1 h-px bg-amber-400/40" />
            <span className="text-amber-400/60 text-[6px]">✦</span>
            <div className="flex-1 h-px bg-amber-400/40" />
          </div>

          <p className="text-[8px] font-semibold text-amber-100 text-center leading-tight">
            {t("previews.barBatMitzvah.name")}
          </p>

          <p className="text-[5px] text-amber-300/70 text-center leading-relaxed">
            {t("previews.barBatMitzvah.date")}
            <br />
            {t("previews.barBatMitzvah.venue")}
          </p>

          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-0.5 px-2 py-0.5 rounded-pill bg-amber-400 text-navy-900 text-[5px] font-bold shadow-soft"
          >
            {t("previews.barBatMitzvah.cta")}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
