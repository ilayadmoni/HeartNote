"use client";

/**
 * PaidQuotaModal
 *
 * Shown when an active Lite or Premium subscriber has used all their
 * creation slots for the current billing cycle.
 *
 * Tone: warm, non-alarming, solution-focused.
 * - Never cancels / deactivates the subscription.
 * - Shows the expiry date so the user knows they're still covered.
 * - CTA is tier-aware (upgrade for Lite, contact support for Premium).
 */

import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { X, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/useProfile";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { PaidQuotaBody } from "./PaidQuotaBody";

interface PaidQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user clicks the tier-specific CTA — opens the UpgradeSlideOver. */
  onRequestUpgrade: () => void;
}

function formatExpiryDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function PaidQuotaModal({ isOpen, onClose, onRequestUpgrade }: PaidQuotaModalProps): JSX.Element {
  const t = useTranslations("editor");
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 60;
  const router = useRouter();
  const { profile } = useProfile();

  useLockBodyScroll(isOpen);

  const tier = profile?.subscription.tier ?? "lite";
  const isLite = tier === "lite";
  const creationLimit = profile?.subscription.creation_limit ?? 0;
  const expiryDate = formatExpiryDate(profile?.subscription.premium_expiry);

  const handleDismiss = () => {
    onClose();
    window.setTimeout(() => {
      router.push("/");
    }, CLOSE_THEN_NAVIGATE_DELAY_MS);
  };

  return (
    <motion.div
      key="paid-quota-overlay"
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`fixed inset-0 z-[999] bg-black/60 flex items-center justify-center backdrop-blur-sm ${
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
            aria-label={t("quota.close")}
          >
            <X size={20} />
          </button>

          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center shadow-glow-sm"
          >
            <Heart size={28} className="text-white fill-white" />
          </motion.div>

          <h2 className="text-title-sm font-bold text-white mb-1">{t("quota.paidTitle")}</h2>
          <p className="text-white/70 text-body-sm">
            {isLite ? t("quota.paidSubtitleLite") : t("quota.paidSubtitlePremium")}
            {" "}&middot;{" "}
            {t("quota.paidSubtitleCount", { count: creationLimit })}
          </p>
        </div>

        <PaidQuotaBody isLite={isLite} expiryDate={expiryDate} onClose={onClose} onRequestUpgrade={onRequestUpgrade} onDismiss={handleDismiss} />
      </motion.div>
    </motion.div>
  );
}
