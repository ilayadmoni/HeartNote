/**
 * Auth-flow transactional emails (verify email, reset password, already
 * registered). Localized by the request locale (Hebrew default), using the
 * brand palette in inline CSS since email clients don't load Tailwind.
 */

import { Resend } from "resend";
import { logger } from "@/lib/utils/logger";
import { getRequestLocale } from "@/lib/i18n/server";
import type { Locale } from "@/i18n/locale";
import { emailCopy } from "./authEmails.copy";
import { wrapper } from "./authEmails.template";

let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_KEY) {
    resend = new Resend(process.env.RESEND_KEY);
  }
  return resend;
}

const FROM = process.env.RESEND_FROM_EMAIL || "HeartNote <noreply@heartnote.co.il>";

export async function sendVerificationEmail(email: string, verifyUrl: string): Promise<void> {
  const r = getResend();
  if (!r) {
    logger.warn("[authEmails] RESEND_KEY not configured — skipping verification email");
    return;
  }
  const locale = await getRequestLocale();
  const c = emailCopy[locale].verify;
  try {
    await r.emails.send({
      from: FROM,
      to: email,
      subject: c.subject,
      html: wrapper(locale, c.title, c.body, verifyUrl, c.cta),
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
  const locale = await getRequestLocale();
  const c = emailCopy[locale].resetPassword;
  try {
    await r.emails.send({
      from: FROM,
      to: email,
      subject: c.subject,
      html: wrapper(locale, c.title, c.body, resetUrl, c.cta),
    });
  } catch (err) {
    logger.error("[sendPasswordResetEmail] Resend error", { error: err });
  }
}

export async function sendAlreadyRegisteredEmail(email: string, loginUrl: string): Promise<void> {
  const r = getResend();
  if (!r) {
    logger.warn("[authEmails] RESEND_KEY not configured — skipping already-registered email");
    return;
  }
  const locale: Locale = await getRequestLocale();
  const c = emailCopy[locale].alreadyRegistered;
  try {
    await r.emails.send({
      from: FROM,
      to: email,
      subject: c.subject,
      html: wrapper(locale, c.title, c.body, loginUrl, c.cta, c.footnote),
    });
    logger.info("[authEmails] Sent already-registered email");
  } catch (err) {
    logger.error("[sendAlreadyRegisteredEmail] Resend error", { error: err });
  }
}
