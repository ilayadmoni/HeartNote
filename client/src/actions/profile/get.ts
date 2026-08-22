/**
 * Profile GET Actions
 *
 * GET /profile/me → getMyProfile()
 * GET /profile/avatars → getAvatarOptions()
 */

"use server";

import { prisma } from "@/lib/prisma";
import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { type ProfileResponse, AVATAR_OPTIONS } from "@/lib/validations";
import { buildProfileResponse } from "./helpers";

/**
 * Fetches the authenticated user's profile including subscription status.
 */
export async function getMyProfile(): Promise<ActionResult<ProfileResponse>> {
  return protectedAction(async (user) => {
    const profile = await prisma.profile.findUnique({ where: { id: user.id } });

    if (!profile) {
      throw new ActionError(
        "Profile not found. Please complete registration.",
        404,
      );
    }

    return buildProfileResponse(profile);
  });
}

/**
 * Returns the list of Netflix-style avatar URLs.
 * Public — no auth required.
 */
export async function getAvatarOptions(): Promise<{ avatars: string[] }> {
  return { avatars: [...AVATAR_OPTIONS] };
}
