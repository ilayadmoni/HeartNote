"use client";

import { LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import { Button } from "@/components/ui/Button";
import { AuthTermsCheckbox } from "./AuthTermsCheckbox";
import { useAuthLabels } from "../hooks/useAuthLabels";
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
  const t = useTranslations("auth");
  const { AUTH_LABELS } = useAuthLabels();

  const toggleTerms = () => {
    setProfileAgreedToTerms(!profileAgreedToTerms);
    if (profileTermsError) setProfileTermsError(null);
  };

  return (
    <motion.div
      key="complete-profile-step"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="pt-2"
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">
          <LogIn size={20} className="text-ink" />
        </div>
      </div>
      <h2 className="text-title-md font-black text-center text-ink mb-1">
        {t("completeProfile.stepTitle")}
      </h2>
      <p className="text-center text-ink-muted mb-5 text-caption">
        {t("completeProfile.stepSubtitle")}
      </p>

      {isProfileLoading ? (
        <div className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink" aria-hidden="true" />
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-3">
          <div>
            <label htmlFor="cp-modal-first-name" className="block text-caption mb-1.5 text-ink-muted">
              {AUTH_LABELS.firstName}
            </label>
            <input
              id="cp-modal-first-name"
              type="text"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              className="w-full rounded-control border border-line-strong bg-surface-raised px-3 py-2.5 text-body-md text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="cp-modal-last-name" className="block text-caption mb-1.5 text-ink-muted">
              {AUTH_LABELS.lastName}
            </label>
            <input
              id="cp-modal-last-name"
              type="text"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              className="w-full rounded-control border border-line-strong bg-surface-raised px-3 py-2.5 text-body-md text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <BrandCalendar
            value={profileForm.dateOfBirth}
            onChange={(value) => setProfileForm({ ...profileForm, dateOfBirth: value })}
            label={AUTH_LABELS.dateOfBirth}
            error={undefined}
          />

          <AuthTermsCheckbox
            checked={profileAgreedToTerms}
            onToggle={toggleTerms}
            error={profileTermsError}
          />

          <div className="h-5 flex items-center justify-center" role="status" aria-live="polite">
            <p className={`text-red-500 text-caption transition-opacity duration-base ${profileError ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {profileError || " "}
            </p>
          </div>

          <Button type="submit" isLoading={isPending} className="w-full">
            {t("completeProfile.submitButton")}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
