/**
 * Redis-Based Rate Limiter (Vercel/Serverless Ready)
 * ───────────────────────────────────────────────────
 * Uses Upstash Redis for serverless-compatible rate limiting in production.
 * SEC-CRIT-2: In-memory rate limiting is unsafe in serverless/multi-instance
 * production (each instance has its own counter — trivially bypassed), so
 * production still requires real Upstash credentials and throws without them.
 *
 * That check is deferred to first actual use (see resolveLimiter below), not
 * done at import time — importing this module (or rate-limiters.ts) must
 * never crash a page's render on its own; only an actual rate-limited
 * request should ever hit the fatal path.
 *
 * In local development (NODE_ENV !== "production") without Upstash env vars,
 * falls back to a single-process in-memory limiter so `npm run dev` works
 * without any cloud dependency.
 *
 * Setup for production:
 *   1. npm install @upstash/redis @upstash/ratelimit
 *   2. Add to .env:
 *      UPSTASH_REDIS_REST_URL=your-upstash-url
 *      UPSTASH_REDIS_REST_TOKEN=your-upstash-token
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/utils/logger";
import { createInMemoryLimiter } from "./rate-limiter-memory";

export interface RateLimiterOptions {
  /** Maximum number of requests allowed inside the window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Identifier prefix for this limiter (e.g., "password_reset", "contact") */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

const DEFAULT_OPTIONS: RateLimiterOptions = {
  maxRequests: 5,
  windowMs: 60_000,
  prefix: "ratelimit",
};

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redisClient = new Redis({ url, token });
  return redisClient;
}

interface LimiterImpl {
  check(key: string): Promise<RateLimitResult>;
  getRemaining(key: string): Promise<number>;
  reset(key: string): Promise<void>;
}

function resolveLimiter(maxRequests: number, windowMs: number, prefix: string): LimiterImpl {
  const redis = getRedisClient();

  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[rate-limiter] FATAL: Upstash Redis is required in production. " +
          "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables."
      );
    }
    logger.warn(`[rate-limiter] No Upstash credentials — using in-memory limiter for "${prefix}" (dev only)`);
    return createInMemoryLimiter(maxRequests, windowMs, prefix);
  }

  const windowSeconds = Math.ceil(windowMs / 1000);
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix: `${prefix}:`,
    analytics: true,
  });

  return {
    async check(key) {
      try {
        const { success, remaining, reset } = await limiter.limit(key);
        return { success, remaining, reset };
      } catch (err) {
        console.error("[rate-limiter] Upstash Redis error:", err);
        // SEC: Fail CLOSED on Redis errors - deny the request for security
        return { success: false, remaining: 0, reset: Date.now() + windowMs };
      }
    },
    async getRemaining(key) {
      try {
        const { remaining } = await limiter.getRemaining(key);
        return remaining;
      } catch {
        return 0;
      }
    },
    async reset(key) {
      try {
        await redis.del(`${prefix}:${key}`);
      } catch (err) {
        console.error("[rate-limiter] Failed to reset key:", err);
      }
    },
  };
}

/**
 * Create a rate limiter. Backend (Redis vs in-memory) and the
 * production-without-Upstash fatal check are both resolved lazily on first
 * `.check()`/etc call — see the module doc comment for why.
 */
export function createRateLimiter(opts: Partial<RateLimiterOptions> = {}): LimiterImpl {
  const { maxRequests, windowMs, prefix } = { ...DEFAULT_OPTIONS, ...opts };
  let impl: LimiterImpl | null = null;
  const resolve = () => (impl ??= resolveLimiter(maxRequests, windowMs, prefix ?? "ratelimit"));

  return {
    check: (key) => resolve().check(key),
    getRemaining: (key) => resolve().getRemaining(key),
    reset: (key) => resolve().reset(key),
  };
}
