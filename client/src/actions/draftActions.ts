"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function claimGuestDraft(draftId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to claim drafts");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const adminClient = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);

  // 1. SELECT the draft
  const { data: draftData, error: selectError } = await adminClient
    .from("drafts")
    .select("metadata, user_id")
    .eq("id", draftId)
    .maybeSingle(); // MUST BE maybeSingle

  // If the draft is gone or unreadable, it was likely already processed
  // by a previous request (mobile double-fire scenario). Return success
  // so the client doesn't show an error for a completed operation.
  if (selectError || !draftData) {
    console.log(
      `[claimGuestDraft] Draft ${draftId} not found or already processed.`,
      selectError?.message ?? "no row returned",
    );
    return { success: true, isAlreadyProcessed: true };
  }

  if (draftData.user_id) {
    // Same user re-requesting (double-fire) — return the metadata so the client can use it
    if (draftData.user_id === user.id) {
      console.log(`[claimGuestDraft] Draft ${draftId} already claimed by same user.`);
      return { success: true, isAlreadyProcessed: true };
    }
    // A different user owns this draft — this is a genuine conflict
    return { success: false, error: "draft already claimed" };
  }

  const metadata = draftData.metadata as Record<string, any>;
  const templateSlug = metadata._template_id as string;
  const tempImagePathToDelete = metadata._temp_image_path as string | undefined;

  if (!templateSlug) {
    throw new Error("Draft metadata is missing _template_id mapping");
  }

  // Fetch true template UUID for foreign key mapping
  const { data: template, error: tmplErr } = await supabase
    .from("templates")
    .select("id")
    .eq("slug", templateSlug)
    .single();

  if (tmplErr || !template) {
    throw new Error("Template not found in registry");
  }

  // Cross-Bucket File Transfer
  if (tempImagePathToDelete) {
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("temp_drafts")
      .download(tempImagePathToDelete);

    if (downloadError || !fileData) {
      throw new Error("Failed to download temporary draft image");
    }

    const ext = tempImagePathToDelete.split(".").pop() || "jpeg";
    const newPath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("image_steamy_Window")
      .upload(newPath, fileData, {
        contentType: fileData.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to move draft image: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("image_steamy_Window").getPublicUrl(newPath);

    if (!publicUrl) {
      throw new Error("Failed to generate public URL for moved draft image");
    }

    // Map Image URL properly under background_image
    metadata.background_image = publicUrl;
  }

  // Cleanup inner temporary state definitions
  delete metadata._temp_image_path;
  delete metadata._template_id;

  // Cleanup only after successful claim/migration.
  if (tempImagePathToDelete) {
    await adminClient.storage.from("temp_drafts").remove([tempImagePathToDelete]);
  }
  await adminClient.from("drafts").delete().eq("id", draftId);

  return { success: true, metadata: metadata };
}
