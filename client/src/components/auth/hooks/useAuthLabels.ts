"use client";

/**
 * useAuthLabels — centralizes every static auth-flow string behind the
 * `auth` message namespace so form components don't each need their own
 * `useTranslations` call. Replaces the old `constants/index.ts` literals.
 */

import { useTranslations } from "next-intl";

export function useAuthLabels() {
  const t = useTranslations("auth");

  return {
    LOGIN_TITLE: t("login.title"),
    LOGIN_SUBTITLE: t("login.subtitle"),
    LOGIN_BUTTON: t("login.button"),
    LOGIN_ERROR_MESSAGE: t("login.errorMessage"),
    REGISTER_TITLE: t("register.title"),
    REGISTER_SUBTITLE: t("register.subtitle"),
    REGISTER_SUCCESS_MESSAGE: t("register.successMessage"),
    AUTH_LABELS: {
      firstName: t("labels.firstName"),
      lastName: t("labels.lastName"),
      email: t("labels.email"),
      password: t("labels.password"),
      confirmPassword: t("labels.confirmPassword"),
      dateOfBirth: t("labels.dateOfBirth"),
    },
    AUTH_PLACEHOLDERS: {
      firstName: t("placeholders.firstName"),
      lastName: t("placeholders.lastName"),
      email: "your@email.com",
      password: t("placeholders.password"),
      confirmPassword: t("placeholders.confirmPassword"),
      dateOfBirth: "",
    },
    AUTH_VALIDATION: {
      emailRequired: t("validation.emailRequired"),
      emailInvalid: t("validation.emailInvalid"),
      passwordRequired: t("validation.passwordRequired"),
      passwordMinLength: t("validation.passwordMinLength"),
      passwordFormat: t("validation.passwordFormat"),
      passwordHebrew: t("validation.passwordHebrew"),
      firstNameRequired: t("validation.firstNameRequired"),
      lastNameRequired: t("validation.lastNameRequired"),
      passwordMismatch: t("validation.passwordMismatch"),
      dateOfBirthRequired: t("validation.dateOfBirthRequired"),
      dateInvalid: t("validation.dateInvalid"),
      termsRequired: t("validation.termsRequired"),
    },
    FORGOT_PASSWORD_TITLE: t("forgotPassword.title"),
    FORGOT_PASSWORD_SUBTITLE: t("forgotPassword.subtitle"),
    FORGOT_PASSWORD_BUTTON: t("forgotPassword.button"),
    FORGOT_PASSWORD_SUCCESS: t("forgotPassword.success"),
    FORGOT_PASSWORD_BACK: t("forgotPassword.back"),
    FORGOT_PASSWORD_LINK: t("forgotPassword.link"),
    UPDATE_PASSWORD_TITLE: t("updatePassword.title"),
    UPDATE_PASSWORD_SUBTITLE: t("updatePassword.subtitle"),
    UPDATE_PASSWORD_BUTTON: t("updatePassword.button"),
    UPDATE_PASSWORD_SUCCESS: t("updatePassword.success"),
    UPDATE_PASSWORD_SUCCESS_SUBTITLE: t("updatePassword.successSubtitle"),
    UPDATE_PASSWORD_EXPIRED_MESSAGE: t("updatePassword.expiredMessage"),
  };
}

export type AuthLabels = ReturnType<typeof useAuthLabels>;
