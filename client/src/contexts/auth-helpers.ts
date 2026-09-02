/**
 * Auth Error Helpers
 *
 * Converts raw NextAuth/network error messages to a translated,
 * user-facing string. Extracted from AuthContext.tsx to keep files
 * under 150 lines.
 */

/** Translator shape for the `auth.errorMap` namespace keys. */
type ErrorMapT = (key: string) => string;

/** Convert auth errors to a translated user-facing message. */
export function getErrorMessage(errorMessage: string, t: ErrorMapT): string {
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes("email already registered") ||
    lowerMessage.includes("user already registered")
  ) {
    return t("errorMap.emailInUse");
  }
  if (lowerMessage.includes("invalid email")) {
    return t("errorMap.emailInvalid");
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("weak")) {
    return t("errorMap.passwordWeak");
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("short")) {
    return t("errorMap.passwordShort");
  }
  if (
    lowerMessage.includes("invalid login credentials") ||
    lowerMessage.includes("invalid credentials")
  ) {
    return t("errorMap.invalidCredentials");
  }
  if (lowerMessage.includes("email not confirmed")) {
    return t("errorMap.emailNotConfirmed");
  }
  if (lowerMessage.includes("user not found")) {
    return t("errorMap.userNotFound");
  }
  if (lowerMessage.includes("too many requests")) {
    return t("errorMap.tooManyRequests");
  }
  if (lowerMessage.includes("network")) {
    return t("errorMap.networkError");
  }

  return t("errorMap.generic");
}

/** Format a date-of-birth string to YYYY-MM-DD for PostgreSQL.
 *  Validates the date without converting through local→UTC (avoids off-by-one). */
export function formatDateOfBirth(dateOfBirth: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return null;

  const [y, m, d] = dateOfBirth.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));

  // Ensure the components round-trip (catches Feb 30, etc.)
  if (
    isNaN(utc.getTime()) ||
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }

  return dateOfBirth;
}
