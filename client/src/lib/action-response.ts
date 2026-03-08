/**
 * Standardised Server Action response types.
 *
 * Every protected Server Action returns `ActionResult<T>`.
 * Inner action code can `throw new ActionError(msg, code)` to
 * signal business-logic failures (404, 422, etc.).
 */

// ── Result type ─────────────────────────────────────────────────────

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string; code: number };

// ── Error class (thrown inside protectedAction callbacks) ────────────

export class ActionError extends Error {
  readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Type-guard: is this an UNAUTHORIZED (401) result? */
export function isUnauthorized(
  result: ActionResult<unknown>,
): result is { success: false; error: string; code: 401 } {
  return !result.success && result.code === 401;
}

/** Shorthand for a successful result. */
export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/** Shorthand for a failure result. */
export function fail(error: string, code: number): ActionResult<never> {
  return { success: false, error, code };
}
