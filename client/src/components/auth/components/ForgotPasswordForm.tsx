"use client";

/**
 * ForgotPasswordForm Component
 * Allows users to request a password reset email via the
 * requestPasswordReset server action (3-strike limit).
 */

import { useState, useTransition } from "react";
import { KeyRound, ArrowRight, CheckCircle } from "lucide-react";
import { AuthInput } from "./AuthInput";
import { requestPasswordReset } from "@/actions/password";
import {
  FORGOT_PASSWORD_TITLE,
  FORGOT_PASSWORD_SUBTITLE,
  FORGOT_PASSWORD_BUTTON,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_BACK,
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  AUTH_VALIDATION,
} from "../constants";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError(AUTH_VALIDATION.emailRequired);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(AUTH_VALIDATION.emailInvalid);
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[ForgotPassword] Form submitted, email:", email);
    setServerError(null);

    if (!validate()) {
      console.log("[ForgotPassword] Validation failed");
      return;
    }

    console.log("[ForgotPassword] Validation passed, calling server action...");

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("email", email);

        console.log("[ForgotPassword] Calling requestPasswordReset...");
        const result = await requestPasswordReset(fd);
        console.log("[ForgotPassword] Server action result:", result);

        if (result.error) {
          setServerError(result.error);
        } else {
          setIsSuccess(true);
        }
      } catch (err) {
        console.error("[ForgotPassword] Unexpected error:", err);
        setServerError("שגיאה בלתי צפויה. נסו שוב מאוחר יותר.");
      }
    });
  };

  // ── Success State ─────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle
              size={28}
              className="text-green-600 dark:text-green-400"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
          בקשה התקבלה
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body leading-relaxed">
          {FORGOT_PASSWORD_SUCCESS}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="
            flex items-center gap-2 mx-auto
            text-sm text-[#d4826f] hover:text-[#c4735f]
            dark:text-[#e8917a] dark:hover:text-[#d4826f]
            transition-colors text-hebrew-body
          "
        >
          <ArrowRight size={16} />
          {FORGOT_PASSWORD_BACK}
        </button>
      </div>
    );
  }

  // ── Form State ────────────────────────────────────────────────────────
  return (
    <div>
      {/* Icon */}
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 rounded-full bg-[#faf7f5] dark:bg-gray-700 flex items-center justify-center">
          <KeyRound size={20} className="text-[#2e3c52] dark:text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-black text-center text-[#2e3c52] dark:text-white mb-1">
        {FORGOT_PASSWORD_TITLE}
      </h3>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body text-xs">
        {FORGOT_PASSWORD_SUBTITLE}
      </p>

      {/* Server Error */}
      {serverError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="forgot-email"
          label={AUTH_LABELS.email}
          type="email"
          placeholder={AUTH_PLACEHOLDERS.email}
          value={email}
          onChange={setEmail}
          error={emailError}
        />

        <button
          type="submit"
          disabled={isPending}
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
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
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
            FORGOT_PASSWORD_BUTTON
          )}
        </button>
      </form>

      {/* Back Link */}
      <button
        type="button"
        onClick={onBack}
        className="
          flex items-center gap-2 mx-auto mt-4
          text-sm text-[#d4826f] hover:text-[#c4735f]
          dark:text-[#e8917a] dark:hover:text-[#d4826f]
          transition-colors text-hebrew-body
        "
      >
        <ArrowRight size={16} />
        {FORGOT_PASSWORD_BACK}
      </button>
    </div>
  );
}
