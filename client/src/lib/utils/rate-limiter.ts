/**
 * Redis-Based Rate Limiter (Vercel/Serverless Ready)
 * ───────────────────────────────────────────────────
 * Strictly uses Upstash Redis for serverless-compatible rate limiting.
 * NO in-memory fallback - Redis is REQUIRED for all environments.
 *
 * Setup:
 *   1. npm install @upstash/redis @upstash/ratelimit
 *   2. Add to .env:
 *      UPSTASH_REDIS_REST_URL=your-upstash-url
 *      UPSTASH_REDIS_REST_TOKEN=your-upstash-token
 *
 * SEC-CRIT-2: Eliminates in-memory bypass vulnerability in serverless.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Configuration
// ─────────────────────────────────────────────────────────────────────────────

export interface RateLimiterOptions {
  /** Maximum number of requests allowed inside the window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Identifier prefix for this limiter (e.g., "password_reset", "contact") */
  prefix?: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Number of requests remaining in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the rate limit resets */
  reset: number;
}

const DEFAULT_OPTIONS: RateLimiterOptions = {
  maxRequests: 5,
  windowMs: 60_000, // 1 minute
  prefix: "ratelimit",
};

// ─────────────────────────────────────────────────────────────────────────────
// Redis Client Singleton
// ─────────────────────────────────────────────────────────────────────────────

let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "[rate-limiter] FATAL: Upstash Redis is required. " +
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables."
    );
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiter Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a Redis-backed rate limiter for Vercel/serverless environments.
 * 
 * @example
 * // Password reset: 3 attempts per 15 minutes per IP
 * const resetLimiter = createRateLimiter({
 *   maxRequests: 3,
 *   windowMs: 15 * 60 * 1000,
 *   prefix: "password_reset"
 * });
 * 
 * const result = await resetLimiter.check(clientIp);
 * if (!result.success) {
 *   return { error: "Too many attempts. Try again later." };
 * }
 */
export function createRateLimiter(opts: Partial<RateLimiterOptions> = {}) {
  const { maxRequests, windowMs, prefix } = { ...DEFAULT_OPTIONS, ...opts };
  const windowSeconds = Math.ceil(windowMs / 1000);

  const redis = getRedisClient();

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix: `${prefix}:`,
    analytics: true,
  });

  return {
    /**
     * Check if the request is allowed under the rate limit.
     * 
     * @param key - Unique identifier (IP address, user ID, email, etc.)
     * @returns RateLimitResult with success, remaining, and reset time
     */
    async check(key: string): Promise<RateLimitResult> {
      try {
        const { success, remaining, reset } = await limiter.limit(key);
        return { success, remaining, reset };
      } catch (err) {
        console.error("[rate-limiter] Upstash Redis error:", err);
        // SEC: Fail CLOSED on Redis errors - deny the request for security
        // This prevents bypass when Redis is temporarily unavailable
        return { success: false, remaining: 0, reset: Date.now() + windowMs };
      }
    },

    /**
     * Get remaining requests without consuming a request.
     * Useful for displaying rate limit info to users.
     */
    async getRemaining(key: string): Promise<number> {
      try {
        const { remaining } = await limiter.getRemaining(key);
        return remaining;
      } catch {
        return 0;
      }
    },

    /**
     * Reset the rate limit for a specific key.
     * Use after successful password change or account unlock.
     */
    async reset(key: string): Promise<void> {
      try {
        await redis.del(`${prefix}:${key}`);
      } catch (err) {
        console.error("[rate-limiter] Failed to reset key:", err);
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-configured Rate Limiters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Password reset rate limiter: 3 attempts per 15 minutes per IP
 * Strict limit to prevent brute-force password reset attacks.
 */
export const passwordResetLimiter = createRateLimiter({
  maxRequests: 3,
  windowMs: 15 * 60 * 1000, // 15 minutes
  prefix: "pwd_reset",
});

/**
 * Login rate limiter: 5 attempts per 15 minutes per IP
 * Prevents brute-force login attacks.
 */
export const loginLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  prefix: "login",
});

/**
 * Registration rate limiter: 3 accounts per hour per IP
 * Prevents mass account creation.
 */
export const registrationLimiter = createRateLimiter({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: "register",
});

/**
 * Contact form rate limiter: 5 messages per minute per IP
 * Prevents spam submissions.
 */
export const contactLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  prefix: "contact",
});
