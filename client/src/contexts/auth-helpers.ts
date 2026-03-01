/**
 * Auth Error Helpers
 *
 * Converts Supabase error messages to user-facing Hebrew strings.
 * Extracted from AuthContext.tsx to keep files under 150 lines.
 */

/** Convert Supabase errors to Hebrew messages */
export function getErrorMessage(errorMessage: string): string {
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes("email already registered") ||
    lowerMessage.includes("user already registered")
  ) {
    return "כתובת האימייל כבר בשימוש";
  }
  if (lowerMessage.includes("invalid email")) {
    return "כתובת אימייל לא תקינה";
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("weak")) {
    return "הסיסמה חלשה מדי";
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("short")) {
    return "הסיסמה קצרה מדי (מינימום 6 תווים)";
  }
  if (
    lowerMessage.includes("invalid login credentials") ||
    lowerMessage.includes("invalid credentials")
  ) {
    return "פרטי ההתחברות שגויים";
  }
  if (lowerMessage.includes("email not confirmed")) {
    return "יש לאמת את כתובת האימייל";
  }
  if (lowerMessage.includes("user not found")) {
    return "משתמש לא נמצא";
  }
  if (lowerMessage.includes("too many requests")) {
    return "יותר מדי ניסיונות. נסו שוב מאוחר יותר";
  }
  if (lowerMessage.includes("network")) {
    return "שגיאת רשת. בדקו את החיבור לאינטרנט";
  }

  return "אירעה שגיאה. נסו שנית";
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
