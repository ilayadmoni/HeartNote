"use server";

/**
 * updatePassword – verifies the emailed token and saves the new password.
 * SEC-2 COMPLIANT: All detailed errors are logged server-side only.
 */

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { passwordResetLimiter } from "@/lib/utils/rate-limiters";
import { consumeVerificationToken } from "@/lib/auth/tokens";
import { getActionT } from "@/lib/i18n/server";
import { getClientIp, type PasswordActionResult } from "./shared";

export async function updatePassword(
  token: string,
  formData: FormData,
): Promise<PasswordActionResult> {
  const t = await getActionT("errors");
  try {
    if (!(await validateOrigin())) {
      logger.warn("[updatePassword] CSRF validation failed");
      return { error: t("csrf.invalidRequest") };
    }

    const newPassword = formData.get("password")?.toString();
    if (!newPassword || newPassword.length < 8) {
      return { error: t("password.tooShort") };
    }

    const email = await consumeVerificationToken(token, "password_reset");
    if (!email) {
      return { error: t("password.resetProcessFailed") };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    try {
      const user = await prisma.user.update({ where: { email }, data: { passwordHash } });
      await prisma.profile.update({ where: { id: user.id }, data: { resetAttempts: 0 } });
      await passwordResetLimiter.reset(await getClientIp());
    } catch (err) {
      logger.error("[updatePassword] Update failed", { error: err });
      return { error: t("password.resetProcessFailed") };
    }

    return { success: t("password.updateSuccess") };
  } catch (err) {
    logger.error("[updatePassword] Unexpected error", { error: err });
    return { error: t("password.resetProcessFailed") };
  }
}
