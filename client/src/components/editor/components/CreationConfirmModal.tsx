"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/useProfile";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { usePolicies } from "@/hooks/usePolicies";
import { pushToDataLayer } from "@/utils/gtm";
import { ConfirmModalHeader } from "./ConfirmModalHeader";
import { CreationDetails } from "./CreationDetails";
import { ModalActions } from "./ModalActions";

type QuotaPreference = "free" | "pro";

export interface CreationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quotaPreference: QuotaPreference) => Promise<void>;
  templateSlug: string;
  templateName: string;
  isPremiumTemplate?: boolean;
  /** free_days from template.expiration_policy — used when subscription_policies has no free expiry */
  templateFreeDays?: number;
}

function formatDate(seconds: number | null | undefined): string | null {
  if (!Number.isFinite(Number(seconds)) || Number(seconds) <= 0) return null;
  const d = new Date(Date.now() + Number(seconds) * 1000);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function CreationConfirmModal({ isOpen, onClose, onConfirm, templateSlug, templateName, isPremiumTemplate = false, templateFreeDays = 1 }: CreationConfirmModalProps): JSX.Element {
  const t = useTranslations("editor");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<QuotaPreference>("pro");

  useLockBodyScroll(isOpen);
  const { profile, loading } = useProfile();
  const subscriptionTier = profile?.subscription.tier ?? "free";
  const isPaidTier = subscriptionTier !== "free";
  const { freePolicy, paidPolicy } = usePolicies(subscriptionTier);

  useEffect(() => {
    setSelectedQuota(isPremiumTemplate || isPaidTier ? "pro" : "free");
  }, [isPremiumTemplate, isPaidTier]);

  // Quota calculations
  const freeUsed = profile?.subscription.creations_count_free ?? 0;
  const proUsed  = profile?.subscription.creations_count_pro ?? 0;
  const freeTotalAllowed = (freePolicy.limit ?? 3) + (profile?.subscription.additional_creation_free ?? 0);
  const proTotalAllowed  = paidPolicy.limit == null ? null : paidPolicy.limit + (profile?.subscription.additional_creation_pro ?? 0);
  const freeRemaining = Math.max(0, freeTotalAllowed - freeUsed);
  const proRemaining  = proTotalAllowed == null ? Infinity : Math.max(0, proTotalAllowed - proUsed);
  const remainingAfterCreate = selectedQuota === "free"
    ? Math.max(0, freeRemaining - 1)
    : proRemaining === Infinity ? Infinity : Math.max(0, proRemaining - 1);
  const freeExpirySeconds = templateFreeDays * 24 * 60 * 60;
  const freeExpiryDate = formatDate(freeExpirySeconds) ?? t("confirmModal.noExpiry");
  const proExpiryDate  = formatDate(paidPolicy.expirySeconds) ?? t("confirmModal.unavailable");
  const selectedExpirationDate = selectedQuota === "free" ? freeExpiryDate : proExpiryDate;
  const avatar   = profile?.avatarUrl;
  const initials = `${(profile?.firstName?.[0] ?? "").toUpperCase()}${(profile?.lastName?.[0] ?? "").toUpperCase()}` || "❤️";

  const handleConfirm = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const appliedQuota: QuotaPreference = isPremiumTemplate ? "pro" : isPaidTier ? selectedQuota : "free";
      await onConfirm(appliedQuota);
      pushToDataLayer({ event: "generate_link", template_name: templateSlug });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("confirmModal.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleTierSelect = (tier: QuotaPreference) => {
    if (tier === "pro" && !isPaidTier) return;
    setSelectedQuota(tier);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/50" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-h-[90vh] max-h-[85dvh] max-w-[28rem] mx-4 bg-surface-raised rounded-card shadow-lift overflow-y-auto border border-accent/15">
            <button onClick={onClose} disabled={isSubmitting}
              className="absolute top-4 end-4 p-2 rounded-full hover:bg-surface-sunken transition-colors disabled:opacity-50 z-10" aria-label={t("confirmModal.close")}>
              <X size={24} className="text-ink-muted" />
            </button>

            <div className="pt-5 px-4 pb-4">
              {loading ? (
                <div className="text-center py-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-ink-muted">{t("confirmModal.loading")}</p>
                </div>
              ) : (
                <>
                  <ConfirmModalHeader
                    avatar={avatar} initials={initials} isPremiumTemplate={isPremiumTemplate} isPaidTier={isPaidTier}
                    selectedQuota={selectedQuota} freeUsed={freeUsed} proUsed={proUsed}
                    freeTotalAllowed={freeTotalAllowed} proTotalAllowed={proTotalAllowed}
                    freeRemaining={freeRemaining} proRemaining={proRemaining} onSelectTier={handleTierSelect}
                  />

                  <CreationDetails templateName={templateName} expirationDate={selectedExpirationDate}
                    remainingAfterCreate={remainingAfterCreate} selectedQuota={selectedQuota} />

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-control p-3 mb-4">
                      <p className="text-body-sm text-red-700 dark:text-red-300">{error}</p>
                    </motion.div>
                  )}

                  <ModalActions isSubmitting={isSubmitting} loading={loading} onClose={onClose} onConfirm={handleConfirm} />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
