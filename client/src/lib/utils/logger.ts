/**
 * Production-Safe Logger
 * ──────────────────────
 * SEC-HIGH-1: Prevents PII leaks in production logs.
 *
 * - Development: Full console output for debugging
 * - Production: Suppresses info/debug, masks PII in errors
 *
 * Usage:
 *   import { logger } from "@/lib/utils/logger";
 *   logger.info("[auth] User logged in", { userId: user.id });
 *   logger.error("[payment] Failed", { error, email });
 */

const isProduction = process.env.NODE_ENV === "production";

/** Patterns to mask in production error logs */
const PII_PATTERNS: Array<{ regex: RegExp; replacement: string }> = [
  // Email addresses: jo***@example.com
  {
    regex: /([a-zA-Z0-9._%+-]{2})[a-zA-Z0-9._%+-]*(@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
    replacement: "$1***$2",
  },
  // UUIDs: abc12***
  {
    regex: /([a-f0-9]{5})[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    replacement: "$1***-****-****-****-************",
  },
  // IP addresses: 192.168.***.***
  {
    regex: /(\d{1,3}\.\d{1,3}\.)\d{1,3}\.\d{1,3}/g,
    replacement: "$1***.***",
  },
  // Phone numbers (Israeli): 050-***-****
  {
    regex: /(0[5-9]\d)-?\d{3}-?\d{4}/g,
    replacement: "$1-***-****",
  },
];

/**
 * Mask PII in a string or object for safe logging.
 */
function maskPII(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    let masked = data;
    for (const { regex, replacement } of PII_PATTERNS) {
      masked = masked.replace(regex, replacement);
    }
    return masked;
  }

  if (Array.isArray(data)) {
    return data.map(maskPII);
  }

  if (typeof data === "object") {
    const masked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Always mask sensitive field names entirely
      if (/password|token|secret|key|authorization/i.test(key)) {
        masked[key] = "[REDACTED]";
      } else {
        masked[key] = maskPII(value);
      }
    }
    return masked;
  }

  return data;
}

/**
 * Format log arguments for output.
 */
function formatArgs(args: unknown[]): unknown[] {
  if (!isProduction) return args;
  return args.map(maskPII);
}

/**
 * Production-safe logger.
 */
export const logger = {
  /**
   * Debug-level logging (development only).
   */
  debug: (...args: unknown[]): void => {
    if (!isProduction) {
      console.debug(...args);
    }
  },

  /**
   * Info-level logging (development only).
   */
  info: (...args: unknown[]): void => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  /**
   * Warning-level logging (always, but masked in production).
   */
  warn: (...args: unknown[]): void => {
    console.warn(...formatArgs(args));
  },

  /**
   * Error-level logging (always, but masked in production).
   */
  error: (...args: unknown[]): void => {
    console.error(...formatArgs(args));
    
    // TODO: In production, also send to error tracking service
    // if (isProduction && typeof Sentry !== 'undefined') {
    //   Sentry.captureException(args[0]);
    // }
  },
};

export default logger;
