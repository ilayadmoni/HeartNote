"use server";

/**
 * AI text-assist Server Action — used by the editor's "AI generate" button
 * on a fixed set of textarea fields (see AI_ASSISTABLE_FIELDS).
 *
 * SEC: templateId/fieldKey are validated against an allowlist, not accepted
 * as free strings — this is what the provider is told to write about, so
 * an arbitrary value would be a prompt-injection / cost-abuse vector.
 */

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { validateOrigin } from "@/lib/utils/csrf";
import { aiTextLimiter } from "@/lib/utils/rate-limiters";
import { generateGreetingText, AiGenerationError } from "@/lib/ai/client";
import { GenerateAiTextSchema, AI_ASSISTABLE_FIELDS } from "@/lib/validations/ai";
import { logger } from "@/lib/utils/logger";

export interface GenerateAiTextOutput {
  text: string;
}

const AI_UNAVAILABLE_MESSAGE = "שרת ה-AI אינו זמין כרגע. נסו שוב בעוד כמה רגעים.";

export async function generateAiText(
  input: unknown,
): Promise<ActionResult<GenerateAiTextOutput>> {
  return protectedAction<GenerateAiTextOutput>(async (user) => {
    if (!(await validateOrigin())) {
      throw new ActionError("בקשה לא חוקית. נא לרענן את הדף ולנסות שוב.", 403);
    }

    const parsed = GenerateAiTextSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(parsed.error.issues[0]?.message ?? "קלט לא תקין", 400);
    }
    const { templateId, fieldKey, prompt } = parsed.data;

    const field = AI_ASSISTABLE_FIELDS.find(
      (f) => f.templateId === templateId && f.fieldKey === fieldKey,
    );
    if (!field) {
      throw new ActionError("שדה לא נתמך", 400);
    }

    // Covers both an actual over-quota response and the rate limiter itself
    // being unavailable (e.g. Upstash not configured) — either way the user
    // sees the same "AI server unavailable" message, not raw plumbing.
    let rateLimitResult;
    try {
      rateLimitResult = await aiTextLimiter.check(user.id);
    } catch (err) {
      logger.error("[generateAiText] Rate limiter unavailable", { error: err });
      throw new ActionError(AI_UNAVAILABLE_MESSAGE, 503);
    }
    if (!rateLimitResult.success) {
      throw new ActionError("הגעת למגבלת יצירת הטקסטים לשעה זו. נסה שוב מאוחר יותר.", 429);
    }

    try {
      const text = await generateGreetingText(prompt, field.maxLength);
      return { text };
    } catch (err) {
      if (err instanceof AiGenerationError) {
        logger.error("[generateAiText] AI provider error", { error: err.message });
      } else {
        logger.error("[generateAiText] Unexpected error", { error: err });
      }
      throw new ActionError(AI_UNAVAILABLE_MESSAGE, 502);
    }
  });
}
