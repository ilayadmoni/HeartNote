/**
 * Credentials provider authorize() logic.
 *
 * Mirrors actions/auth.ts's loginAction anti-enumeration posture: banned
 * emails, unknown emails, unverified emails, and wrong passwords all fail
 * identically (return null) so the client can't distinguish them. Supabase's
 * signInWithPassword used to reject unconfirmed emails the same generic way
 * — this preserves that behavior at the app layer.
 */

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";

export interface AuthorizedUser {
  id: string;
  email: string;
  name: string | null;
}

export async function authorizeCredentials(
  email: string,
  password: string,
): Promise<AuthorizedUser | null> {
  const banned = await prisma.bannedUser.findUnique({ where: { email } });
  if (banned) {
    logger.info("[authorizeCredentials] Banned email attempted login", { email });
    return null;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return null;
  }

  if (!user.emailVerified) {
    logger.info("[authorizeCredentials] Unverified email attempted login", { email });
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.name };
}
