import { z } from "zod";

/**
 * fieldKey is restricted to a fixed allowlist (not a free string) so the
 * server action can't be used to smuggle an arbitrary system-prompt
 * override via templateId/fieldKey — see actions/ai/generateText.ts.
 *
 * maxLength here caps the AI's own output — intentionally 100 for all three
 * (a short greeting), independent of each field's own larger UI limit in
 * editor/configs/*.ts (120/500) which still bounds manual typing.
 */
export const AI_ASSISTABLE_FIELDS = [
  { templateId: "surprise-gift", fieldKey: "greeting", maxLength: 100 },
  { templateId: "birthday-candles-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "scratch-card", fieldKey: "prizeContent", maxLength: 100 },
  { templateId: "wedding-glass-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "holiday-rosh-hashanah-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "holiday-passover-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "holiday-purim-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "holiday-shavuot-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "holiday-sukkot-interactive", fieldKey: "message", maxLength: 100 },
  { templateId: "holiday-hanukkah-interactive", fieldKey: "message", maxLength: 100 },
] as const;

export const GenerateAiTextSchema = z.object({
  templateId: z.enum(
    AI_ASSISTABLE_FIELDS.map((f) => f.templateId) as [string, ...string[]],
  ),
  fieldKey: z.enum(
    AI_ASSISTABLE_FIELDS.map((f) => f.fieldKey) as [string, ...string[]],
  ),
  prompt: z.string().trim().min(1, { message: "errors.ai.promptRequired" }).max(200),
});

export type GenerateAiTextInput = z.infer<typeof GenerateAiTextSchema>;
