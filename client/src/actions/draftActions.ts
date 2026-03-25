"use server";

/**
 * claimGuestDraft — Idempotent Draft Restoration
 *
 * Reads a guest draft from the DB and returns its metadata so the
 * editor can restore the user's work after OAuth login.
 *
 * Design decisions:
 * - NO manual deletion: a Cron job cleans drafts older than 24 hours.
 *   Keeping the row alive makes this action naturally idempotent —
 *   mobile double-fires simply re-read the same row.
 * - maybeSingle() instead of single() to avoid PGRST116 on missing rows.
 * - All failure paths return { success, error } instead of throwing,
 *   so the client never sees an unhandled Server Action crash.
 */

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function claimGuestDraft(draftId: string) {
  // ── Auth gate ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User must be authenticated to claim drafts" };
  }

  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // ── Read draft (idempotent — no deletion) ──────────────────────────
  const { data: draftData, error: selectError } = await adminClient
    .from("drafts")
    .select("metadata, user_id")
    .eq("id", draftId)
    .maybeSingle();

  // Draft missing or unreadable — already cleaned by Cron or prior call
  if (selectError || !draftData) {
    console.log(
      `[claimGuestDraft] Draft ${draftId} not found or unreadable.`,
      selectError?.message ?? "no row returned",
    );
    return { success: false, error: "Draft not found — it may have expired." };
  }

  // Draft already assigned to a user
  if (draftData.user_id) {
    if (draftData.user_id === user.id) {
      // Same user re-requesting (double-fire) — return the metadata again
      const meta = draftData.metadata as Record<string, any>;
      delete meta._temp_image_path;
      delete meta._template_id;
      return { success: true, metadata: meta };
    }
    // A different user owns this draft
    return { success: false, error: "This draft belongs to another user." };
  }

  // ── Process guest draft ────────────────────────────────────────────
  const metadata = draftData.metadata as Record<string, any>;
  const templateSlug = metadata._template_id as string;
  const tempImagePath = metadata._temp_image_path as string | undefined;

  if (!templateSlug) {
    return { success: false, error: "Draft metadata is missing template mapping." };
  }

  // Verify template exists
  const { data: template, error: tmplErr } = await supabase
    .from("templates")
    .select("id")
    .eq("slug", templateSlug)
    .single();

  if (tmplErr || !template) {
    return { success: false, error: "Template not found in registry." };
  }

  // ── Cross-bucket file transfer (temp_drafts → permanent bucket) ────
  if (tempImagePath) {
    try {
      const { data: fileData, error: downloadError } = await adminClient.storage
        .from("temp_drafts")
        .download(tempImagePath);

      if (downloadError || !fileData) {
        console.error("[claimGuestDraft] Image download failed:", downloadError?.message);
        return { success: false, error: "Failed to download draft image." };
      }

      const ext = tempImagePath.split(".").pop() || "jpeg";
      const newPath = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("image_steamy_Window")
        .upload(newPath, fileData, {
          contentType: fileData.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("[claimGuestDraft] Image upload failed:", uploadError.message);
        return { success: false, error: "Failed to move draft image." };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("image_steamy_Window").getPublicUrl(newPath);

      metadata.background_image = publicUrl;
    } catch (imgErr) {
      console.error("[claimGuestDraft] Image transfer crashed:", imgErr);
      return { success: false, error: "Image transfer failed unexpectedly." };
    }
  }

  // ── Mark draft as claimed (but do NOT delete — Cron handles cleanup) ─
  await adminClient
    .from("drafts")
    .update({ user_id: user.id })
    .eq("id", draftId);

  // Strip internal keys before returning to the client
  delete metadata._temp_image_path;
  delete metadata._template_id;

  return { success: true, metadata };
}
