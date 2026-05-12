import { submitGenericCreation } from "@/actions/creations";

export async function buildCreationFormData(
  templateSlug: string,
  submissionData: Record<string, unknown>,
  quotaPreference: "free" | "pro",
): Promise<FormData> {
  const formData = new FormData();
  formData.append("templateSlug", templateSlug);
  formData.append("metadata", JSON.stringify(submissionData));
  formData.append("quotaPreference", quotaPreference);

  const blobUrl = Object.values(submissionData).find(
    (v) => typeof v === "string" && v.startsWith("blob:"),
  ) as string | undefined;
  if (blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const ext = blob.type.split("/")[1] || "jpeg";
    formData.append(
      "file",
      new File([blob], `upload.${ext}`, { type: blob.type || "image/jpeg" }),
    );
    formData.append("bucketName", "image_steamy_Window");
  }
  return formData;
}

export async function runCreationSubmission(
  templateSlug: string,
  submissionData: Record<string, unknown>,
  quotaPreference: "free" | "pro",
) {
  const formData = await buildCreationFormData(
    templateSlug,
    submissionData,
    quotaPreference,
  );
  return submitGenericCreation(formData);
}
