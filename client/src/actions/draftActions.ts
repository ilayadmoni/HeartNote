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
 *
 * SEC-CRIT-3: Uses centralized createAdminClient() for service role access.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 */

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

const DraftIdSchema = z.string().uuid("Invalid draft ID format");

export async function claimGuestDraft(draftId: string) {
  // ── Input validation ───────────────────────────────────────────────
  const parsed = DraftIdSchema.safeParse(draftId);
  if (!parsed.success) {
    return { success: false, error: "Invalid draft ID format." };
  }

  // ── Auth gate ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User must be authenticated to claim drafts" };
  }

  // SEC-CRIT-3: Use centralized admin client with validation
  const adminClient = createAdminClient();

  // ── Read draft (idempotent — no deletion) ──────────────────────────
  const { data: draftData, error: selectError } = await adminClient
    .from("drafts")
    .select("metadata")
    .eq("id", draftId)
    .maybeSingle();

  // Draft missing or unreadable — already cleaned by Cron or prior call
  if (selectError || !draftData) {
    logger.info("[claimGuestDraft] Draft not found or unreadable", {
      draftId,
      error: selectError?.message ?? "no row returned",
    });
    return { success: false, error: "Draft not found — it may have expired." };
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
        logger.error("[claimGuestDraft] Image download failed", { error: downloadError?.message });
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
        logger.error("[claimGuestDraft] Image upload failed", { error: uploadError.message });
        return { success: false, error: "Failed to move draft image." };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("image_steamy_Window").getPublicUrl(newPath);

      metadata.background_image = publicUrl;
    } catch (imgErr) {
      logger.error("[claimGuestDraft] Image transfer crashed", { error: imgErr });
      return { success: false, error: "Image transfer failed unexpectedly." };
    }
  }

  // Strip internal keys before returning to the client
  delete metadata._temp_image_path;
  delete metadata._template_id;

  return { success: true, metadata };
}
