"use client";

/**
 * CreationConfirmModal Component
 * Beautiful confirmation modal for creating a new template
 * Shows user profile, remaining creations, and expiration date
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useExpirationPolicy } from "@/hooks/useExpirationPolicy";

export interface CreationConfirmModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal without creating */
  onClose: () => void;
  /** Callback to confirm and create (receives nothing, parent handles the API call) */
  onConfirm: () => Promise<void>;
  /** The slug/ID of the template being created */
  templateSlug: string;
  /** The display name of the template (e.g., "הזמנה לדייט") */
  templateName: string;
}

export function CreationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  templateSlug,
  templateName,
}: CreationConfirmModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile data
  const { profile, loading: profileLoading } = useProfile();

  // Fetch expiration policy for the template
  const { expirationDate, loading: expirationLoading } =
    useExpirationPolicy(templateSlug);

  const loading = profileLoading || expirationLoading;

  // Calculate remaining creations
  const subscriptionTier = profile?.subscription.tier || "free";

  const currentCreations =
    subscriptionTier === "premium"
      ? profile?.subscription.creations_left_pro || 0
      : profile?.subscription.creations_left_free || 0;

  const remainingCreations = Math.max(0, currentCreations - 1);

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
      await onConfirm();
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
            className="relative w-full h-auto md:max-h-[90vh] max-h-[85dvh] max-w-md mx-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 z-10"
              aria-label="סגור"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>

            {/* Content */}
            <div className="pt-8 px-5 pb-5">
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
                    className="w-10 h-10 border-3 border-[#d4826f] border-t-transparent rounded-full mx-auto mb-4"
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
                    className="flex justify-center mb-4"
                  >
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover border-4 border-[#d4826f]/30 shadow-lg"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4826f] to-[#c4735f] flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-[#d4826f]/30">
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
                    <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-1 text-hebrew-heading">
                      אישור יצירה
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-hebrew-body">
                      בדוק את הפרטים לפני יצירה
                    </p>
                  </motion.div>

                  {/* Details Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 mb-4 space-y-2"
                  >
                    {/* Template Name */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-hebrew-body">
                        סוג יצירה:
                      </span>
                      <span className="text-sm font-bold text-[#2e3c52] dark:text-white text-hebrew-body text-right">
                        {templateName}
                      </span>
                    </div>

                    {/* Expiration Date */}
                    <div className="flex items-start justify-between gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-hebrew-body">
                        תוקף היצירה:
                      </span>
                      <span className="text-sm font-bold text-[#2e3c52] dark:text-white text-hebrew-body text-right">
                        {expirationDate || "לא זמין"}
                      </span>
                    </div>

                    {/* Remaining Creations */}
                    <div className="flex items-start justify-between gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-hebrew-body">
                        יצירות שנותרנו לאחר היצירה:
                      </span>
                      <motion.span
                        key={remainingCreations}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold text-[#2e3c52] dark:text-white text-hebrew-body text-right"
                      >
                        {remainingCreations}
                      </motion.span>
                    </div>

                    {/* Subscription Tier Badge */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span
                        className="px-3 py-1 text-xs font-bold rounded-full text-hebrew-body"
                        style={{
                          backgroundColor:
                            subscriptionTier === "premium"
                              ? "#f59e0b"
                              : "#22c55e",
                          color: "white",
                        }}
                      >
                        {subscriptionTier === "premium"
                          ? "פרימיום ⭐"
                          : "חינם ✨"}
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
                    className="text-center text-sm font-medium text-[#2e3c52] dark:text-gray-300 mb-4 text-hebrew-heading"
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
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-sm text-[#2e3c52] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading"
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
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-[#d4826f] to-[#c4735f] hover:from-[#c4735f] hover:to-[#b4635f] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading shadow-lg hover:shadow-xl"
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
                    className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body"
                  >
                    הערה: לא תוכל לערוך את הברכה לאחר יצירתה
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
