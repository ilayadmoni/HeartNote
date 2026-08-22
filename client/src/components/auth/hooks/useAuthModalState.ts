"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn as nextAuthSignIn, getSession } from "next-auth/react";
import { pushToDataLayer } from "@/utils/gtm";
import { useAuth } from "@/contexts/AuthContext";
import { USER_QUERY_KEY } from "@/hooks/useUser";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { SPLASH_STORAGE_KEY } from "@/components/welcomeSplash";
import { setOAuthDraftCookie } from "@/actions/oauthDraft";
import { getMyProfile } from "@/actions/profile/get";
import { updateMyProfile } from "@/actions/profile/update";
import {
  AUTH_VALIDATION,
  LOGIN_ERROR_MESSAGE,
  LOGIN_TITLE,
  LOGIN_SUBTITLE,
  REGISTER_TITLE,
  REGISTER_SUBTITLE,
} from "../constants";
import type { LoginFormData, CompleteProfileFormData } from "../types";

const CLOSE_DELAY_MS = 220;

interface Options {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string | null;
  initialView?: "login" | "update-password" | "complete-profile";
}

export function useAuthModalState({ isOpen, onClose, redirectTo, initialView }: Options) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signIn, signUp, user, error: authError, clearError } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [step, setStep] = useState<"auth" | "profile">("auth");

  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const [profileForm, setProfileForm] = useState<CompleteProfileFormData>({
    firstName: "", lastName: "", dateOfBirth: "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileAgreedToTerms, setProfileAgreedToTerms] = useState(false);
  const [profileTermsError, setProfileTermsError] = useState<string | null>(null);
  const profileCompletedRef = useRef(false);

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

  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      const siteUrl = window.location.origin || process.env.NEXT_PUBLIC_SITE_URL || "";
      const targetPath = redirectTo || window.location.pathname + window.location.search;
      const targetUrl = new URL(targetPath, siteUrl);
      const draftId = targetUrl.searchParams.get("draft_id");
      const pathSegments = targetUrl.pathname.split("/").filter(Boolean);
      const templateSlug = pathSegments[pathSegments.length - 1] || "";

      if (draftId && templateSlug) {
        try { await setOAuthDraftCookie({ draftId, templateSlug }); }
        catch (e) { console.error("[OAuth] Failed to set draft cookie:", e); }
      }

      await nextAuthSignIn("google", { callbackUrl: targetUrl.pathname || "/" });
    } catch (err) {
      console.error("[OAuth] Unexpected error:", err);
      setIsGoogleLoading(false);
    }
  }, [redirectTo]);

  useEffect(() => {
    if (isOpen && initialView === "update-password") setShowUpdatePassword(true);
    if (isOpen && initialView === "complete-profile") {
      profileCompletedRef.current = false;
      setStep("profile");
      setActiveTab("login");
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", password: "" });
      setErrors({});
      setActiveTab("login");
      setShowForgotPassword(false);
      setShowUpdatePassword(false);
      setStep("auth");
      setIsSubmitting(false);
      setIsRegisterSubmitting(false);
      setIsProfileLoading(false);
      setIsGoogleLoading(false);
      setProfileError(null);
      setProfileAgreedToTerms(false);
      setProfileTermsError(null);
      profileCompletedRef.current = false;
      setProfileForm({ firstName: "", lastName: "", dateOfBirth: "" });
      setLoginError(null);
      clearError();
    }
  }, [isOpen, clearError]);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    const checkProfileState = async () => {
      if (!isOpen || step !== "profile" || !user) return;
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        const result = await getMyProfile();
        if (!result.success) {
          setProfileError("לא הצלחנו לטעון את הפרופיל. נסו שוב.");
          return;
        }
        const { first_name, last_name, date_of_birth } = result.data;
        if (date_of_birth) { clearModalQuery(); closeThen(); return; }

        setProfileForm({
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          dateOfBirth: date_of_birth ?? "",
        });
      } finally { setIsProfileLoading(false); }
    };
    void checkProfileState();
  }, [isOpen, step, user, clearModalQuery, closeThen]);

  const completeProfileMutation = useMutation({
    mutationFn: async (values: CompleteProfileFormData) => {
      const result = await updateMyProfile({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        date_of_birth: values.dateOfBirth,
      });
      if (!result.success) throw new Error("שמירת הפרופיל נכשלה. נסו שוב.");
      return values;
    },
    onSuccess: () => {
      profileCompletedRef.current = true;
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      clearModalQuery();
      closeThen(() => { if (redirectTo) router.push(redirectTo); });
    },
    onError: (err: unknown) => {
      setProfileError(err instanceof Error ? err.message : "שמירת הפרופיל נכשלה. נסו שוב.");
    },
  });

  const handleCompleteProfile = useCallback(() => {
    setProfileError(null);
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setProfileError("יש למלא שם פרטי ושם משפחה."); return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(profileForm.dateOfBirth)) {
      setProfileError("יש לבחור תאריך לידה תקין."); return;
    }
    if (!profileAgreedToTerms) {
      setProfileTermsError(AUTH_VALIDATION.termsRequired); return;
    }
    setProfileTermsError(null);
    completeProfileMutation.mutate(profileForm);
  }, [profileForm, completeProfileMutation, profileAgreedToTerms]);

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email.trim()) newErrors.email = AUTH_VALIDATION.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = AUTH_VALIDATION.emailInvalid;
    if (!formData.password) newErrors.password = AUTH_VALIDATION.passwordRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      closeThen(() => { if (redirectTo) router.push(redirectTo); });
    } catch {
      setLoginError(LOGIN_ERROR_MESSAGE);
      setShakeKey((k) => k + 1);
    } finally { setIsSubmitting(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, signIn, closeThen, redirectTo, router]);

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

  const handleForgotPasswordOpen = useCallback(() => {
    clearError();
    setLoginError(null);
    setShowForgotPassword(true);
  }, [clearError]);

  return {
    activeTab, setActiveTab,
    showForgotPassword,
    showUpdatePassword,
    step,
    formData,
    errors,
    isSubmitting,
    loginError,
    isGoogleLoading,
    isRegisterSubmitting,
    shakeKey,
    profileForm, setProfileForm,
    isProfileLoading,
    profileError,
    profileAgreedToTerms, setProfileAgreedToTerms,
    profileTermsError, setProfileTermsError,
    completeProfileMutation,
    authError,
    handleLogin,
    handleRegister,
    handleGoogleSignIn,
    handleBackFromForgot,
    handleClose,
    handleUpdatePasswordComplete,
    handleCompleteProfile,
    handleEmailChange,
    handlePasswordChange,
    handleForgotPasswordOpen,
    title: activeTab === "login" ? LOGIN_TITLE : REGISTER_TITLE,
    subtitle: activeTab === "login" ? LOGIN_SUBTITLE : REGISTER_SUBTITLE,
  };
}
