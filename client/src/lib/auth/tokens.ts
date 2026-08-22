/**
 * Email-verification / password-reset tokens.
 *
 * Replaces Supabase Auth's built-in confirmation & recovery emails (GoTrue's
 * own mailer), which the Credentials provider has no equivalent for. Tokens
 * are random, single-use, and stored hashed so a DB read alone can't be used
 * to complete the flow.
 */

import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export type VerificationTokenType = "email_verification" | "password_reset";

const TTL_MINUTES: Record<VerificationTokenType, number> = {
  email_verification: 60 * 24, // 24h
  password_reset: 30, // 30m — matches the short-lived recovery link Supabase issued
};

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/** Create a token and return the raw (unhashed) value to embed in the email link. */
export async function createVerificationToken(
  identifier: string,
  type: VerificationTokenType,
): Promise<string> {
  const raw = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MINUTES[type] * 60_000);

  // Invalidate any earlier unconsumed tokens of the same kind for this email
  // so only the most recently requested link works.
  await prisma.verificationToken.updateMany({
    where: { identifier, type, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.verificationToken.create({
    data: { identifier, type, tokenHash: hashToken(raw), expiresAt },
  });

  return raw;
}

/** Consume a token: returns the identifier (email) if valid, or null. */
export async function consumeVerificationToken(
  rawToken: string,
  type: VerificationTokenType,
): Promise<string | null> {
  const tokenHash = hashToken(rawToken);

  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });
  if (!record || record.type !== type || record.consumedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.verificationToken.update({
    where: { tokenHash },
    data: { consumedAt: new Date() },
  });

  return record.identifier;
}
