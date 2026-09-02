"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useAuth } from "@/contexts/AuthContext";
import { useCompleteProfileModalState } from "./useCompleteProfileModalState";
import { useLoginFormState } from "./useLoginFormState";
import { useGoogleSignIn } from "./useGoogleSignIn";

const CLOSE_DELAY_MS = 220;

interface Options {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string | null;
  initialView?: "login" | "update-password" | "complete-profile";
}

export function useAuthModalState({ isOpen, onClose, redirectTo, initialView }: Options) {
  const router = useRouter();
  const t = useTranslations("auth");
  const { signUp, error: authError, clearError } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [step, setStep] = useState<"auth" | "profile">("auth");
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  const clearModalQuery = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

  const handleClose = useCallback(() => {
    document.body.style.pointerEvents = "auto";
    onClose();
  }, [onClose]);

  const closeThen = useCallback((afterClose?: () => void) => {
    handleClose();
    if (afterClose) window.setTimeout(afterClose, CLOSE_DELAY_MS);
  }, [handleClose]);

  const handleUpdatePasswordComplete = useCallback(() => {
    setShowUpdatePassword(false);
    handleClose();
  }, [handleClose]);

  const pushRedirect = useCallback((path: string) => router.push(path), [router]);

  const login = useLoginFormState({ redirectTo, closeThen, pushRedirect });
  const google = useGoogleSignIn(redirectTo);
  const profileState = useCompleteProfileModalState({
    isOpen, step, redirectTo, clearModalQuery, closeThen, pushRedirect,
  });

  useEffect(() => {
    if (isOpen && initialView === "update-password") setShowUpdatePassword(true);
    if (isOpen && initialView === "complete-profile") {
      setStep("profile");
      setActiveTab("login");
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    if (!isOpen) {
      login.resetLoginState();
      setActiveTab("login");
      setShowForgotPassword(false);
      setShowUpdatePassword(false);
      setStep("auth");
      setIsRegisterSubmitting(false);
      google.resetGoogleLoading();
      profileState.resetProfileState();
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, clearError]);

  useLockBodyScroll(isOpen);

  const handleRegister = useCallback(async (
    firstName: string, lastName: string, email: string, password: string, dateOfBirth: string,
  ) => {
    setIsRegisterSubmitting(true);
    try {
      return await signUp(email, password, firstName, lastName, dateOfBirth);
    } finally { setIsRegisterSubmitting(false); }
  }, [signUp]);

  const handleBackFromForgot = useCallback(() => {
    setShowForgotPassword(false);
    clearError();
  }, [clearError]);

  const handleForgotPasswordOpen = useCallback(() => {
    clearError();
    login.clearLoginError();
    setShowForgotPassword(true);
  }, [clearError, login]);

  return {
    activeTab, setActiveTab,
    showForgotPassword,
    showUpdatePassword,
    step,
    ...login,
    isGoogleLoading: google.isGoogleLoading,
    handleGoogleSignIn: google.handleGoogleSignIn,
    isRegisterSubmitting,
    ...profileState,
    authError,
    handleRegister,
    handleBackFromForgot,
    handleClose,
    handleUpdatePasswordComplete,
    handleForgotPasswordOpen,
    title: activeTab === "login" ? t("login.title") : t("register.title"),
    subtitle: activeTab === "login" ? t("login.subtitle") : t("register.subtitle"),
  };
}
