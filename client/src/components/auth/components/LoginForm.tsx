"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "./AuthInput";
import { GoogleIcon } from "./GoogleIcon";
import { useAuthLabels } from "../hooks/useAuthLabels";
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
  const t = useTranslations("auth");
  const { AUTH_LABELS, AUTH_PLACEHOLDERS, LOGIN_BUTTON } = useAuthLabels();

  return (
    <>
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 mb-4 rounded-control border border-line-strong bg-surface-raised hover:bg-surface-sunken shadow-soft hover:shadow-card text-ink font-medium text-body-sm transition-all duration-base disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <GoogleIcon loading={isGoogleLoading} />
        {isGoogleLoading ? t("google.connecting") : t("google.signIn")}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-line" />
        <span className="text-caption font-medium text-ink-subtle tracking-wider">{t("google.or")}</span>
        <div className="flex-1 h-px bg-line" />
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
          <p className={`text-body-sm font-semibold text-center transition-opacity duration-base ${loginError ? "opacity-100 text-red-500" : "opacity-0 pointer-events-none"}`}>
            {loginError || " "}
          </p>
        </div>

        <div className="flex justify-start mb-2">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-caption text-accent hover:text-accent-hover transition-colors hover:underline"
          >
            {t("forgotPassword.link")}
          </button>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
          {LOGIN_BUTTON}
        </Button>
      </form>
    </>
  );
}
