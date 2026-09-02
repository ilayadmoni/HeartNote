"use client";

/** Icon + title header block for UpgradeSlideOver. Extracted for the 150-line file cap. */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Zap } from "lucide-react";
import type { RefObject } from "react";

interface UpgradeSlideOverHeaderProps {
  isLite: boolean;
  creationLimit: number;
  formattedExpiry: string | null;
  closeButtonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
}

export function UpgradeSlideOverHeader({ isLite, creationLimit, formattedExpiry, closeButtonRef, onClose }: UpgradeSlideOverHeaderProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <div className={`flex-shrink-0 p-6 ${isLite ? "bg-navy-700" : "bg-navy-600"}`}>
      <div className="flex items-start justify-between mb-4">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={t("upgrade.close")}
        >
          <X size={20} />
        </button>

        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glow-sm ${isLite ? "bg-amber-500" : "bg-accent"}`}
        >
          <Zap size={22} className="text-white fill-white" />
        </motion.div>
      </div>

      <div className="text-end">
        <h2 className="text-title-sm font-bold text-white mb-1">
          {isLite ? t("upgrade.titleLite") : t("upgrade.titlePremium")}
        </h2>
        <p className="text-white/70 text-body-sm">
          {isLite ? t("upgrade.usedOfLite", { limit: creationLimit }) : t("upgrade.usedOfPro", { limit: creationLimit })}
        </p>
        {formattedExpiry && (
          <p className="text-white/50 text-caption mt-1">{t("upgrade.activeUntil", { date: formattedExpiry })}</p>
        )}
      </div>
    </div>
  );
}
