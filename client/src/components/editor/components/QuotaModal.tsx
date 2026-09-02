"use client";

/**
 * QuotaModal Component
 * Shown when user has reached their free-tier page creation limit.
 * Prompts upgrade or waiting for existing pages to expire.
 *
 * Uses z-[999] so the backdrop covers the site header / navbar.
 */

import { useRouter, Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { X, Crown, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/useProfile";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotaModal({ isOpen, onClose }: QuotaModalProps): JSX.Element {
  const t = useTranslations("editor");
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 60;
  const router = useRouter();
  const { profile } = useProfile();

  useLockBodyScroll(isOpen);

  const creationLimit = profile?.subscription.creation_limit ?? 3; // Fallback to 3 if not loaded

  /** Dismiss → close the modal and go home */
  const handleDismiss = () => {
    onClose();
    window.setTimeout(() => {
      router.push("/");
    }, CLOSE_THEN_NAVIGATE_DELAY_MS);
  };

  return (
    <motion.div
      key="quota-overlay"
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`fixed inset-0 z-[999] bg-black/60 flex items-center justify-center backdrop-blur-sm ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      {/* Modal card */}
      <motion.div
        initial={false}
        animate={{ scale: isOpen ? 1 : 0.98, y: isOpen ? 0 : 12, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 bg-surface-raised rounded-card shadow-lift overflow-hidden"
      >
        {/* Header — premium accent block */}
        <div className="relative bg-navy-700 p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 start-4 text-white/60 hover:text-white transition-colors"
            aria-label={t("quota.close")}
          >
            <X size={20} />
          </button>

          {/* Animated crown icon */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500 flex items-center justify-center shadow-glow-sm"
          >
            <Crown size={28} className="text-white" />
          </motion.div>

          <h2 className="text-title-sm font-bold text-white mb-1">{t("quota.limitTitle")}</h2>
          <p className="text-white/70 text-body-sm">{t("quota.limitSubtitle", { limit: creationLimit })}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-control p-4">
            <p className="text-body-sm text-amber-800 dark:text-amber-300 leading-relaxed text-center">
              {t("quota.infoText", { limit: creationLimit })}
              <br />
              {t("quota.infoCta")}
            </p>
          </div>

          <div className="space-y-2.5">
            {[t("quota.feature1"), t("quota.feature2")].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
                <span className="text-body-sm text-ink-muted">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-line space-y-2.5">
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-pill font-bold text-body-sm shadow-soft transition-colors flex items-center justify-center gap-2"
          >
            <Crown size={16} />
            {t("quota.upgradeCta")}
          </Link>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 text-body-sm text-ink-muted hover:text-ink transition-colors"
          >
            {t("quota.later")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
