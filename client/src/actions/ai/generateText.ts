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
import { getActionT } from "@/lib/i18n/server";
import { translateZodIssue } from "@/lib/validations/i18n";

export interface GenerateAiTextOutput {
  text: string;
}

export async function generateAiText(
  input: unknown,
): Promise<ActionResult<GenerateAiTextOutput>> {
  return protectedAction<GenerateAiTextOutput>(async (user) => {
    const t = await getActionT("errors");
    const aiUnavailable = t("ai.unavailable");

    if (!(await validateOrigin())) {
      throw new ActionError(t("csrf.invalidRequest"), 403);
    }

    const parsed = GenerateAiTextSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message = issue ? await translateZodIssue(issue) : t("ai.invalidInput");
      throw new ActionError(message, 400);
    }
    const { templateId, fieldKey, prompt } = parsed.data;

    const field = AI_ASSISTABLE_FIELDS.find(
      (f) => f.templateId === templateId && f.fieldKey === fieldKey,
    );
    if (!field) {
      throw new ActionError(t("ai.unsupportedField"), 400);
    }

    // Covers both an actual over-quota response and the rate limiter itself
    // being unavailable (e.g. Upstash not configured) — either way the user
    // sees the same "AI server unavailable" message, not raw plumbing.
    let rateLimitResult;
    try {
      rateLimitResult = await aiTextLimiter.check(user.id);
    } catch (err) {
      logger.error("[generateAiText] Rate limiter unavailable", { error: err });
      throw new ActionError(aiUnavailable, 503);
    }
    if (!rateLimitResult.success) {
      throw new ActionError(t("ai.rateLimited"), 429);
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
      throw new ActionError(aiUnavailable, 502);
    }
  });
}
