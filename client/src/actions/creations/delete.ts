/**
 * Delete Server Action — Soft-delete a creation
 */

"use server";

import { revalidatePath } from "next/cache";
import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";

/**
 * Soft-deletes a creation (sets is_deleted = true).
 * RLS enforces that only the owner can modify.
 */
export async function deleteCreation(
  creationId: string,
): Promise<ActionResult<null>> {
  return protectedAction(async (user, supabase) => {
    // Verify ownership
    const { data, error: findErr } = await supabase
      .from("creations")
      .select("id")
      .eq("id", creationId)
      .eq("user_id", user.id);

    if (findErr || !data?.length) {
      throw new ActionError("Creation not found", 404);
    }

    const { error: updateErr } = await supabase
      .from("creations")
      .update({ is_deleted: true })
      .eq("id", creationId);

    if (updateErr) {
      throw new ActionError(`Failed to delete: ${updateErr.message}`, 500);
    }

    // Invalidate cached data so subsequent reads reflect the deletion
    revalidatePath("/", "layout");

    return null;
  });
}
