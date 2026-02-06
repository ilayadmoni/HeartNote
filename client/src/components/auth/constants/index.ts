/**
 * Auth Modal Constants
 */

// Login Modal
export const LOGIN_TITLE = "Welcome Back";
export const LOGIN_SUBTITLE = "היכנסו למפעל כדי להמשיך ליצור";
export const LOGIN_BUTTON = "התחברות";
export const LOGIN_REGISTER_PROMPT = "אין לכם חשבון?";
export const LOGIN_REGISTER_LINK = "הירשמו בחינם";

// Register Modal
export const REGISTER_TITLE = "הצטרפו למפעל";
export const REGISTER_SUBTITLE = "צרו חשבון והתחילו ליצור ברכות מרהיבות";
export const REGISTER_BUTTON = "הרשמה";
export const REGISTER_LOGIN_PROMPT = "כבר יש לכם חשבון?";
export const REGISTER_LOGIN_LINK = "התחברו";

// Form Labels
export const AUTH_LABELS = {
  name: "שם מלא",
  email: "אימייל",
  password: "סיסמה",
  confirmPassword: "אימות סיסמה",
} as const;

// Placeholders
export const AUTH_PLACEHOLDERS = {
  name: "הכניסו את שמכם",
  email: "your@email.com",
  password: "••••••••",
  confirmPassword: "••••••••",
} as const;

// Validation
export const AUTH_VALIDATION = {
  emailRequired: "נא להזין אימייל",
  emailInvalid: "אימייל לא תקין",
  passwordRequired: "נא להזין סיסמה",
  passwordMinLength: "הסיסמה חייבת להכיל לפחות 6 תווים",
  nameRequired: "נא להזין שם",
  passwordMismatch: "הסיסמאות אינן תואמות",
} as const;
