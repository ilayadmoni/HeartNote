import { headers } from "next/headers";
import type { ZodIssue } from "zod";
import type { getActionT } from "@/lib/i18n/server";
import { translateZodIssue } from "@/lib/validations/i18n";

/** Extract client IP from request headers */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

type T = Awaited<ReturnType<typeof getActionT>>;

/** Map the first Zod issue from RegisterFormSchema to a translated message. */
export async function mapRegistrationZodError(issue: ZodIssue, t: T): Promise<string> {
  const field = String(issue.path[0] ?? "");
  if (field === "email") return t("registration.emailInvalid");
  if (field === "password") return translateZodIssue(issue);
  if (field === "firstName" || field === "lastName") return t("registration.nameRequired");
  return t("registration.fieldsRequired");
}
