"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { usePolicies } from "@/hooks/usePolicies";
import { pushToDataLayer } from "@/utils/gtm";
import { TierCard } from "./TierCard";
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
}

function formatDate(seconds: number | null | undefined): string | null {
  if (!Number.isFinite(Number(seconds)) || Number(seconds) <= 0) return null;
  const d = new Date(Date.now() + Number(seconds) * 1000);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function CreationConfirmModal({ isOpen, onClose, onConfirm, templateSlug, templateName, isPremiumTemplate = false }: CreationConfirmModalProps) {
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
  const freeExpiryDate = formatDate(freePolicy.expirySeconds) ?? "ללא תוקף";
  const proExpiryDate  = formatDate(paidPolicy.expirySeconds) ?? "לא זמין";
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
      setError(err instanceof Error ? err.message : "אירעה שגיאה");
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
            className="relative w-full md:max-h-[90vh] max-h-[85dvh] max-w-[28rem] mx-4 bg-white dark:bg-navy-800 rounded-3xl shadow-2xl overflow-y-auto border border-coral-100 dark:border-navy-600">
            <button onClick={onClose} disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors disabled:opacity-50 z-10" aria-label="סגור">
              <X size={24} className="text-gray-500 dark:text-gray-300" />
            </button>

            <div className="pt-7 px-5 pb-5">
              {loading ? (
                <div className="text-center py-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-hebrew-body">טוען פרטים...</p>
                </div>
              ) : (
                <>
                  {/* Avatar */}
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300 }} className="flex justify-center mb-3">
                    {avatar
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-4 border-coral-200 dark:border-coral-500/40 shadow-lg" />
                      : <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-coral-200 dark:border-coral-500/40">{initials}</div>
                    }
                  </motion.div>

                  {/* Header */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center mb-4">
                    <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-1 text-hebrew-heading">אישור יצירה</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-hebrew-body">בחר איך להשתמש ביתרה עבור היצירה הזו</p>
                  </motion.div>

                  {/* 2-column tier selection */}
                  {!isPremiumTemplate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-4">
                      <p className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading text-right mb-2">בחירת יתרה ליצירה זו</p>
                      <div className="grid grid-cols-2 gap-3">
                        <TierCard tier="free" used={freeUsed} totalAllowed={freeTotalAllowed}
                          isSelected={selectedQuota === "free"} isDisabled={freeRemaining === 0}
                          isUpgradeRequired={false} onSelect={() => handleTierSelect("free")} />
                        <TierCard tier="pro" used={proUsed} totalAllowed={proTotalAllowed}
                          isSelected={selectedQuota === "pro"} isDisabled={proRemaining === 0}
                          isUpgradeRequired={!isPaidTier} onSelect={() => handleTierSelect("pro")} />
                      </div>
                    </motion.div>
                  )}

                  <CreationDetails templateName={templateName} expirationDate={selectedExpirationDate}
                    remainingAfterCreate={remainingAfterCreate} selectedQuota={selectedQuota} />

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 mb-4">
                      <p className="text-sm text-red-700 dark:text-red-300 text-hebrew-body">{error}</p>
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
