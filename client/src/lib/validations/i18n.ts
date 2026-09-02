/**
 * Bridges Zod issue messages to next-intl translations.
 *
 * Some schemas (shared between client and server, or built once at module
 * load) can't call a translator directly, so their `message` is a message
 * key in `"<namespace>.<key>"` form (e.g. "errors.ai.promptRequired")
 * instead of literal text. This resolves that key through the given
 * translator, falling back to the raw message for schemas that still pass
 * literal English/Hebrew text (e.g. `.email()` built-ins).
 */

import type { ZodIssue } from "zod";
import { getActionT, type MessageNamespace } from "@/lib/i18n/server";

const KEY_PATTERN = /^[a-z]+\.[a-zA-Z0-9.]+$/;

export async function translateZodIssue(issue: ZodIssue): Promise<string> {
  const message = issue.message;
  if (!KEY_PATTERN.test(message)) return message;

  const [namespace, ...rest] = message.split(".");
  const key = rest.join(".");
  try {
    const t = await getActionT(namespace as MessageNamespace);
    return t(key);
  } catch {
    return message;
  }
}
