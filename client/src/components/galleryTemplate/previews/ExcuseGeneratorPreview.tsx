"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";

export function ExcuseGeneratorPreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-soft"
        >
          <Settings size={24} className="text-accent" strokeWidth={2} aria-hidden="true" />
        </motion.div>

        <div className="w-24 bg-surface-raised border border-line rounded-lg p-1.5 shadow-soft flex items-center justify-center min-h-[28px]">
          <motion.p
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}
            className="text-[6px] font-bold text-ink text-center leading-tight"
          >
            &ldquo;{t("previews.excuseGenerator.sampleExcuse")}&rdquo;
          </motion.p>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-3 py-1 rounded-pill bg-accent text-accent-ink text-[7px] font-bold shadow-soft flex items-center gap-1"
        >
          <Settings size={8} aria-hidden="true" />
          {t("previews.excuseGenerator.cta")}
        </motion.div>
      </div>
    </div>
  );
}
