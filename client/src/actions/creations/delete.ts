/**
 * Delete Server Action — Soft-delete a creation
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Soft-deletes a creation (sets is_deleted = true).
 * RLS enforces that only the owner can modify.
 */
export async function deleteCreation(
  creationId: string,
): Promise<{ success: true } | { error: string; status: number }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    // Verify ownership
    const { data, error: findErr } = await supabase
      .from("creations")
      .select("id")
      .eq("id", creationId)
      .eq("user_id", user.id);

    if (findErr || !data?.length) {
      return { error: "Creation not found", status: 404 };
    }

    const { error: updateErr } = await supabase
      .from("creations")
      .update({ is_deleted: true })
      .eq("id", creationId);

    if (updateErr) {
      return {
        error: `Failed to delete: ${updateErr.message}`,
        status: 500,
      };
    }

    // Invalidate cached data so subsequent reads reflect the deletion
    revalidatePath("/", "layout");

    return { success: true };
  } catch (e) {
    return {
      error: `Failed to delete creation: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
