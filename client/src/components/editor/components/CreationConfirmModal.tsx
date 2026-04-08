"use client";

/**
 * CreationConfirmModal Component
 * Beautiful confirmation modal for creating a new template
 * Shows user profile, remaining creations, and expiration date
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Crown, Sparkles, X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useExpirationPolicy } from "@/hooks/useExpirationPolicy";
import { pushToDataLayer } from "@/utils/gtm";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { createClient } from "@/lib/supabase/client";

type QuotaPreference = "free" | "pro";

export interface CreationConfirmModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal without creating */
  onClose: () => void;
  /** Callback to confirm and create with selected quota preference */
  onConfirm: (quotaPreference: QuotaPreference) => Promise<void>;
  /** The slug/ID of the template being created */
  templateSlug: string;
  /** The display name of the template (e.g., "הזמנה לדייט") */
  templateName: string;
  /** Whether this template is premium-only */
  isPremiumTemplate?: boolean;
}

function formatDateFromNow(seconds: number | null | undefined): string | null {
  if (!Number.isFinite(Number(seconds))) {
    return null;
  }

  const secondsValue = Number(seconds);
  if (secondsValue <= 0) {
    return "מיידי";
  }

  const expiryDate = new Date(Date.now() + secondsValue * 1000);
  const dd = String(expiryDate.getDate()).padStart(2, "0");
  const mm = String(expiryDate.getMonth() + 1).padStart(2, "0");
  const yyyy = expiryDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function CreationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  templateSlug,
  templateName,
  isPremiumTemplate = false,
}: CreationConfirmModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<QuotaPreference>("pro");
  const [freePolicyLimit, setFreePolicyLimit] = useState<number>(3);
  const [freePolicyExpirySeconds, setFreePolicyExpirySeconds] = useState<
    number | null
  >(null);
  const [paidPolicyLimit, setPaidPolicyLimit] = useState<number | null>(null);
  const [paidPolicyExpirySeconds, setPaidPolicyExpirySeconds] = useState<
    number | null
  >(null);

  useLockBodyScroll(isOpen);

  // Fetch user profile data
  const { profile, loading: profileLoading } = useProfile();

  // Fetch expiration policy for the template
  const { expirationDate, loading: expirationLoading } =
    useExpirationPolicy(templateSlug);

  const loading = profileLoading || expirationLoading;
  const subscriptionTier = profile?.subscription.tier || "free";
  const isPaidTier = subscriptionTier !== "free";
  const showQuotaSelection = isPaidTier && !isPremiumTemplate;

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    const fetchPolicies = async () => {
      const { data: freePolicy } = await supabase
        .from("subscription_policies")
        .select("creation_limit, default_expiry")
        .eq("tier_code", "free")
        .single();

      if (!cancelled) {
        if (Number.isFinite(Number(freePolicy?.creation_limit))) {
          setFreePolicyLimit(Number(freePolicy?.creation_limit));
        }
        setFreePolicyExpirySeconds(
          Number.isFinite(Number(freePolicy?.default_expiry))
            ? Number(freePolicy?.default_expiry)
            : null,
        );
      }

      if (subscriptionTier !== "free") {
        const { data: paidPolicy } = await supabase
          .from("subscription_policies")
          .select("creation_limit, default_expiry")
          .eq("tier_code", subscriptionTier)
          .single();

        if (!cancelled) {
          const parsedLimit = paidPolicy?.creation_limit;
          setPaidPolicyLimit(
            parsedLimit == null || Number.isFinite(Number(parsedLimit))
              ? (parsedLimit as number | null)
              : null,
          );
          setPaidPolicyExpirySeconds(
            Number.isFinite(Number(paidPolicy?.default_expiry))
              ? Number(paidPolicy?.default_expiry)
              : null,
          );
        }
      }
    };

    fetchPolicies();

    return () => {
      cancelled = true;
    };
  }, [subscriptionTier]);

  // Calculate remaining creations – mirrors DB trigger formula:
  // free:    (subscription_policies.creation_limit + additional_creation_free) - creations_count_free
  // premium: (subscription_policies.creation_limit + additional_creation_pro)  - creations_count_pro  (limit is NULL → unlimited)

  useEffect(() => {
    if (!isPaidTier) {
      setSelectedQuota("free");
      return;
    }

    if (isPremiumTemplate) {
      setSelectedQuota("pro");
      return;
    }

    setSelectedQuota("pro");
  }, [isPremiumTemplate, isPaidTier]);

  const freeUsed = profile?.subscription.creations_count_free ?? 0;
  const freeTotalAllowed =
    freePolicyLimit + (profile?.subscription.additional_creation_free ?? 0);
  const proUsed = profile?.subscription.creations_count_pro ?? 0;
  const proTotalAllowed =
    paidPolicyLimit == null
      ? null
      : paidPolicyLimit + (profile?.subscription.additional_creation_pro ?? 0);

  const selectedUsed = selectedQuota === "free" ? freeUsed : proUsed;
  const selectedTotalAllowed =
    selectedQuota === "free" ? freeTotalAllowed : proTotalAllowed;
  const selectedRemainingCreations =
    selectedTotalAllowed == null
      ? Infinity
      : Math.max(0, selectedTotalAllowed - selectedUsed - 1);

  const freeExpirationDate =
    formatDateFromNow(freePolicyExpirySeconds) || "לא זמין";
  const proExpirationDate =
    formatDateFromNow(paidPolicyExpirySeconds) || expirationDate || "לא זמין";
  const selectedExpirationDate =
    selectedQuota === "free" ? freeExpirationDate : proExpirationDate;

  // Get avatar - use initials as fallback
  const avatar = profile?.avatarUrl;
  const initials =
    profile && (profile.firstName || profile.lastName)
      ? `${(profile.firstName?.[0] || "").toUpperCase()}${(profile.lastName?.[0] || "").toUpperCase()}`
      : "❤️";

  const handleConfirm = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const appliedQuota: QuotaPreference =
        isPremiumTemplate ? "pro" : isPaidTier ? selectedQuota : "free";
      await onConfirm(appliedQuota);
      pushToDataLayer({ event: "generate_link", template_name: templateSlug });
      // onClose will be called by parent after success
    } catch (err) {
      const message = err instanceof Error ? err.message : "אירעה שגיאה";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-auto md:max-h-[90vh] max-h-[85dvh] max-w-[28rem] mx-4 bg-white dark:bg-navy-800 rounded-3xl shadow-2xl overflow-y-auto border border-coral-100 dark:border-navy-600"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors disabled:opacity-50 z-10"
              aria-label="סגור"
            >
              <X size={24} className="text-gray-500 dark:text-gray-300" />
            </button>

            {/* Content */}
            <div className="pt-7 px-5 pb-5">
              {/* Loading State */}
              {loading ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-400 text-hebrew-body">
                    טוען פרטים...
                  </p>
                </div>
              ) : (
                <>
                  {/* Avatar Section */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className="flex justify-center mb-3"
                  >
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-coral-200 dark:border-coral-500/40 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-coral-200 dark:border-coral-500/40">
                        {initials}
                      </div>
                    )}
                  </motion.div>

                  {/* Header Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-center mb-4"
                  >
                    <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-1 text-hebrew-heading">
                      אישור יצירה
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-hebrew-body">
                      בחר איך להשתמש ביתרה עבור היצירה הזו
                    </p>
                  </motion.div>

                  {showQuotaSelection && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                      className="space-y-3 mb-4"
                    >
                      <p className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading text-right">
                        בחירת יתרה ליצירה זו
                      </p>

                      <label
                        className={`block rounded-2xl border p-3 cursor-pointer transition-all ${
                          selectedQuota === "free"
                            ? "border-coral-500 bg-coral-50 dark:bg-coral-900/20 shadow-sm"
                            : "border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="quotaPreference"
                          value="free"
                          checked={selectedQuota === "free"}
                          onChange={() => setSelectedQuota("free")}
                          className="sr-only"
                        />
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              selectedQuota === "free"
                                ? "text-coral-600"
                                : "text-gray-300 dark:text-navy-500"
                            }`}
                          />
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <span className="text-xs font-bold text-coral-700 dark:text-coral-300 text-hebrew-heading">
                                חינם
                              </span>
                              <Sparkles className="h-4 w-4 text-coral-500" />
                            </div>
                            <p className="text-sm font-semibold text-navy-700 dark:text-white text-hebrew-body leading-relaxed">
                              שימוש ביתרה חינמית
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 text-hebrew-body mt-1">
                              כולל סימן מים, תוקף קצר יותר
                            </p>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-200 text-hebrew-body mt-2">
                              נוצרו {freeUsed} מתוך {freeTotalAllowed}
                            </p>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`block rounded-2xl border p-3 cursor-pointer transition-all ${
                          selectedQuota === "pro"
                            ? "border-coral-500 bg-coral-50 dark:bg-coral-900/20 shadow-sm"
                            : "border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="quotaPreference"
                          value="pro"
                          checked={selectedQuota === "pro"}
                          onChange={() => setSelectedQuota("pro")}
                          className="sr-only"
                        />
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              selectedQuota === "pro"
                                ? "text-coral-600"
                                : "text-gray-300 dark:text-navy-500"
                            }`}
                          />
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <span className="text-xs font-bold text-coral-700 dark:text-coral-300 text-hebrew-heading">
                                פרימיום
                              </span>
                              <Crown className="h-4 w-4 text-coral-500" />
                            </div>
                            <p className="text-sm font-semibold text-navy-700 dark:text-white text-hebrew-body leading-relaxed">
                              שימוש ביתרת פרימיום
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 text-hebrew-body mt-1">
                              ללא סימן מים, תוקף מורחב
                            </p>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-200 text-hebrew-body mt-2">
                              נוצרו {proUsed} מתוך {proTotalAllowed ?? "ללא הגבלה"}
                            </p>
                          </div>
                        </div>
                      </label>
                    </motion.div>
                  )}

                  {/* Details Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 dark:bg-navy-700/70 rounded-2xl p-3 mb-4"
                  >
                    <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-navy-600">
                      <p className="text-xs text-gray-600 dark:text-gray-300 text-hebrew-body">
                        סוג יצירה
                      </p>
                      <p className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading text-right">
                        {templateName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 p-2.5 text-right">
                        <p className="text-[11px] text-gray-500 dark:text-gray-300 text-hebrew-body mb-1">
                          תוקף היצירה
                        </p>
                        <p className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading">
                          {selectedExpirationDate}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 p-2.5 text-right">
                        <p className="text-[11px] text-gray-500 dark:text-gray-300 text-hebrew-body mb-1">
                          יתרה לאחר היצירה
                        </p>
                        <motion.p
                          key={
                            selectedRemainingCreations === Infinity
                              ? "unlimited"
                              : `${selectedQuota}-${selectedRemainingCreations}`
                          }
                          initial={{ scale: 1.08 }}
                          animate={{ scale: 1 }}
                          className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading"
                        >
                          {selectedRemainingCreations === Infinity
                            ? "ללא הגבלה"
                            : selectedRemainingCreations}
                        </motion.p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full text-white text-hebrew-body ${
                          selectedQuota === "pro"
                            ? "bg-coral-500"
                            : "bg-navy-600"
                        }`}
                      >
                        {selectedQuota === "pro" ? "בחירת פרימיום" : "בחירה חינמית"}
                      </span>
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 mb-6"
                    >
                      <p className="text-sm text-red-700 dark:text-red-300 text-hebrew-body">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Confirmation Question */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-center text-sm font-medium text-navy-700 dark:text-gray-200 mb-4 text-hebrew-heading"
                  >
                    האם אתה בטוח שברצונך ליצור את הברכה?
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    {/* Back Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      disabled={isSubmitting || loading}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-navy-500 rounded-xl font-bold text-sm text-navy-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading"
                    >
                      חזור
                    </motion.button>

                    {/* Create Button */}
                    <motion.button
                      whileHover={{
                        scale: !isSubmitting && !loading ? 1.02 : 1,
                      }}
                      whileTap={{
                        scale: !isSubmitting && !loading ? 0.98 : 1,
                      }}
                      onClick={handleConfirm}
                      disabled={isSubmitting || loading}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting || loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>יוצר...</span>
                        </div>
                      ) : (
                        "יצירת ברכה דיגיטלית"
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Small Info Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-xs text-center text-gray-500 dark:text-gray-300 mt-2 text-hebrew-body"
                  >
                    הערה: לאחר יצירה לא ניתן לערוך את הברכה
                  </motion.p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
