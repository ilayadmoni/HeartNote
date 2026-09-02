/**
 * Locale copy for auth transactional emails. Kept separate from the send
 * functions so authEmails.ts stays under the file-length cap.
 */

interface EmailVariant {
  subject: string;
  title: string;
  body: string;
  cta: string;
  footnote?: string;
}

interface LocaleEmailCopy {
  verify: EmailVariant;
  resetPassword: EmailVariant;
  alreadyRegistered: EmailVariant;
}

export const emailCopy: Record<"he" | "en", LocaleEmailCopy> = {
  he: {
    verify: {
      subject: "אמתו את כתובת האימייל שלכם",
      title: "כמעט שם! 🎉",
      body: "לחצו על הכפתור למטה כדי לאמת את כתובת האימייל שלכם ולהשלים את ההרשמה.",
      cta: "אימות אימייל",
    },
    resetPassword: {
      subject: "איפוס סיסמה",
      title: "איפוס סיסמה",
      body: "קיבלנו בקשה לאיפוס הסיסמה שלכם. לחצו על הכפתור למטה כדי לבחור סיסמה חדשה. אם לא ביקשתם זאת, ניתן להתעלם מהודעה זו.",
      cta: "איפוס סיסמה",
    },
    alreadyRegistered: {
      subject: "התחברות לחשבון הקיים שלך",
      title: "יש לך כבר חשבון 🎉",
      body: "זיהינו שניסית להירשם עם אימייל זה, אך כבר קיים חשבון פעיל במערכת. אנא היכנס לחשבון שלך או בצע איפוס סיסמה אם שכחת אותה.",
      cta: "כניסה לחשבון",
      footnote: "אם לא ניסית להירשם, תוכלו להתעלם מהודעה זו.",
    },
  },
  en: {
    verify: {
      subject: "Verify your email address",
      title: "Almost there! 🎉",
      body: "Click the button below to verify your email address and finish signing up.",
      cta: "Verify email",
    },
    resetPassword: {
      subject: "Reset your password",
      title: "Reset your password",
      body: "We received a request to reset your password. Click the button below to choose a new one. If you didn't request this, you can ignore this email.",
      cta: "Reset password",
    },
    alreadyRegistered: {
      subject: "Log in to your existing account",
      title: "You already have an account 🎉",
      body: "We noticed you tried to sign up with this email, but an active account already exists. Please log in, or reset your password if you've forgotten it.",
      cta: "Log in",
      footnote: "If you didn't try to sign up, you can safely ignore this email.",
    },
  },
};
