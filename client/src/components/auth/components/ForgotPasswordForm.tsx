"use client";

/**
 * ForgotPasswordForm Component
 * Allows users to request a password reset email via the
 * requestPasswordReset server action (3-strike limit).
 */

import { useState, useTransition } from "react";
import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "./AuthInput";
import { ForgotPasswordSuccess } from "./ForgotPasswordSuccess";
import { requestPasswordReset } from "@/actions/password";
import { logger } from "@/lib/utils/logger";
import { useAuthLabels } from "../hooks/useAuthLabels";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const t = useTranslations("auth");
  const { AUTH_LABELS, AUTH_PLACEHOLDERS, AUTH_VALIDATION, FORGOT_PASSWORD_TITLE, FORGOT_PASSWORD_SUBTITLE, FORGOT_PASSWORD_BUTTON } = useAuthLabels();
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
    setServerError(null);
    if (!validate()) return;

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("email", email);
        const result = await requestPasswordReset(fd);
        if (result.error) {
          setServerError(result.error);
        } else {
          setIsSuccess(true);
        }
      } catch (err) {
        logger.error("[ForgotPassword] Unexpected error", { error: err });
        setServerError(t("forgotPassword.unexpectedError"));
      }
    });
  };

  if (isSuccess) return <ForgotPasswordSuccess onBack={onBack} />;

  return (
    <div>
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">
          <KeyRound size={20} className="text-ink" />
        </div>
      </div>

      <h3 className="text-title-md font-black text-center text-ink mb-1">{FORGOT_PASSWORD_TITLE}</h3>
      <p className="text-center text-ink-muted mb-4 text-caption">{FORGOT_PASSWORD_SUBTITLE}</p>

      {serverError && (
        <div className="mb-4 p-3 rounded-control bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-body-sm text-red-600 dark:text-red-400 text-center">{serverError}</p>
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

        <Button type="submit" isLoading={isPending} className="w-full mt-2">
          {FORGOT_PASSWORD_BUTTON}
        </Button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 mx-auto mt-4 text-body-sm text-accent hover:text-accent-hover transition-colors"
      >
        {t("forgotPassword.back")}
      </button>
    </div>
  );
}
