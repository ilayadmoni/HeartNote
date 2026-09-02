"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { X, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface PremiumTemplateUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumTemplateUpgradeModal({
  isOpen,
  onClose,
}: PremiumTemplateUpgradeModalProps): JSX.Element {
  const t = useTranslations("editor");
  useLockBodyScroll(isOpen);

  return (
    <motion.div
      key="premium-template-upgrade-overlay"
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/60 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <motion.div
        initial={false}
        animate={{ scale: isOpen ? 1 : 0.98, y: isOpen ? 0 : 12, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 bg-surface-raised rounded-card shadow-lift overflow-hidden"
      >
        <div className="relative bg-navy-700 p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 start-4 text-white/60 hover:text-white transition-colors"
            aria-label={t("premiumUpgrade.close")}
          >
            <X size={20} />
          </button>

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500 flex items-center justify-center shadow-glow-sm"
          >
            <Crown size={28} className="text-white" />
          </motion.div>

          <h2 className="text-title-sm font-bold text-white mb-1">{t("premiumUpgrade.title")}</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-control p-4">
            <p className="text-body-sm text-amber-800 dark:text-amber-300 leading-relaxed text-center">
              {t("premiumUpgrade.body")}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-line space-y-2.5">
          <Link
            href="/pricing"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-pill font-bold text-body-sm shadow-soft transition-colors flex items-center justify-center gap-2"
          >
            <Crown size={16} />
            {t("premiumUpgrade.cta")}
          </Link>

          <p className="text-[11px] text-center text-ink-muted px-2">
            {t("premiumUpgrade.note")}
          </p>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-body-sm text-ink-muted hover:text-ink transition-colors"
          >
            {t("premiumUpgrade.continueEditing")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
