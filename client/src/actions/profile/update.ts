/**
 * Profile UPDATE Action
 *
 * PATCH /profile/me → updateMyProfile(input)
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { ProfileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations";
import type { ProfileResponse } from "@/lib/validations";
import { buildProfileResponse } from "./helpers";
import { logAudit } from "@/lib/audit-logger";
import { validateOrigin } from "@/lib/utils/csrf";

/**
 * Partially updates the authenticated user's profile.
 * Only modifies fields that are explicitly provided.
 */
export async function updateMyProfile(
  input: ProfileUpdateInput,
): Promise<ActionResult<ProfileResponse>> {
  return protectedAction(async (user) => {
    // ── SEC-HIGH-4: CSRF validation ───────────────────────────────────
    if (!(await validateOrigin())) {
      throw new ActionError("Invalid origin", 403);
    }

    const parsed = ProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((i) => i.message).join("; "),
        422,
      );
    }

    // Build update dict — only include provided fields
    const updateDict: Record<string, unknown> = {};
    if (parsed.data.first_name !== undefined) updateDict.firstName = parsed.data.first_name;
    if (parsed.data.last_name !== undefined) updateDict.lastName = parsed.data.last_name;
    if (parsed.data.date_of_birth !== undefined) updateDict.dateOfBirth = new Date(parsed.data.date_of_birth);
    if (parsed.data.avatar_url !== undefined) updateDict.avatarUrl = parsed.data.avatar_url;

    let profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile) throw new ActionError("Profile not found.", 404);

    // If nothing to update, just return current profile
    if (Object.keys(updateDict).length === 0) {
      return buildProfileResponse(profile);
    }

    try {
      profile = await prisma.profile.update({
        where: { id: user.id },
        data: { ...updateDict, updatedAt: new Date() },
      });
    } catch (err) {
      throw new ActionError(
        `Failed to update profile: ${err instanceof Error ? err.message : "unknown error"}`,
        500,
      );
    }

    await logAudit({
      eventType: "user.profile_updated",
      userId: user.id,
      metadata: { changed_fields: Object.keys(updateDict) },
    });

    if (updateDict.firstName !== undefined || updateDict.lastName !== undefined) {
      await logAudit({
        eventType: "user.name_changed",
        userId: user.id,
        metadata: { first_name: updateDict.firstName, last_name: updateDict.lastName },
      });
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return buildProfileResponse(profile);
  });
}
