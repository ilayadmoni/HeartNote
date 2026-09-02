"use client";

/**
 * UpdatePasswordForm Component
 * Allows users to set a new password after clicking the recovery email link.
 * Rendered inside the LoginModal when ?modal=reset-password is detected.
 * Uses the updatePassword server action which also resets reset_attempts to 0.
 */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "./AuthInput";
import { UpdatePasswordStatus } from "./UpdatePasswordStatus";
import { useUpdatePasswordRedirect } from "./useUpdatePasswordRedirect";
import { updatePassword } from "@/actions/password";
import { useAuthLabels } from "../hooks/useAuthLabels";

interface UpdatePasswordFormProps {
  onComplete: () => void;
}

export function UpdatePasswordForm({ onComplete }: UpdatePasswordFormProps) {
  const labels = useAuthLabels();
  const { AUTH_LABELS, AUTH_PLACEHOLDERS, AUTH_VALIDATION } = labels;
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const finishAndRedirect = useUpdatePasswordRedirect(onComplete, labels.UPDATE_PASSWORD_SUCCESS);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sessionState: "ready" | "expired" = token ? "ready" : "expired";

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
    setServerError(null);

    if (sessionState !== "ready" || !token) {
      setServerError(labels.UPDATE_PASSWORD_EXPIRED_MESSAGE);
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("password", password);
      const result = await updatePassword(token, formData);

      if (result.error) {
        setServerError(result.error);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => finishAndRedirect(), 2000);
    } catch {
      setIsSubmitting(false);
      setServerError(labels.UPDATE_PASSWORD_EXPIRED_MESSAGE);
    }
  };

  if (sessionState === "expired") return <UpdatePasswordStatus variant="expired" />;
  if (isSuccess) return <UpdatePasswordStatus variant="success" />;

  return (
    <div>
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">
          <KeyRound size={20} className="text-ink" />
        </div>
      </div>

      <h3 className="text-title-md font-black text-center text-ink mb-1">{labels.UPDATE_PASSWORD_TITLE}</h3>
      <p className="text-center text-ink-muted mb-4 text-caption">{labels.UPDATE_PASSWORD_SUBTITLE}</p>

      {serverError && (
        <div className="mb-4 p-3 rounded-control bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-body-sm text-red-600 dark:text-red-400 text-center">{serverError}</p>
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

        <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
          {labels.UPDATE_PASSWORD_BUTTON}
        </Button>
      </form>
    </div>
  );
}
