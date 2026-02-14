"use client";

/**
 * RegisterForm Component
 * Registration form with first name, last name, email, password, confirm password, date of birth
 * Includes real-time validation and success state
 */

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthInput } from "./AuthInput";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import {
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  AUTH_VALIDATION,
  REGISTER_SUCCESS_MESSAGE,
} from "../constants";

interface RegisterFormProps {
  onSubmit: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string,
  ) => Promise<void>;
  isSubmitting: boolean;
  /** Server/Supabase error passed from parent */
  serverError?: string | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  agreedToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  agreedToTerms?: string;
}

// Password validation: min 8 chars, at least 1 letter and 1 number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function RegisterForm({ onSubmit, isSubmitting, serverError }: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time validation for individual fields
  const validateField = (
    field: keyof FormData,
    value: string | boolean,
  ): string | undefined => {
    switch (field) {
      case "firstName":
        return !(value as string).trim() ? AUTH_VALIDATION.firstNameRequired : undefined;
      case "lastName":
        return !(value as string).trim() ? AUTH_VALIDATION.lastNameRequired : undefined;
      case "email":
        if (!(value as string).trim()) return AUTH_VALIDATION.emailRequired;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string))
          return AUTH_VALIDATION.emailInvalid;
        return undefined;
      case "password":
        if (!value) return AUTH_VALIDATION.passwordRequired;
        if ((value as string).length < 8) return AUTH_VALIDATION.passwordMinLength;
        if (!PASSWORD_REGEX.test(value as string)) return AUTH_VALIDATION.passwordFormat;
        return undefined;
      case "confirmPassword":
        if (value !== formData.password)
          return AUTH_VALIDATION.passwordMismatch;
        return undefined;
      case "dateOfBirth": {
        if (!value) return AUTH_VALIDATION.dateOfBirthRequired;
        // Validate YYYY-MM-DD format
        const dateStr = value as string;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "תאריך לא תקין";
        const parsed = new Date(dateStr + "T00:00:00");
        if (isNaN(parsed.getTime())) return "תאריך לא תקין";
        return undefined;
      }
      case "agreedToTerms":
        return !value ? AUTH_VALIDATION.termsRequired : undefined;
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing, validate on blur instead
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: keyof FormData) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.dateOfBirth,
      );
      setIsSuccess(true);
    } catch (err) {
      console.error("[RegisterForm] Submit error:", err);
      // Error is displayed via serverError prop from AuthContext
    }
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-[#2e3c52] dark:text-white text-hebrew-body text-sm leading-relaxed">
          {REGISTER_SUCCESS_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full box-border">
      {/* Server Error (Supabase) */}
      {serverError && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
            {serverError}
          </p>
        </div>
      )}

      {/* Name Row - Two columns */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <AuthInput
          id="register-firstName"
          label={AUTH_LABELS.firstName}
          type="text"
          placeholder={AUTH_PLACEHOLDERS.firstName}
          value={formData.firstName}
          onChange={(value) => handleFieldChange("firstName", value)}
          error={errors.firstName}
        />

        <AuthInput
          id="register-lastName"
          label={AUTH_LABELS.lastName}
          type="text"
          placeholder={AUTH_PLACEHOLDERS.lastName}
          value={formData.lastName}
          onChange={(value) => handleFieldChange("lastName", value)}
          error={errors.lastName}
        />
      </div>

      <AuthInput
        id="register-email"
        label={AUTH_LABELS.email}
        type="email"
        placeholder={AUTH_PLACEHOLDERS.email}
        value={formData.email}
        onChange={(value) => handleFieldChange("email", value)}
        error={errors.email}
      />

      <BrandCalendar
        value={formData.dateOfBirth}
        onChange={(value) => handleFieldChange("dateOfBirth", value)}
        label={AUTH_LABELS.dateOfBirth}
        error={errors.dateOfBirth}
      />

      <AuthInput
        id="register-password"
        label={AUTH_LABELS.password}
        type="password"
        placeholder={AUTH_PLACEHOLDERS.password}
        value={formData.password}
        onChange={(value) => handleFieldChange("password", value)}
        error={errors.password}
        showPasswordToggle
      />

      <AuthInput
        id="register-confirmPassword"
        label={AUTH_LABELS.confirmPassword}
        type="password"
        placeholder={AUTH_PLACEHOLDERS.confirmPassword}
        value={formData.confirmPassword}
        onChange={(value) => handleFieldChange("confirmPassword", value)}
        error={errors.confirmPassword}
        showPasswordToggle
      />

      {/* Terms & Privacy Checkbox */}
      <div className="mt-3 mb-1">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <span className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => handleFieldChange("agreedToTerms", e.target.checked)}
              className="peer sr-only"
            />
            <span
              className="
                block w-4 h-4 rounded border-2
                border-gray-300 dark:border-gray-500
                bg-white dark:bg-gray-700
                peer-checked:bg-[#2e3c52] peer-checked:border-[#2e3c52]
                dark:peer-checked:bg-[#d4826f] dark:peer-checked:border-[#d4826f]
                peer-focus-visible:ring-2 peer-focus-visible:ring-[#2e3c52] peer-focus-visible:ring-offset-1
                transition-all duration-150 cursor-pointer
              "
            />
            <svg
              className="absolute top-[3px] left-[3px] w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          </span>
          <span className="text-xs text-[#2e3c52] dark:text-gray-300 text-hebrew-body leading-relaxed">
            קראתי ואני מאשר/ת את{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="underline text-[#d4826f] hover:text-[#c4725f] dark:text-[#e8917a] dark:hover:text-[#f0a18a] font-semibold"
            >
              תנאי השימוש ומדיניות הפרטיות
            </Link>
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="text-xs text-red-500 mt-1 mr-6 text-hebrew-body">
            {errors.agreedToTerms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full py-2.5 px-4 mt-2 rounded-lg
          bg-[#2e3c52] hover:bg-[#1B263B]
          text-white font-bold text-base
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          text-hebrew-heading
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-2
        "
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
        ) : (
          "הרשמה"
        )}
      </button>
    </form>
  );
}
