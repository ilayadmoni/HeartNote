"use server";

/**
 * Contact Form Server Action
 * ──────────────────────────
 * Sends an email via Resend when a user submits the contact form.
 *
 * SEC-3: All user input is HTML-escaped before template interpolation.
 * SEC-4: IP-based sliding-window rate limiting via Redis (5 req / 60 s).
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 * SEC-HIGH-2: CSRF origin validation for state-changing operation.
 */

import { headers } from "next/headers";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/utils/sanitize";
import { contactLimiter } from "@/lib/utils/rate-limiters";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { ContactFormSchema } from "@/lib/validations/contact";

const resend = new Resend(process.env.RESEND_KEY);

interface ContactActionResult {
  success?: string;
  error?: string;
}

/** Extract the caller's IP from request headers */
async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function sendContactEmail(
  formData: FormData,
): Promise<ContactActionResult> {
  try {
    // ── SEC-HIGH-2: CSRF validation ───────────────────────────────────
    if (!await validateOrigin()) {
      logger.warn("[contact] CSRF validation failed");
      return { error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב." };
    }

    const formParsed = ContactFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject") || undefined,
      message: formData.get("message"),
    });
    if (!formParsed.success) {
      const issue = formParsed.error.issues[0];
      const field = String(issue.path[0] ?? "");
      if (field === "email") return { error: "כתובת האימייל אינה תקינה." };
      if (field === "name") return { error: "שם ארוך מידי (מקסימום 100 תווים)." };
      if (field === "subject") return { error: "נושא ארוך מידי (מקסימום 200 תווים)." };
      if (field === "message") return { error: "ההודעה ארוכה מידי (מקסימום 5000 תווים)." };
      return { error: "נא למלא את כל השדות הנדרשים." };
    }
    const { name, email, subject, message } = formParsed.data;

    // ── SEC-4: Redis rate limiting ──────────────────────────────────────
    const ip = await getClientIp();
    const rateLimitResult = await contactLimiter.check(ip);
    
    if (!rateLimitResult.success) {
      logger.warn("[contact] Rate-limited request", { ip, remaining: rateLimitResult.remaining });
      return { error: "שלחת יותר מדי הודעות. אנא נסה שוב בעוד דקה." };
    }

    // ── Sanitise user input (SEC-3) ───────────────────────────────────
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = subject ? escapeHtml(subject) : "";
    const safeMessage = escapeHtml(message);

    // ── Send email via Resend ─────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: "HeartNote <contact@heartnote.co.il>",
      to: process.env.MAIL_HEART_NOTE!,
      subject: safeSubject || `הודעה חדשה מ-${safeName}`,
      replyTo: email,
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #d4826f; border-bottom: 2px solid #d4826f; padding-bottom: 12px;">
            📬 הודעה חדשה מטופס יצירת קשר
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2e3c52; width: 100px;">שם:</td>
              <td style="padding: 8px 12px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2e3c52;">אימייל:</td>
              <td style="padding: 8px 12px;">
                <a href="mailto:${safeEmail}" style="color: #d4826f;">${safeEmail}</a>
              </td>
            </tr>
            ${
              safeSubject
                ? `<tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2e3c52;">נושא:</td>
              <td style="padding: 8px 12px;">${safeSubject}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 20px; padding: 16px; background-color: #faf7f5; border-radius: 8px; border-right: 4px solid #d4826f;">
            <p style="margin: 0; font-weight: bold; color: #2e3c52;">הודעה:</p>
            <p style="margin: 8px 0 0; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #888;">
            ניתן להשיב ישירות למייל זה — התשובה תגיע ל-${safeEmail}
          </p>
        </div>
      `,
    });

    if (sendError) {
      logger.error("[contact] Resend error", { error: sendError });
      return { error: "שליחת ההודעה נכשלה. נסו שוב מאוחר יותר." };
    }

    return { success: "ההודעה נשלחה בהצלחה! נחזור אליך בהקדם." };
  } catch (err) {
    // SEC: Log full error server-side, return generic message to client
    logger.error("[contact] Unexpected error", { error: err });
    return { error: "שגיאה בלתי צפויה. נסו שוב מאוחר יותר." };
  }
}
