"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, LogIn, AlertTriangle } from "lucide-react";
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
  const s = useAuthModalState({ isOpen, onClose, redirectTo, initialView });

  useEffect(() => {
    if (!isOpen) document.body.style.pointerEvents = "auto";
    return () => { document.body.style.pointerEvents = "auto"; };
  }, [isOpen]);

  return (
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

            <div className="relative flex items-start md:items-center justify-center h-[100dvh] p-4 pt-[5dvh] md:p-4 overscroll-contain">
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden touch-pan-y"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={s.handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                  aria-label="סגור"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
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
                          <div className="w-12 h-12 rounded-full bg-[#faf7f5] dark:bg-gray-700 flex items-center justify-center">
                            <LogIn size={20} className="text-[#2e3c52] dark:text-white" />
                          </div>
                        </div>
                        <h2 id="auth-title" className="text-xl font-black text-center text-[#2e3c52] dark:text-white mb-1">
                          {s.title}
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-3 text-hebrew-body text-xs">
                          {s.subtitle}
                        </p>

                        <AuthTabs activeTab={s.activeTab} onTabChange={s.setActiveTab} />

                        {s.activeTab === "register" && s.authError && s.authError !== "מייל לא חוקי" && (
                          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/60" role="alert">
                            <div className="flex items-center justify-center gap-2">
                              <AlertTriangle size={16} className="text-red-500 dark:text-red-400 shrink-0" />
                              <p className="text-red-500 dark:text-red-400 text-sm font-semibold text-hebrew-body">{s.authError}</p>
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

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                      נתקלתם בבעיה?{" "}
                      <Link
                        href="/contact"
                        onClick={s.handleClose}
                        className="text-[#d4826f] hover:text-[#c4735f] dark:text-[#e8917a] dark:hover:text-[#d4826f] font-semibold hover:underline transition-colors"
                      >
                        צרו קשר
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="h-1.5 bg-gradient-to-r from-[#d4826f] to-[#2e3c52]" />
              </motion.div>
            </div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
