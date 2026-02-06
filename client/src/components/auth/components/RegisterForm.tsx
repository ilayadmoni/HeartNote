"use client";

/**
 * RegisterForm Component
 * Compact registration form with name, email, password
 */

import { useState } from "react";
import { AuthInput } from "./AuthInput";
import { AUTH_LABELS, AUTH_PLACEHOLDERS, AUTH_VALIDATION } from "../constants";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function RegisterForm({ onSubmit, isSubmitting }: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = AUTH_VALIDATION.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = AUTH_VALIDATION.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = AUTH_VALIDATION.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = AUTH_VALIDATION.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = AUTH_VALIDATION.passwordMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit(formData.name, formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthInput
        id="register-name"
        label={AUTH_LABELS.name}
        type="text"
        placeholder={AUTH_PLACEHOLDERS.name}
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        error={errors.name}
      />

      <AuthInput
        id="register-email"
        label={AUTH_LABELS.email}
        type="email"
        placeholder={AUTH_PLACEHOLDERS.email}
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        error={errors.email}
      />

      <AuthInput
        id="register-password"
        label={AUTH_LABELS.password}
        type="password"
        placeholder={AUTH_PLACEHOLDERS.password}
        value={formData.password}
        onChange={(value) => setFormData({ ...formData, password: value })}
        error={errors.password}
      />

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
