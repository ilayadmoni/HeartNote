/**
 * resolveDefaultData
 * Walks a config's `defaultData` object and swaps message-key strings for
 * translated copy, so a template starts with locale-appropriate sample
 * content instead of hardcoded Hebrew.
 *
 * Convention:
 * - `"defaults.<slug>.<field>"` -> resolved against the `editor` namespace.
 * - `"templates:<key>"` -> resolved against the `templates` namespace
 *   (used by holiday configs, whose copy is owned by that namespace).
 * - Any other string (hex colors, enum values, emoji, ISO dates) is left as-is.
 */

type Translator = (key: string) => string;

interface DefaultDataTranslators {
  editor: Translator;
  templates: Translator;
}

const TEMPLATES_PREFIX = "templates:";

export function resolveDefaultData<T extends Record<string, unknown>>(
  data: T,
  translators: DefaultDataTranslators,
): T {
  return deepResolve(data, translators) as T;
}

function deepResolve(value: unknown, translators: DefaultDataTranslators): unknown {
  if (typeof value === "string") {
    if (value.startsWith(TEMPLATES_PREFIX)) {
      return translators.templates(value.slice(TEMPLATES_PREFIX.length));
    }
    if (value.startsWith("defaults.")) {
      return translators.editor(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepResolve(item, translators));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        deepResolve(item, translators),
      ]),
    );
  }
  return value;
}
