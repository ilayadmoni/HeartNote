"use server";

/**
 * Registration Server Action
 * ──────────────────────────
 * registerUser – 3-step registration logic:
 *
 *   1. Banned check   → explicit error "מייל לא חוקי"
 *   2. Existing user  → generic success + "already have account" email via Resend
 *   3. New user       → create account + generic success
 *
 * SEC-2: Steps 2 & 3 return the SAME generic success string
 *   so attackers can't enumerate registered emails.
 *   Only banned emails get an explicit rejection.
 */

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

interface RegistrationResult {
  success?: string;
  error?: string;
}

/** Shown for both existing-user and new-user outcomes */
const GENERIC_SUCCESS =
  "אם האימייל תקין, שלחנו אליכם הודעה. אם אינכם רואים אותה בתיבת הנכנס, בדקו גם בתיקיית הספאם/דואר זבל.";

const ERR_INTERNAL =
  "אירעה שגיאה פנימית במערכת. אנא נסו שוב מאוחר יותר.";

/** Hebrew character range — blocked in passwords */
const HEBREW_REGEX = /[\u0590-\u05FF]/;

/** Resend client (lazy init) */
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_KEY) {
    resend = new Resend(process.env.RESEND_KEY);
  }
  return resend;
}

/** Send "you already have an account" email via Resend */
async function sendAlreadyRegisteredEmail(email: string): Promise<void> {
  const r = getResend();
  if (!r) {
    console.warn("[registerUser] RESEND_API_KEY not configured — skipping email");
    return;
  }

  try {
    await r.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "HeartNote <noreply@heartnote.co.il>",
      to: email,
      subject: "התחברות לחשבון הקיים שלך",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #faf7f5; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h1 style="color: #2e3c52; font-size: 24px; margin: 0 0 16px; text-align: center;">
              🎉יש לך כבר חשבון 
            </h1>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
              זיהינו שניסית להירשם עם אימייל זה, אך כבר קיים חשבון פעיל במערכת.
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
              אנא היכנס לחשבון שלך או בצע איפוס סיסמה אם שכחת אותה.
            </p>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://heartnote.co.il"}/?modal=login"
                 style="display: inline-block; background: #2e3c52; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                כניסה לחשבון
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 32px 0 0; text-align: center;">
              אם לא ניסית להירשם, תוכלו להתעלם מהודעה זו.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`[registerUser] Sent "already registered" email to: ${email}`);
  } catch (err) {
    console.error("[registerUser] Resend email error:", err);
    // Non-fatal — continue returning generic success
  }
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dateOfBirth?: string,
): Promise<RegistrationResult> {
  /* ── Basic validation ────────────────────────────────────────── */
  const trimmedEmail = email?.trim().toLowerCase();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { error: "נא להזין כתובת אימייל תקינה." };
  }
  if (!password || password.length < 8) {
    return { error: "הסיסמה חייבת להכיל לפחות 8 תווים." };
  }
  if (HEBREW_REGEX.test(password)) {
    return {
      error:
        "הסיסמה חייבת להכיל אותיות באנגלית ומספרים בלבד. אין להשתמש בתווים בעברית.",
    };
  }
  if (!firstName?.trim() || !lastName?.trim()) {
    return { error: "נא להזין שם פרטי ושם משפחה." };
  }

  /* ── Admin client ────────────────────────────────────────────── */
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    console.error("[registerUser] Failed to create admin client");
    return { error: ERR_INTERNAL };
  }

  /* ── Step 1: Banned check → explicit error ───────────────────── */
  const { data: banned } = await admin
    .from("banned_users")
    .select("id")
    .eq("email", trimmedEmail)
    .maybeSingle();

  if (banned) {
    console.log(
      `[registerUser] Banned email rejected: ${trimmedEmail}`,
    );
    return { error: "מייל לא חוקי" };
  }

  /* ── Step 2: Existing user → generic success + notify email ──── */
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, email")
    .eq("email", trimmedEmail)
    .maybeSingle();

  if (existingProfile) {
    console.log(
      `[registerUser] Existing user — sending notification: ${trimmedEmail}`,
    );

    // Send "you already have an account" email (non-blocking)
    await sendAlreadyRegisteredEmail(trimmedEmail);

    return { success: GENERIC_SUCCESS };
  }

  /* ── Step 3: New user → create account ───────────────────────── */
  // Use the standard server client so Supabase sends its built-in
  // confirmation email automatically. The Admin API skips that flow.
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const userMeta: Record<string, string> = {
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    full_name: fullName,
  };
  if (dateOfBirth) {
    userMeta.date_of_birth = dateOfBirth;
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    console.error("[registerUser] Failed to create server client");
    return { error: ERR_INTERNAL };
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: { data: userMeta },
  });

  if (signUpError) {
    console.error("[registerUser] signUp error:", signUpError);
    return { error: ERR_INTERNAL };
  }

  return { success: GENERIC_SUCCESS };
}
