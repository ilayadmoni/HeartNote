"use client";

import { useTranslations } from "next-intl";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import { Button } from "@/components/ui/Button";
import { AuthTermsCheckbox } from "@/components/auth/components/AuthTermsCheckbox";
import { useAuthLabels } from "@/components/auth/hooks/useAuthLabels";

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  agreedToTerms: boolean;
}

interface CompleteProfileFieldsProps {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  termsError: string | null;
  setTermsError: (v: string | null) => void;
  error: string | null;
  isValid: boolean;
  isSaving: boolean;
  onSave: () => void;
  onLogout: () => void;
}

export function CompleteProfileFields({
  form, setForm, termsError, setTermsError, error, isValid, isSaving, onSave, onLogout,
}: CompleteProfileFieldsProps) {
  const t = useTranslations("auth");
  const { AUTH_LABELS } = useAuthLabels();

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="cp-first-name" className="block text-caption mb-1 text-ink-muted">
          {AUTH_LABELS.firstName}
        </label>
        <input
          id="cp-first-name"
          value={form.firstName}
          onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
          className="w-full rounded-control border border-line-strong bg-surface-raised px-3 py-2.5 text-body-md text-ink"
        />
      </div>

      <div>
        <label htmlFor="cp-last-name" className="block text-caption mb-1 text-ink-muted">
          {AUTH_LABELS.lastName}
        </label>
        <input
          id="cp-last-name"
          value={form.lastName}
          onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
          className="w-full rounded-control border border-line-strong bg-surface-raised px-3 py-2.5 text-body-md text-ink"
        />
      </div>

      <BrandCalendar
        value={form.birthDate}
        onChange={(value) => setForm((prev) => ({ ...prev, birthDate: value }))}
        label={AUTH_LABELS.dateOfBirth}
      />

      <AuthTermsCheckbox
        checked={form.agreedToTerms}
        onToggle={() => {
          setForm((prev) => ({ ...prev, agreedToTerms: !prev.agreedToTerms }));
          if (termsError) setTermsError(null);
        }}
        error={termsError}
      />

      <p className={`text-caption text-center transition-opacity ${error ? "opacity-100 text-red-500" : "opacity-0"}`}>
        {error || " "}
      </p>

      <Button type="button" disabled={!isValid} isLoading={isSaving} onClick={onSave} className="w-full">
        {t("completeProfile.saveButton")}
      </Button>

      <Button type="button" variant="secondary" onClick={onLogout} className="w-full">
        {t("completeProfile.logout")}
      </Button>
    </div>
  );
}
