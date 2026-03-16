/**
 * Auth Modal Constants
 */

// Login Modal
export const LOGIN_TITLE = "התחברו למפעל ";
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
export const REGISTER_SUCCESS_MESSAGE =
  "אם האימייל תקין, שלחנו אליכם הודעה. אם אינכם רואים אותה בתיבת הנכנס, בדקו גם בתיקיית הספאם/דואר זבל.";

// Form Labels
export const AUTH_LABELS = {
  firstName: "שם פרטי",
  lastName: "שם משפחה",
  email: "אימייל",
  password: "סיסמה",
  confirmPassword: "אימות סיסמה",
  dateOfBirth: "תאריך לידה",
} as const;

// Placeholders
export const AUTH_PLACEHOLDERS = {
  firstName: "משה",
  lastName: "זוכמיר",
  email: "your@email.com",
  password: "הכניסו סיסמה",
  confirmPassword: "הכניסו סיסמה שוב",
  dateOfBirth: "",
} as const;

// Validation
export const AUTH_VALIDATION = {
  emailRequired: "נא להזין אימייל",
  emailInvalid: "אימייל לא תקין",
  passwordRequired: "נא להזין סיסמה",
  passwordMinLength: "הסיסמה חייבת להכיל לפחות 8 תווים",
  passwordFormat: "הסיסמה חייבת להכיל לפחות אות אחת ומספר אחד",
  passwordHebrew: "הסיסמה חייבת להכיל אותיות באנגלית ומספרים בלבד. אין להשתמש בתווים בעברית.",
  firstNameRequired: "נא להזין שם פרטי",
  lastNameRequired: "נא להזין שם משפחה",
  passwordMismatch: "הסיסמאות אינן תואמות",
  dateOfBirthRequired: "נא להזין תאריך לידה",
  termsRequired: "יש לאשר את תנאי השימוש ומדיניות הפרטיות",
} as const;

// Forgot Password
export const FORGOT_PASSWORD_TITLE = "שחזור סיסמה";
export const FORGOT_PASSWORD_SUBTITLE = "הזינו את כתובת האימייל שלכם ונשלח לכם קישור לאיפוס הסיסמה";
export const FORGOT_PASSWORD_BUTTON = "שליחת קישור איפוס";
export const FORGOT_PASSWORD_SUCCESS =
  "אם הכתובת רשומה ופעילה במערכת, נשלח אליך קישור לאיפוס הסיסמה. אם אינך רואה אותו בתיבת הנכנס, בדוק גם בתיקיית הספאם/דואר זבל.";
export const FORGOT_PASSWORD_BACK = "חזרה להתחברות";
export const FORGOT_PASSWORD_LINK = "שכחתם את הסיסמה?";

// Update Password (after recovery link click)
export const UPDATE_PASSWORD_TITLE = "הגדרת סיסמה חדשה";
export const UPDATE_PASSWORD_SUBTITLE = "הזינו את הסיסמה החדשה שלכם";
export const UPDATE_PASSWORD_BUTTON = "עדכון סיסמה";
export const UPDATE_PASSWORD_SUCCESS = "הסיסמה שונתה בהצלחה!";
export const UPDATE_PASSWORD_SUCCESS_SUBTITLE = "תוכלו להתחבר עם הסיסמה החדשה";

// Login Error
export const LOGIN_ERROR_MESSAGE = "שם משתמש או סיסמה שגויים";

