"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function DateInvitePreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="bg-surface-raised px-4 py-3 rounded-xl shadow-soft text-center">
        <p className="text-[10px] font-bold text-ink mb-2">{t("previews.dateInvite.question")}</p>
        <div className="flex gap-2 justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-12 bg-accent rounded-md flex items-center justify-center text-[9px] text-accent-ink font-bold"
          >
            {t("previews.dateInvite.yes")}
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-6 w-12 bg-surface-sunken rounded-md flex items-center justify-center text-[9px] text-ink-subtle"
          >
            {t("previews.dateInvite.no")}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
