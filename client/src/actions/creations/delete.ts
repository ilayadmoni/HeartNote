/**
 * Delete Server Action — Soft-delete a creation
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";

/**
 * Soft-deletes a creation (sets is_deleted = true).
 * Only the owner can modify — enforced by the userId filter below.
 */
export async function deleteCreation(
  creationId: string,
): Promise<ActionResult<null>> {
  return protectedAction(async (user) => {
    const result = await prisma.creation.updateMany({
      where: { id: creationId, userId: user.id },
      data: { isDeleted: true },
    });

    if (result.count === 0) {
      throw new ActionError("Creation not found", 404);
    }

    // Invalidate cached data so subsequent reads reflect the deletion
    revalidatePath("/", "layout");

    return null;
  });
}
