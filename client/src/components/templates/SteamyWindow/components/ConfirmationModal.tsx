"use client";

/**
 * ConfirmationModal Component
 *
 * A responsive confirmation modal displayed before final card submission.
 * - Full-screen dark overlay with backdrop blur (fixed inset-0 w-full h-full)
 * - Compact, rounded modal box (max-w-md, never full-screen on mobile)
 * - Buttons stack vertically on mobile, side-by-side (sm:flex-row-reverse) on sm+
 * - RTL oriented
 */

import { User } from "@supabase/supabase-js";

interface ConfirmationModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Close / cancel handler */
  onClose: () => void;
  /** Confirm / create handler */
  onConfirm: () => void;
  /** Name of the template or creation type */
  creationType?: string;
  /** Authenticated Supabase user (may be null while loading) */
  user?: User | null;
  /** Whether user data is still loading */
  isLoadingUser?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  creationType = "חלון מאודה",
  user = null,
  isLoadingUser = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayName = user?.user_metadata?.first_name || user?.email || "—";

  return (
    /* ── Overlay — fixed, covers the entire viewport ─────────────── */
    <div
      dir="rtl"
      className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* ── Modal box — compact floating card, never full-screen ── */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 sm:mx-auto max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white text-hebrew-heading">
            אישור יצירה
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-hebrew-body">
            אנא בדקו את הפרטים לפני היצירה
          </p>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-4">
          {isLoadingUser ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#c77d67] border-t-transparent rounded-full animate-spin" />
              <span className="mr-3 text-sm text-gray-500 text-hebrew-body">
                טוען פרטי משתמש…
              </span>
            </div>
          ) : (
            <>
              {/* User */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                  משתמש
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white text-hebrew-body">
                  {displayName}
                </span>
              </div>

              {/* Creation type */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                  סוג יצירה
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white text-hebrew-body">
                  {creationType}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                  תאריך
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white text-hebrew-body">
                  {today}
                </span>
              </div>

              {/* Remaining uses */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                  שימושים שנותרו
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white text-hebrew-body">
                  ללא הגבלה
                </span>
              </div>
            </>
          )}
        </div>

        {/* Buttons — vertical on mobile, side-by-side reversed on sm+ */}
        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoadingUser}
            className="w-full sm:flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-colors hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-hebrew-body"
            style={{ backgroundColor: "#c77d67" }}
          >
            יצירת כרטיס דיגיטלי
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-hebrew-body"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}
