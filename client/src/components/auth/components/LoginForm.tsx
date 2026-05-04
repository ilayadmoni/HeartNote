"use client";

import { AuthInput } from "./AuthInput";
import {
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  FORGOT_PASSWORD_LINK,
  LOGIN_BUTTON,
} from "../constants";
import type { LoginFormData } from "../types";

interface LoginFormProps {
  formData: LoginFormData;
  errors: Partial<LoginFormData>;
  isSubmitting: boolean;
  isGoogleLoading: boolean;
  loginError: string | null;
  shakeKey: number;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  onForgotPassword: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LoginForm({
  formData, errors, isSubmitting, isGoogleLoading, loginError, shakeKey,
  onSubmit, onGoogleSignIn, onForgotPassword, onEmailChange, onPasswordChange,
}: LoginFormProps) {
  return (
    <>
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        className="w-full flex flex-row-reverse items-center justify-center gap-3 py-2.5 px-4 mb-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-2"
      >
        {isGoogleLoading ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        {isGoogleLoading ? "מתחבר..." : "התחבר עם Google"}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wider">או</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
      </div>

      <form key={shakeKey} onSubmit={onSubmit} className="flex flex-col">
        <AuthInput
          id="login-email"
          name="email"
          label={AUTH_LABELS.email}
          type="email"
          placeholder={AUTH_PLACEHOLDERS.email}
          value={formData.email}
          maxLength={254}
          onChange={onEmailChange}
          error={errors.email}
        />
        <AuthInput
          id="login-password"
          name="password"
          label={AUTH_LABELS.password}
          type="password"
          placeholder={AUTH_PLACEHOLDERS.password}
          value={formData.password}
          maxLength={128}
          onChange={onPasswordChange}
          error={errors.password}
        />

        <div className="h-6 flex items-center justify-center" role="status" aria-live="polite">
          <p className={`text-red-500 text-sm font-semibold text-center text-hebrew-body transition-opacity duration-200 ${loginError ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {loginError || " "}
          </p>
        </div>

        <div className="flex justify-start mb-2">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-[#d4826f] hover:text-[#c4735f] dark:text-[#e8917a] dark:hover:text-[#d4826f] transition-colors text-hebrew-body hover:underline"
          >
            {FORGOT_PASSWORD_LINK}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 mt-2 rounded-lg bg-[#2e3c52] hover:bg-[#1B263B] text-white font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </span>
          ) : LOGIN_BUTTON}
        </button>
      </form>
    </>
  );
}
