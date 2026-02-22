"use client";

/**
 * LoginModal Component
 * Modal dialog for user login, registration, and password reset.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn } from "lucide-react";
import { AuthInput } from "./AuthInput";
import { AuthTabs } from "./AuthTabs";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { FocusTrap } from "@/components/accessibility";
import { useAuth } from "@/contexts/AuthContext";
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
} from "../constants";
import type { LoginModalProps, LoginFormData } from "../types";

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signUp, error, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", password: "" });
      setErrors({});
      setActiveTab("login");
      setShowForgotPassword(false);
      setIsSubmitting(false);
      clearError();
    }
  }, [isOpen, clearError]);

  // Prevent body scroll — single source of truth
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signIn(formData.email, formData.password);
      onClose();
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string,
  ) => {
    setIsSubmitting(true);
    try {
      await signUp(email, password, firstName, lastName, dateOfBirth);
      // Don't close modal - RegisterForm will show success message
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackFromForgot = () => {
    setShowForgotPassword(false);
    clearError();
  };

  const title = activeTab === "login" ? LOGIN_TITLE : REGISTER_TITLE;
  const subtitle = activeTab === "login" ? LOGIN_SUBTITLE : REGISTER_SUBTITLE;

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap active={isOpen} onEscape={onClose}>
          {/* Full-screen portal layer */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop — click outside closes */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Centered layout — clicks pass through to backdrop */}
            <div className="relative flex items-center justify-center h-full p-4 py-8 md:py-4">
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
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                  aria-label="סגור"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>

                {/* Scrollable Content */}
                <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden">
                  <div className="p-4 sm:p-5 pt-8 box-border">
                    {/* Forgot Password View */}
                    {showForgotPassword ? (
                      <ForgotPasswordForm onBack={handleBackFromForgot} />
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

                        {/* Error Message */}
                        {error && (
                          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
                              {error}
                            </p>
                          </div>
                        )}

                        {/* Login Form */}
                        {activeTab === "login" && (
                          <form onSubmit={handleLogin}>
                            <AuthInput
                              id="login-email"
                              label={AUTH_LABELS.email}
                              type="email"
                              placeholder={AUTH_PLACEHOLDERS.email}
                              value={formData.email}
                              onChange={(value) =>
                                setFormData({ ...formData, email: value })
                              }
                              error={errors.email}
                            />

                            <AuthInput
                              id="login-password"
                              label={AUTH_LABELS.password}
                              type="password"
                              placeholder={AUTH_PLACEHOLDERS.password}
                              value={formData.password}
                              onChange={(value) =>
                                setFormData({ ...formData, password: value })
                              }
                              error={errors.password}
                            />

                            {/* Forgot Password Link */}
                            <div className="flex justify-start mb-2">
                              <button
                                type="button"
                                onClick={() => {
                                  clearError();
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
                        )}

                        {/* Register Form */}
                        {activeTab === "register" && (
                          <RegisterForm
                            onSubmit={handleRegister}
                            isSubmitting={isSubmitting}
                            serverError={error}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#d4826f] to-[#2e3c52]" />
              </motion.div>
            </div>
          </motion.div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
}
