"use server";

/**
 * Contact Form Server Action
 * Sends an email via Resend when a user submits the contact form.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

interface ContactActionResult {
  success?: string;
  error?: string;
}

export async function sendContactEmail(
  formData: FormData,
): Promise<ContactActionResult> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const subject = formData.get("subject")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  // ── Basic validation ──────────────────────────────────────────────
  if (!name || !email || !message) {
    return { error: "נא למלא את כל השדות הנדרשים." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "כתובת האימייל אינה תקינה." };
  }

  // ── Send email via Resend ─────────────────────────────────────────
  try {
    const { error } = await resend.emails.send({
      from: "HeartNote <contact@heartnote.co.il>",
      to: process.env.MAIL_HEART_NOTE!,
      subject: subject || `הודעה חדשה מ-${name}`,
      replyTo: email,
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #d4826f; border-bottom: 2px solid #d4826f; padding-bottom: 12px;">
            📬 הודעה חדשה מטופס יצירת קשר
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2e3c52; width: 100px;">שם:</td>
              <td style="padding: 8px 12px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2e3c52;">אימייל:</td>
              <td style="padding: 8px 12px;">
                <a href="mailto:${email}" style="color: #d4826f;">${email}</a>
              </td>
            </tr>
            ${
              subject
                ? `<tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2e3c52;">נושא:</td>
              <td style="padding: 8px 12px;">${subject}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 20px; padding: 16px; background-color: #faf7f5; border-radius: 8px; border-right: 4px solid #d4826f;">
            <p style="margin: 0; font-weight: bold; color: #2e3c52;">הודעה:</p>
            <p style="margin: 8px 0 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #888;">
            ניתן להשיב ישירות למייל זה — התשובה תגיע ל-${email}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return { error: "שליחת ההודעה נכשלה. נסו שוב מאוחר יותר." };
    }

    return { success: "ההודעה נשלחה בהצלחה! נחזור אליך בהקדם." };
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return { error: "שגיאה בלתי צפויה. נסו שוב מאוחר יותר." };
  }
}
