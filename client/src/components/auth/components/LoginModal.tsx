"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, LogIn, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { FocusTrap } from "@/components/accessibility";
import { AuthTabs } from "./AuthTabs";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { LoginForm } from "./LoginForm";
import { CompleteProfileStep } from "./CompleteProfileStep";
import { useAuthModalState } from "../hooks/useAuthModalState";
import type { LoginModalProps } from "../types";

export function LoginModal({ isOpen, onClose, redirectTo, initialView }: LoginModalProps) {
  const t = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const s = useAuthModalState({ isOpen, onClose, redirectTo, initialView });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) document.body.style.pointerEvents = "auto";
    return () => { document.body.style.pointerEvents = "auto"; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={() => { document.body.style.pointerEvents = "auto"; }}>
      {isOpen && (
        <motion.div
          key="login-modal-root"
          initial={{ opacity: 0, pointerEvents: "none" }}
          animate={{ opacity: 1, pointerEvents: "auto" }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] overscroll-contain touch-none"
        >
          <FocusTrap active={isOpen} onEscape={s.handleClose}>
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 touch-none"
              onClick={s.handleClose}
              onTouchMove={(e) => e.preventDefault()}
              aria-hidden="true"
            />

            <div className="relative flex items-start md:items-center justify-center min-h-[100dvh] p-4 pt-[5dvh] md:p-4 overscroll-contain">
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md bg-surface rounded-card shadow-lift overflow-hidden touch-pan-y"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={s.handleClose}
                  className="absolute top-4 end-4 p-2 rounded-full hover:bg-surface-sunken transition-colors z-10"
                  aria-label={t("modal.close")}
                >
                  <X size={20} className="text-ink-muted" />
                </button>

                <div className="h-[540px] md:h-auto max-h-[85vh] overflow-y-auto">
                  <div className="p-4 sm:p-5 pt-8 pb-12 sm:pb-6 box-border">
                    {s.showUpdatePassword ? (
                      <UpdatePasswordForm onComplete={s.handleUpdatePasswordComplete} />
                    ) : s.showForgotPassword ? (
                      <ForgotPasswordForm onBack={s.handleBackFromForgot} />
                    ) : s.step === "profile" ? (
                      <CompleteProfileStep
                        profileForm={s.profileForm}
                        setProfileForm={s.setProfileForm}
                        isProfileLoading={s.isProfileLoading}
                        profileError={s.profileError}
                        profileAgreedToTerms={s.profileAgreedToTerms}
                        setProfileAgreedToTerms={s.setProfileAgreedToTerms}
                        profileTermsError={s.profileTermsError}
                        setProfileTermsError={s.setProfileTermsError}
                        onSubmit={s.handleCompleteProfile}
                        isPending={s.completeProfileMutation.isPending}
                      />
                    ) : (
                      <>
                        <div className="flex justify-center mb-2">
                          <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">
                            <LogIn size={20} className="text-ink" />
                          </div>
                        </div>
                        <h2 id="auth-title" className="text-title-md font-black text-center text-ink mb-1">
                          {s.title}
                        </h2>
                        <p className="text-center text-ink-muted mb-3 text-caption">{s.subtitle}</p>

                        <AuthTabs activeTab={s.activeTab} onTabChange={s.setActiveTab} />

                        {s.activeTab === "register" && s.authError && s.authError !== tErrors("registration.bannedEmail") && (
                          <div className="mb-4 p-3 rounded-control bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/60" role="alert">
                            <div className="flex items-center justify-center gap-2">
                              <AlertTriangle size={16} className="text-red-500 dark:text-red-400 shrink-0" />
                              <p className="text-body-sm font-semibold text-red-500 dark:text-red-400">{s.authError}</p>
                            </div>
                          </div>
                        )}

                        {s.activeTab === "login" && (
                          <LoginForm
                            formData={s.formData}
                            errors={s.errors}
                            isSubmitting={s.isSubmitting}
                            isGoogleLoading={s.isGoogleLoading}
                            loginError={s.loginError}
                            shakeKey={s.shakeKey}
                            onSubmit={s.handleLogin}
                            onGoogleSignIn={s.handleGoogleSignIn}
                            onForgotPassword={s.handleForgotPasswordOpen}
                            onEmailChange={s.handleEmailChange}
                            onPasswordChange={s.handlePasswordChange}
                          />
                        )}

                        {s.activeTab === "register" && (
                          <RegisterForm
                            onSubmit={s.handleRegister}
                            isSubmitting={s.isRegisterSubmitting}
                            serverError={s.authError}
                          />
                        )}
                      </>
                    )}

                    <div className="mt-6 text-center text-body-sm text-ink-muted">
                      {t("modal.helpPrompt")}{" "}
                      <Link
                        href="/contact"
                        onClick={s.handleClose}
                        className="text-accent hover:text-accent-hover font-semibold hover:underline transition-colors"
                      >
                        {t("modal.helpLink")}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="h-1.5 bg-accent" />
              </motion.div>
            </div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
