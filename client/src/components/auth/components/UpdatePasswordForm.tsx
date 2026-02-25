"use client";

/**
 * UpdatePasswordForm Component
 * Allows users to set a new password after clicking the recovery email link.
 * Rendered inside the LoginModal when ?reset_password=true is detected.
 */

import { useState } from "react";
import { KeyRound, CheckCircle } from "lucide-react";
import { AuthInput } from "./AuthInput";
import { useAuth } from "@/contexts/AuthContext";
import {
  UPDATE_PASSWORD_TITLE,
  UPDATE_PASSWORD_SUBTITLE,
  UPDATE_PASSWORD_BUTTON,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_SUCCESS_SUBTITLE,
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  AUTH_VALIDATION,
} from "../constants";

interface UpdatePasswordFormProps {
  onComplete: () => void;
}

export function UpdatePasswordForm({ onComplete }: UpdatePasswordFormProps) {
  const { updatePassword, error, clearError } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    let valid = true;
    setPasswordError("");
    setConfirmError("");

    if (!password) {
      setPasswordError(AUTH_VALIDATION.passwordRequired);
      valid = false;
    } else if (password.length < 8) {
      setPasswordError(AUTH_VALIDATION.passwordMinLength);
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError(AUTH_VALIDATION.passwordMismatch);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      setIsSuccess(true);
      // Auto-close after success
      setTimeout(() => onComplete(), 2500);
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success State ──────────────────────────────────────────────────
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
          {UPDATE_PASSWORD_SUCCESS}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body leading-relaxed">
          {UPDATE_PASSWORD_SUCCESS_SUBTITLE}
        </p>
      </div>
    );
  }

  // ── Form State ─────────────────────────────────────────────────────
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
        {UPDATE_PASSWORD_TITLE}
      </h3>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body text-xs">
        {UPDATE_PASSWORD_SUBTITLE}
      </p>

      {/* Server Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="new-password"
          name="password"
          label={AUTH_LABELS.password}
          type="password"
          placeholder={AUTH_PLACEHOLDERS.password}
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (passwordError) setPasswordError("");
          }}
          error={passwordError}
        />

        <AuthInput
          id="confirm-new-password"
          name="confirmPassword"
          label={AUTH_LABELS.confirmPassword}
          type="password"
          placeholder={AUTH_PLACEHOLDERS.confirmPassword}
          value={confirmPassword}
          onChange={(val) => {
            setConfirmPassword(val);
            if (confirmError) setConfirmError("");
          }}
          error={confirmError}
        />

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
            UPDATE_PASSWORD_BUTTON
          )}
        </button>
      </form>
    </div>
  );
}
