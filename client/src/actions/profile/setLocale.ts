/**
 * Profile locale preference
 *
 * Persists the user's chosen UI language so the switcher choice follows
 * them across sessions. The NEXT_LOCALE cookie remains the fast path for
 * routing; this row is the durable copy.
 */

"use server";

import { prisma } from "@/lib/prisma";
import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { LocaleSchema, type LocalePreference } from "@/lib/validations/profile";
import { validateOrigin } from "@/lib/utils/csrf";
import { logger } from "@/lib/utils/logger";

export async function setMyLocale(
  input: LocalePreference,
): Promise<ActionResult<{ locale: LocalePreference }>> {
  return protectedAction(async (user) => {
    if (!(await validateOrigin())) {
      throw new ActionError("Invalid origin", 403);
    }

    const parsed = LocaleSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError("Invalid locale", 400);
    }

    try {
      await prisma.profile.update({
        where: { id: user.id },
        data: { locale: parsed.data, updatedAt: new Date() },
        select: { id: true },
      });
    } catch (err) {
      logger.error("[setMyLocale] update failed", { error: err });
      throw new ActionError("Failed to save language preference", 500);
    }

    return { locale: parsed.data };
  });
}
