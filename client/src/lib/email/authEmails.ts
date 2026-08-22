/**
 * Auth-flow transactional emails (verify email, reset password).
 *
 * Uses the same Resend setup as actions/registration.ts and actions/contact.ts
 * (RESEND_KEY / RESEND_FROM_EMAIL) — those call sites are untouched, this is
 * just the new sender for flows that used to be handled by Supabase Auth's
 * built-in mailer (email confirmation, password recovery).
 */

import { Resend } from "resend";
import { logger } from "@/lib/utils/logger";

let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_KEY) {
    resend = new Resend(process.env.RESEND_KEY);
  }
  return resend;
}

const FROM = process.env.RESEND_FROM_EMAIL || "HeartNote <noreply@heartnote.co.il>";

function wrapper(title: string, bodyHtml: string, ctaUrl: string, ctaLabel: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: Arial, sans-serif; background-color: #faf7f5; padding: 40px 20px; margin: 0;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <h1 style="color: #2e3c52; font-size: 24px; margin: 0 0 16px; text-align: center;">${title}</h1>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">${bodyHtml}</p>
        <div style="text-align: center;">
          <a href="${ctaUrl}" style="display: inline-block; background: #2e3c52; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            ${ctaLabel}
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail(email: string, verifyUrl: string): Promise<void> {
  const r = getResend();
  if (!r) {
    logger.warn("[authEmails] RESEND_KEY not configured — skipping verification email");
    return;
  }
  try {
    await r.emails.send({
      from: FROM,
      to: email,
      subject: "אמתו את כתובת האימייל שלכם",
      html: wrapper(
        "כמעט שם! 🎉",
        "לחצו על הכפתור למטה כדי לאמת את כתובת האימייל שלכם ולהשלים את ההרשמה.",
        verifyUrl,
        "אימות אימייל",
      ),
    });
  } catch (err) {
    logger.error("[sendVerificationEmail] Resend error", { error: err });
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const r = getResend();
  if (!r) {
    logger.warn("[authEmails] RESEND_KEY not configured — skipping password reset email");
    return;
  }
  try {
    await r.emails.send({
      from: FROM,
      to: email,
      subject: "איפוס סיסמה",
      html: wrapper(
        "איפוס סיסמה",
        "קיבלנו בקשה לאיפוס הסיסמה שלכם. לחצו על הכפתור למטה כדי לבחור סיסמה חדשה. אם לא ביקשתם זאת, ניתן להתעלם מהודעה זו.",
        resetUrl,
        "איפוס סיסמה",
      ),
    });
  } catch (err) {
    logger.error("[sendPasswordResetEmail] Resend error", { error: err });
  }
}
