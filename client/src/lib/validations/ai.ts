import { z } from "zod";

/**
 * fieldKey is restricted to a fixed allowlist (not a free string) so the
 * server action can't be used to smuggle an arbitrary system-prompt
 * override via templateId/fieldKey — see actions/ai/generateText.ts.
 */
export const AI_ASSISTABLE_FIELDS = [
  // maxLength mirrors each field's own limit in editor/configs/*.ts —
  // surprise-gift.greeting and scratch-card.prizeContent fall back to the
  // shared textarea default (LimitedInput's CHAR_LIMITS.BODY = 120);
  // birthday-candles-interactive.message sets an explicit 500.
  { templateId: "surprise-gift", fieldKey: "greeting", maxLength: 120 },
  { templateId: "birthday-candles-interactive", fieldKey: "message", maxLength: 500 },
  { templateId: "scratch-card", fieldKey: "prizeContent", maxLength: 120 },
] as const;

export const GenerateAiTextSchema = z.object({
  templateId: z.enum(
    AI_ASSISTABLE_FIELDS.map((f) => f.templateId) as [string, ...string[]],
  ),
  fieldKey: z.enum(
    AI_ASSISTABLE_FIELDS.map((f) => f.fieldKey) as [string, ...string[]],
  ),
  prompt: z.string().trim().min(1, "נא לתאר מה לכתוב").max(200),
});

export type GenerateAiTextInput = z.infer<typeof GenerateAiTextSchema>;
