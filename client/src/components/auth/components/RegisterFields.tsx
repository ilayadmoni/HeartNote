"use client";

import { AuthInput } from "./AuthInput";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import { RegisterTermsCheckbox } from "./RegisterTermsCheckbox";
import { RegisterSubmitButton } from "./RegisterSubmitButton";
import { AUTH_LABELS, AUTH_PLACEHOLDERS } from "../constants";
import type { RegisterFormData, RegisterFormErrors } from "./useRegisterForm";

interface RegisterFieldsProps {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  serverError?: string | null;
  submitError: string | null;
  isSubmitting: boolean;
  onFieldChange: (
    field: keyof RegisterFormData,
    value: string | boolean,
  ) => void;
}

export function RegisterFields({
  formData,
  errors,
  serverError,
  submitError,
  isSubmitting,
  onFieldChange,
}: RegisterFieldsProps) {
  const emailServerError =
    serverError === "מייל לא חוקי" ? serverError : undefined;
  const genericServerError =
    serverError && serverError !== "מייל לא חוקי" ? serverError : null;

  return (
    <>
      {genericServerError && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
            {genericServerError}
          </p>
        </div>
      )}

      {submitError && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
            {submitError}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <AuthInput
          id="register-firstName"
          label={AUTH_LABELS.firstName}
          type="text"
          placeholder={AUTH_PLACEHOLDERS.firstName}
          value={formData.firstName}
          maxLength={50}
          onChange={(value) => onFieldChange("firstName", value)}
          error={errors.firstName}
        />
        <AuthInput
          id="register-lastName"
          label={AUTH_LABELS.lastName}
          type="text"
          placeholder={AUTH_PLACEHOLDERS.lastName}
          value={formData.lastName}
          maxLength={50}
          onChange={(value) => onFieldChange("lastName", value)}
          error={errors.lastName}
        />
      </div>

      <AuthInput
        id="register-email"
        label={AUTH_LABELS.email}
        type="email"
        placeholder={AUTH_PLACEHOLDERS.email}
        value={formData.email}
        maxLength={254}
        onChange={(value) => onFieldChange("email", value)}
        error={errors.email || emailServerError}
      />

      <BrandCalendar
        value={formData.dateOfBirth}
        onChange={(value) => onFieldChange("dateOfBirth", value)}
        label={AUTH_LABELS.dateOfBirth}
        error={errors.dateOfBirth}
      />

      <AuthInput
        id="register-password"
        label={AUTH_LABELS.password}
        type="password"
        placeholder={AUTH_PLACEHOLDERS.password}
        value={formData.password}
        maxLength={128}
        onChange={(value) => onFieldChange("password", value)}
        error={errors.password}
        showPasswordToggle
      />

      <AuthInput
        id="register-confirmPassword"
        label={AUTH_LABELS.confirmPassword}
        type="password"
        placeholder={AUTH_PLACEHOLDERS.confirmPassword}
        value={formData.confirmPassword}
        maxLength={128}
        onChange={(value) => onFieldChange("confirmPassword", value)}
        error={errors.confirmPassword}
        showPasswordToggle
      />

      <RegisterTermsCheckbox
        checked={formData.agreedToTerms}
        onToggle={() =>
          onFieldChange("agreedToTerms", !formData.agreedToTerms)
        }
        error={errors.agreedToTerms}
      />

      <RegisterSubmitButton isSubmitting={isSubmitting} />
    </>
  );
}
