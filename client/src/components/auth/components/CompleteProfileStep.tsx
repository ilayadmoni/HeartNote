"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import type { CompleteProfileFormData } from "../types";

interface CompleteProfileStepProps {
  profileForm: CompleteProfileFormData;
  setProfileForm: (form: CompleteProfileFormData) => void;
  isProfileLoading: boolean;
  profileError: string | null;
  profileAgreedToTerms: boolean;
  setProfileAgreedToTerms: (v: boolean) => void;
  profileTermsError: string | null;
  setProfileTermsError: (v: string | null) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function CompleteProfileStep({
  profileForm, setProfileForm, isProfileLoading, profileError,
  profileAgreedToTerms, setProfileAgreedToTerms,
  profileTermsError, setProfileTermsError,
  onSubmit, isPending,
}: CompleteProfileStepProps) {
  return (
    <motion.div
      key="complete-profile-step"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="pt-2"
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-[#faf7f5] dark:bg-gray-700 flex items-center justify-center">
          <LogIn size={20} className="text-[#2e3c52] dark:text-white" />
        </div>
      </div>
      <h2 className="text-xl font-black text-center text-[#2e3c52] dark:text-white mb-1 text-hebrew-heading">
        נגיעות אחרונות
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-5 text-hebrew-body text-xs">
        השלימו את הפרטים כדי לסיים את ההרשמה עם Google
      </p>

      {isProfileLoading ? (
        <div className="py-8 flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-[#2e3c52]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-3">
          <div>
            <label htmlFor="cp-modal-first-name" className="block text-xs mb-1.5 text-gray-600 dark:text-gray-300 text-hebrew-body">
              שם פרטי
            </label>
            <input
              id="cp-modal-first-name"
              type="text"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-base text-[#2e3c52] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52]"
            />
          </div>

          <div>
            <label htmlFor="cp-modal-last-name" className="block text-xs mb-1.5 text-gray-600 dark:text-gray-300 text-hebrew-body">
              שם משפחה
            </label>
            <input
              id="cp-modal-last-name"
              type="text"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-base text-[#2e3c52] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52]"
            />
          </div>

          <BrandCalendar
            value={profileForm.dateOfBirth}
            onChange={(value) => setProfileForm({ ...profileForm, dateOfBirth: value })}
            label="תאריך לידה"
            error={undefined}
          />

          <div className="mt-1 mb-1">
            <div
              role="checkbox"
              aria-checked={profileAgreedToTerms}
              tabIndex={0}
              onClick={() => {
                setProfileAgreedToTerms(!profileAgreedToTerms);
                if (profileTermsError) setProfileTermsError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setProfileAgreedToTerms(!profileAgreedToTerms);
                  if (profileTermsError) setProfileTermsError(null);
                }
              }}
              className="flex items-center gap-2 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-1 rounded"
              dir="rtl"
            >
              <span className="text-xs text-[#2e3c52] dark:text-gray-300 text-hebrew-body leading-relaxed">
                קראתי ואני מאשר/ת את{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="underline text-[#d4826f] hover:text-[#c4725f] dark:text-[#e8917a] dark:hover:text-[#f0a18a] font-semibold"
                >
                  תנאי השימוש ומדיניות הפרטיות
                </Link>
              </span>
              <span className={`shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-[4px] border-2 transition-all duration-150 ${profileAgreedToTerms ? "bg-[#2e3c52] border-[#2e3c52] dark:bg-[#d4826f] dark:border-[#d4826f]" : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500"}`}>
                <svg className={`w-[11px] h-[11px] text-white pointer-events-none transition-all duration-150 ${profileAgreedToTerms ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </span>
            </div>
            {profileTermsError && (
              <p className="text-xs text-red-500 mt-1 text-hebrew-body text-right">{profileTermsError}</p>
            )}
          </div>

          <div className="h-5 flex items-center justify-center" role="status" aria-live="polite">
            <p className={`text-red-500 text-xs text-hebrew-body transition-opacity duration-200 ${profileError ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {profileError || " "}
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-lg bg-[#2e3c52] hover:bg-[#1B263B] text-white font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading"
          >
            {isPending ? "שומרים..." : "השלמת הרשמה"}
          </button>
        </form>
      )}
    </motion.div>
  );
}
