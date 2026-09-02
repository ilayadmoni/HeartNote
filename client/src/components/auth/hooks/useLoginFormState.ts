"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { SPLASH_STORAGE_KEY } from "@/components/welcomeSplash";
import { pushToDataLayer } from "@/utils/gtm";
import type { LoginFormData } from "../types";

interface Options {
  redirectTo?: string | null;
  closeThen: (afterClose?: () => void) => void;
  pushRedirect: (path: string) => void;
}

/** Login-tab form state and submit handler, split out of useAuthModalState. */
export function useLoginFormState({ redirectTo, closeThen, pushRedirect }: Options) {
  const t = useTranslations("auth");
  const { signIn } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const resetLoginState = useCallback(() => {
    setFormData({ email: "", password: "" });
    setErrors({});
    setIsSubmitting(false);
    setLoginError(null);
  }, []);

  const clearLoginError = useCallback(() => setLoginError(null), []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email.trim()) newErrors.email = t("validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("validation.emailInvalid");
    if (!formData.password) newErrors.password = t("validation.passwordRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!validate()) { setShakeKey((k) => k + 1); return; }
    setIsSubmitting(true);
    try {
      await signIn(formData.email, formData.password);
      const session = await getSession();
      if (session?.user) {
        pushToDataLayer({ event: "user_login", user_id: session.user.id, user_status: "active" });
      }
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
      closeThen(() => { if (redirectTo) pushRedirect(redirectTo); });
    } catch {
      setLoginError(t("login.errorMessage"));
      setShakeKey((k) => k + 1);
    } finally { setIsSubmitting(false); }
  }, [formData, signIn, closeThen, redirectTo, pushRedirect, validate, t]);

  const handleEmailChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    setLoginError(null);
    setErrors((prev) => ({ ...prev, email: undefined }));
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, password: value }));
    setLoginError(null);
    setErrors((prev) => ({ ...prev, password: undefined }));
  }, []);

  return {
    formData, errors, isSubmitting, loginError, shakeKey,
    handleLogin, handleEmailChange, handlePasswordChange, resetLoginState, clearLoginError,
  };
}
