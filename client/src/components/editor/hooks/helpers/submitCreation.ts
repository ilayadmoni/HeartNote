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
