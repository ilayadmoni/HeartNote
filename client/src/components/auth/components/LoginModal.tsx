"use client";

/**
 * LoginModal Component
 * Modal dialog for user login, registration, and password reset.
 *
 * Login uses the browser-side Supabase client (via AuthContext.signIn)
 * so that onAuthStateChange fires immediately — no manual refresh
 * needed. A fixed-height error container below the fields guarantees
 * zero layout shift when the error message appears.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, LogIn, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { pushToDataLayer } from "@/utils/gtm";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import { AuthInput } from "./AuthInput";
import { AuthTabs } from "./AuthTabs";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { FocusTrap } from "@/components/accessibility";
import { useAuth } from "@/contexts/AuthContext";
import { USER_QUERY_KEY } from "@/hooks/useUser";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { SPLASH_STORAGE_KEY } from "@/components/welcomeSplash";
import {
  LOGIN_TITLE,
  LOGIN_SUBTITLE,
  LOGIN_BUTTON,
  REGISTER_TITLE,
  REGISTER_SUBTITLE,
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  AUTH_VALIDATION,
  FORGOT_PASSWORD_LINK,
  LOGIN_ERROR_MESSAGE,
} from "../constants";
import type { LoginModalProps, LoginFormData } from "../types";

interface CompleteProfileFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

/* ------------------------------------------------------------------ */
/*  LoginModal                                                         */
/* ------------------------------------------------------------------ */
export function LoginModal({
  isOpen,
  onClose,
  redirectTo,
  initialView,
}: LoginModalProps) {
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 220;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signIn, signUp, user, error: authError, clearError } = useAuth();
  const savedOverflow = useRef<string>("");

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  // Controlled inputs for client-side validation
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  // Login-specific state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register-specific loading state
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  // Modal content step: auth (login/register) or profile completion
  const [step, setStep] = useState<"auth" | "profile">("auth");

  // Complete-profile form state
  const [profileForm, setProfileForm] = useState<CompleteProfileFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileAgreedToTerms, setProfileAgreedToTerms] = useState(false);
  const [profileTermsError, setProfileTermsError] = useState<string | null>(null);
  const profileCompletedRef = useRef(false);

  // Shake animation trigger
  const [shakeKey, setShakeKey] = useState(0);

  // Google OAuth loading state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const splitFullName = useCallback((fullName: string | undefined) => {
    if (!fullName) {
      return { firstName: "", lastName: "" };
    }

    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return { firstName: "", lastName: "" };
    }

    if (parts.length === 1) {
      return { firstName: parts[0], lastName: "" };
    }

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
    };
  }, []);

  const clearModalQuery = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);



  // ── Google OAuth handler ─────────────────────────────────────────
  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const currentPath = window.location.pathname + window.location.search;
      const targetPath = redirectTo || currentPath;
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(targetPath)}`;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account'
          },
        },
      });
      // Browser will redirect — no further action needed here.
    } catch {
      setIsGoogleLoading(false);
    }
  }, [redirectTo]);

  // ── Reset form when modal closes ─────────────────────────────────
  // Open in update-password mode when coming from recovery link
  useEffect(() => {
    if (isOpen && initialView === "update-password") {
      setShowUpdatePassword(true);
    }

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



  // ── Defensive body cleanup (prevents stale modal locks) ──────────
  const restoreBodyInteractivity = useCallback(() => {
    document.body.style.overflow = savedOverflow.current;
    document.body.style.pointerEvents = "auto";
  }, []);

  // ── Prevent body scroll while modal is open ──────────────────────
  useEffect(() => {
    if (isOpen) {
      savedOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    if (!isOpen) {
      // Ensure body is always clickable after close.
      document.body.style.pointerEvents = "auto";
    }

    return () => {
      restoreBodyInteractivity();
    };
  }, [isOpen, restoreBodyInteractivity]);

  // ── Close helper ─────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    restoreBodyInteractivity();
    onClose();
  }, [onClose, restoreBodyInteractivity]);

  // Close modal first, then run follow-up work after exit animation
  // and focus-trap cleanup have had enough time to complete.
  const closeThen = useCallback(
    (afterClose?: () => void) => {
      handleClose();
      if (!afterClose) return;

      window.setTimeout(() => {
        afterClose();
      }, CLOSE_THEN_NAVIGATE_DELAY_MS);
    },
    [handleClose],
  );

  // ── Profile completeness check for Google OAuth users ─────────────
  useEffect(() => {
    const checkProfileState = async () => {
      if (!isOpen || step !== "profile" || !user) {
        return;
      }

      setIsProfileLoading(true);
      setProfileError(null);

      const { firstName: guessedFirstName, lastName: guessedLastName } =
        splitFullName(
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : undefined,
        );

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, date_of_birth")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          setProfileError("לא הצלחנו לטעון את הפרופיל. נסו שוב.");
          return;
        }

        const hasBirthdate = Boolean(data?.date_of_birth);

        if (hasBirthdate) {
          clearModalQuery();
          closeThen();
          return;
        }

        setProfileForm({
          firstName: (data?.first_name as string | null) ?? guessedFirstName,
          lastName: (data?.last_name as string | null) ?? guessedLastName,
          dateOfBirth: (data?.date_of_birth as string | null) ?? "",
        });
      } finally {
        setIsProfileLoading(false);
      }
    };

    void checkProfileState();
  }, [isOpen, step, user, splitFullName, clearModalQuery, closeThen, router]);

  const completeProfileMutation = useMutation({
    mutationFn: async (values: CompleteProfileFormData) => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error("פג תוקף ההתחברות. התחברו שוב.");
      }

      const { error: profileUpsertError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: currentUser.id,
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
            date_of_birth: values.dateOfBirth,
          },
          { onConflict: "id" },
        );

      if (profileUpsertError) {
        throw new Error("שמירת הפרופיל נכשלה. נסו שוב.");
      }

      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          full_name:
            `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
          date_of_birth: values.dateOfBirth,
        },
      });

      if (updateUserError) {
        throw new Error("שמירת פרטי המשתמש נכשלה. נסו שוב.");
      }

      return values;
    },
    onSuccess: () => {
      profileCompletedRef.current = true;
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      clearModalQuery();
      closeThen(() => {
        if (redirectTo) {
          router.push(redirectTo);
        }
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "שמירת הפרופיל נכשלה. נסו שוב.";
      setProfileError(message);
    },
  });

  const handleCompleteProfile = useCallback(async () => {
    setProfileError(null);

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setProfileError("יש למלא שם פרטי ושם משפחה.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(profileForm.dateOfBirth)) {
      setProfileError("יש לבחור תאריך לידה תקין.");
      return;
    }

    if (!profileAgreedToTerms) {
      setProfileTermsError(AUTH_VALIDATION.termsRequired);
      return;
    }

    setProfileTermsError(null);

    completeProfileMutation.mutate(profileForm);
  }, [profileForm, completeProfileMutation, profileAgreedToTerms]);

  // ── Client-side validation ───────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = AUTH_VALIDATION.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = AUTH_VALIDATION.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = AUTH_VALIDATION.passwordRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Login handler (browser-side via AuthContext) ──────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous login error on new attempt
    setLoginError(null);

    if (!validate()) {
      setShakeKey((k) => k + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      // signIn uses the browser Supabase client → fires onAuthStateChange
      // → AuthContext sets user/session immediately → UI re-renders.
      await signIn(formData.email, formData.password);

      // Track successful user logic
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        pushToDataLayer({
          event: "user_login",
          user_id: session.user.id,
          user_status: "active",
        });
      }

      // If we get here, login succeeded (signIn throws on error).
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
      // Explicit close first. Only then navigate after cleanup window.
      closeThen(() => {
        if (redirectTo) {
          router.push(redirectTo);
        }
      });
    } catch {
      // signIn already set authError via AuthContext, but we also
      // keep a local error for the reserved-height slot.
      setLoginError(LOGIN_ERROR_MESSAGE);
      setShakeKey((k) => k + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Register handler (uses AuthContext) ──────────────────────────
  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string,
  ) => {
    setIsRegisterSubmitting(true);
    try {
      const result = await signUp(
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        redirectTo ?? undefined,
      );
      return result;
      // Don't close modal – RegisterForm will show success message if result.success
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const handleBackFromForgot = () => {
    setShowForgotPassword(false);
    clearError();
  };

  const title = activeTab === "login" ? LOGIN_TITLE : REGISTER_TITLE;
  const subtitle = activeTab === "login" ? LOGIN_SUBTITLE : REGISTER_SUBTITLE;

  return (
    <AnimatePresence mode="wait" onExitComplete={restoreBodyInteractivity}>
      {isOpen && (
        <motion.div
          key="login-modal-root"
          initial={{ opacity: 0, pointerEvents: "none" }}
          animate={{ opacity: 1, pointerEvents: "auto" }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200]"
        >
          <FocusTrap active={isOpen} onEscape={handleClose}>
            {/* Backdrop — stronger dimming (60 %) to darken page title */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Top-aligned on mobile to prevent layout jumping, centered on desktop — clicks pass through to backdrop */}
            <div className="relative flex items-start md:items-center justify-center h-[100dvh] p-4 pt-[5dvh] md:p-4">
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                  aria-label="סגור"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>

                {/* Scrollable Content */}
                <div className="h-[540px] md:h-auto max-h-[85vh] overflow-y-auto">
                  <div className="p-4 sm:p-5 pt-8 pb-12 sm:pb-6 box-border">
                    {/* Update Password View (from recovery link) */}
                    {showUpdatePassword ? (
                      <UpdatePasswordForm
                        onComplete={() => {
                          setShowUpdatePassword(false);
                          handleClose();
                        }}
                      />
                    ) : /* Forgot Password View */
                    showForgotPassword ? (
                      <ForgotPasswordForm onBack={handleBackFromForgot} />
                    ) : step === "profile" ? (
                      <motion.div
                        key="complete-profile-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pt-2"
                      >
                        <div className="flex justify-center mb-3">
                          <div className="w-12 h-12 rounded-full bg-[#faf7f5] dark:bg-gray-700 flex items-center justify-center">
                            <LogIn
                              size={20}
                              className="text-[#2e3c52] dark:text-white"
                            />
                          </div>
                        </div>

                        <h2 className="text-xl font-black text-center text-[#2e3c52] dark:text-white mb-1 text-hebrew-heading">
                          נגיעות אחרונות
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-5 text-hebrew-body text-xs">
                          השלימו את הפרטים כדי לסיים את ההרשמה עם Google
                        </p>

                        {isProfileLoading ? (
                          <div className="py-8 flex items-center justify-center">
                            <svg
                              className="animate-spin h-6 w-6 text-[#2e3c52]"
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
                          </div>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              void handleCompleteProfile();
                            }}
                            className="space-y-3"
                          >
                            <div>
                              <label
                                htmlFor="complete-first-name"
                                className="block text-xs mb-1.5 text-gray-600 dark:text-gray-300 text-hebrew-body"
                              >
                                שם פרטי
                              </label>
                              <input
                                id="complete-first-name"
                                type="text"
                                value={profileForm.firstName}
                                onChange={(e) =>
                                  setProfileForm((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                  }))
                                }
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-[#2e3c52] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52]"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="complete-last-name"
                                className="block text-xs mb-1.5 text-gray-600 dark:text-gray-300 text-hebrew-body"
                              >
                                שם משפחה
                              </label>
                              <input
                                id="complete-last-name"
                                type="text"
                                value={profileForm.lastName}
                                onChange={(e) =>
                                  setProfileForm((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                  }))
                                }
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-[#2e3c52] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52]"
                              />
                            </div>

                            <div>
                              <BrandCalendar
                                value={profileForm.dateOfBirth}
                                onChange={(value) =>
                                  setProfileForm((prev) => ({
                                    ...prev,
                                    dateOfBirth: value,
                                  }))
                                }
                                label="תאריך לידה"
                                error={undefined}
                              />
                            </div>

                            <div className="mt-1 mb-1">
                              <div
                                role="checkbox"
                                aria-checked={profileAgreedToTerms}
                                tabIndex={0}
                                onClick={() => {
                                  setProfileAgreedToTerms((prev) => !prev);
                                  if (profileTermsError) setProfileTermsError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === " " || e.key === "Enter") {
                                    e.preventDefault();
                                    setProfileAgreedToTerms((prev) => !prev);
                                    if (profileTermsError) setProfileTermsError(null);
                                  }
                                }}
                                className="flex items-center gap-2 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-1 rounded"
                                dir="rtl"
                              >
                                <span className="text-xs text-[#2e3c52] dark:text-gray-300 text-hebrew-body leading-relaxed">
                                  קראתי ואני מאשר/ת את{" "}
                                  <Link
                                    href="/privacy"
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                    className="underline text-[#d4826f] hover:text-[#c4725f] dark:text-[#e8917a] dark:hover:text-[#f0a18a] font-semibold"
                                  >
                                    תנאי השימוש ומדיניות הפרטיות
                                  </Link>
                                </span>

                                <span
                                  className={`
                                    shrink-0 flex items-center justify-center
                                    w-[18px] h-[18px] rounded-[4px] border-2
                                    transition-all duration-150
                                    ${
                                      profileAgreedToTerms
                                        ? "bg-[#2e3c52] border-[#2e3c52] dark:bg-[#d4826f] dark:border-[#d4826f]"
                                        : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500"
                                    }
                                  `}
                                >
                                  <svg
                                    className={`w-[11px] h-[11px] text-white pointer-events-none transition-all duration-150 ${
                                      profileAgreedToTerms
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-50"
                                    }`}
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M2 6l3 3 5-5" />
                                  </svg>
                                </span>
                              </div>

                              {profileTermsError && (
                                <p className="text-xs text-red-500 mt-1 text-hebrew-body text-right">
                                  {profileTermsError}
                                </p>
                              )}
                            </div>

                            <div
                              className="h-5 flex items-center justify-center"
                              role="status"
                              aria-live="polite"
                            >
                              <p
                                className={`text-red-500 text-xs text-hebrew-body transition-opacity duration-200 ${profileError ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                              >
                                {profileError || "\u00A0"}
                              </p>
                            </div>

                            <button
                              type="submit"
                              disabled={completeProfileMutation.isPending}
                              className="w-full py-2.5 px-4 rounded-lg bg-[#2e3c52] hover:bg-[#1B263B] text-white font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading"
                            >
                              {completeProfileMutation.isPending
                                ? "שומרים..."
                                : "השלמת הרשמה"}
                            </button>
                          </form>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        {/* Icon */}
                        <div className="flex justify-center mb-2">
                          <div className="w-12 h-12 rounded-full bg-[#faf7f5] dark:bg-gray-700 flex items-center justify-center">
                            <LogIn
                              size={20}
                              className="text-[#2e3c52] dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <h2
                          id="auth-title"
                          className="text-xl font-black text-center text-[#2e3c52] dark:text-white mb-1"
                        >
                          {title}
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-3 text-hebrew-body text-xs">
                          {subtitle}
                        </p>

                        {/* Tabs */}
                        <AuthTabs
                          activeTab={activeTab}
                          onTabChange={setActiveTab}
                        />

                        {/* Register error banner (from AuthContext) — skip email-specific errors */}
                        {activeTab === "register" &&
                          authError &&
                          authError !== "מייל לא חוקי" && (
                            <div
                              className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/60"
                              role="alert"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <AlertTriangle
                                  size={16}
                                  className="text-red-500 dark:text-red-400 shrink-0"
                                />
                                <p className="text-red-500 dark:text-red-400 text-sm font-semibold text-hebrew-body">
                                  {authError}
                                </p>
                              </div>
                            </div>
                          )}

                        {/* ─── Login Form (client-side auth via AuthContext) ─── */}
                        {activeTab === "login" && (
                          <>
                            {/* Google Sign-In Button */}
                            <button
                              type="button"
                              onClick={handleGoogleSignIn}
                              disabled={isGoogleLoading || isSubmitting}
                              className="
                                w-full flex flex-row-reverse items-center justify-center gap-3 py-2.5 px-4 mb-4
                                rounded-xl border border-gray-200 dark:border-gray-600
                                bg-white dark:bg-gray-700
                                hover:bg-gray-50 dark:hover:bg-gray-600
                                shadow-sm hover:shadow-md
                                text-gray-700 dark:text-gray-200 font-medium text-sm
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-2
                              "
                            >
                              {isGoogleLoading ? (
                                <svg
                                  className="animate-spin h-5 w-5 text-gray-500"
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
                              ) : (
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-5 w-5 shrink-0"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                  />
                                </svg>
                              )}
                              {isGoogleLoading ? "מתחבר..." : "התחבר עם Google"}
                            </button>

                            {/* OR Divider */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wider">
                                או
                              </span>
                              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                            </div>

                            <form
                              key={shakeKey}
                              onSubmit={handleLogin}
                              className="flex flex-col"
                            >
                              <AuthInput
                                id="login-email"
                                name="email"
                                label={AUTH_LABELS.email}
                                type="email"
                                placeholder={AUTH_PLACEHOLDERS.email}
                                value={formData.email}
                                onChange={(value) => {
                                  setFormData({ ...formData, email: value });
                                  setLoginError(null);
                                  if (errors.email) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      email: undefined,
                                    }));
                                  }
                                }}
                                error={errors.email}
                              />

                              <AuthInput
                                id="login-password"
                                name="password"
                                label={AUTH_LABELS.password}
                                type="password"
                                placeholder={AUTH_PLACEHOLDERS.password}
                                value={formData.password}
                                onChange={(value) => {
                                  setFormData({ ...formData, password: value });
                                  setLoginError(null);
                                  if (errors.password) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      password: undefined,
                                    }));
                                  }
                                }}
                                error={errors.password}
                              />

                              {/* ── Reserved-height error slot (no layout shift) ── */}
                              <div
                                className="h-6 flex items-center justify-center"
                                role="status"
                                aria-live="polite"
                              >
                                <p
                                  className={`
                                  text-red-500 text-sm font-semibold text-center
                                  text-hebrew-body transition-opacity duration-200
                                  ${loginError ? "opacity-100" : "opacity-0 pointer-events-none"}
                                `}
                                >
                                  {loginError || "\u00A0"}
                                </p>
                              </div>

                              {/* Forgot Password Link */}
                              <div className="flex justify-start mb-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    clearError();
                                    setLoginError(null);
                                    setShowForgotPassword(true);
                                  }}
                                  className="
                                  text-xs text-[#d4826f] hover:text-[#c4735f]
                                  dark:text-[#e8917a] dark:hover:text-[#d4826f]
                                  transition-colors text-hebrew-body
                                  hover:underline
                                "
                                >
                                  {FORGOT_PASSWORD_LINK}
                                </button>
                              </div>

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
                                  LOGIN_BUTTON
                                )}
                              </button>
                            </form>
                          </>
                        )}

                        {/* Register Form */}
                        {activeTab === "register" && (
                          <RegisterForm
                            onSubmit={handleRegister}
                            isSubmitting={isRegisterSubmitting}
                            serverError={authError}
                          />
                        )}
                      </>
                    )}

                    {/* Contact Support Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                      נתקלתם בבעיה?{" "}
                      <Link
                        href="/contact"
                        onClick={handleClose}
                        className="text-[#d4826f] hover:text-[#c4735f] dark:text-[#e8917a] dark:hover:text-[#d4826f] font-semibold hover:underline transition-colors"
                      >
                        צרו קשר
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#d4826f] to-[#2e3c52]" />
              </motion.div>
            </div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
