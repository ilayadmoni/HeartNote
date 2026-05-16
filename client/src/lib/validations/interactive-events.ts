import { z } from "zod";

const greetingBase = z.object({
  recipientName: z.string().trim().min(1).max(50),
  senderName: z.string().trim().max(50).optional().default(""),
  greetingTitle: z.string().trim().max(70).optional().default(""),
  message: z.string().trim().min(1).max(500),
  signature: z.string().trim().max(70).optional().default(""),
});

const birthdaySchema = z.object({
  recipientName: z.string().trim().min(1).max(50),
  senderName: z.string().trim().max(50).optional().default(""),
  greetingTitle: z.string().trim().max(70).optional().default(""),
  message: z.string().trim().min(1).max(500),
  recipientAge: z.number().int().min(1).max(120),
});

const weddingSchema = z.object({
  coupleNames: z.string().trim().min(1).max(42),
  senderName: z.string().trim().max(36).optional().default(""),
  greetingTitle: z.string().trim().max(48).optional().default(""),
  message: z.string().trim().min(1).max(260),
});

const holidaySlugs = new Set([
  "holiday-rosh-hashanah-interactive",
  "holiday-passover-interactive",
  "holiday-purim-interactive",
  "holiday-shavuot-interactive",
  "holiday-sukkot-interactive",
  "holiday-hanukkah-interactive",
]);

export function validateInteractiveEventMetadata(
  slug: string,
  metadata: Record<string, unknown>,
): string[] {
  const schema =
    slug === "birthday-candles-interactive"
      ? birthdaySchema
      : slug === "wedding-glass-interactive"
        ? weddingSchema
        : holidaySlugs.has(slug)
          ? greetingBase
          : null;

  if (!schema) return [];
  const parsed = schema.safeParse(metadata);
  if (parsed.success) return [];
  return parsed.error.issues.map((issue) => {
    const key = issue.path.join(".") || "metadata";
    return `${key}: ${issue.message}`;
  });
}
