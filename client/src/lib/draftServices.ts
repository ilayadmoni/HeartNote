import { createClient } from "@/lib/supabase/client";

function generateSafeUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function saveGuestDraft(
  templateId: string,
  payload: Record<string, unknown>,
  file?: File | null
): Promise<string> {
  const supabase = createClient();

  let tempImagePath: string | null = null;

  if (file) {
    const fileExt = file.name.split(".").pop() || "jpeg";
    const fileName = `${generateSafeUUID()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("temp_drafts")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Temp image upload failed:", uploadError);
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    tempImagePath = uploadData.path;
  }

  // Insert to drafts table
  // Generate ID explicitly client-side to avoid PostgREST SELECT triggering
  const draftId = generateSafeUUID();

  const finalPayload = {
    ...payload,
    _template_id: templateId,
    ...(tempImagePath ? { _temp_image_path: tempImagePath } : {}),
  };

  const { error: dbError } = await supabase
    .from("drafts")
    .insert({
      id: draftId,
      metadata: finalPayload,
    }); // Absolutely no native .select() allowing for strict Write-Only RLS policies

  if (dbError) {
    console.error("Draft insert failed:", dbError);
    throw new Error(dbError.message || "Failed to insert draft");
  }

  return draftId;
}
