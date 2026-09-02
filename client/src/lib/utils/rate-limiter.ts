/**
 * In-memory rate limiter factory.
 * HeartNote runs as a single EC2 instance (not serverless/multi-instance),
 * so a single-process counter is sufficient — no external store required.
 */

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

interface LimiterImpl {
  check(key: string): Promise<RateLimitResult>;
  getRemaining(key: string): Promise<number>;
  reset(key: string): Promise<void>;
}

export function createRateLimiter(opts: Partial<RateLimiterOptions> = {}): LimiterImpl {
  const { maxRequests, windowMs, prefix } = { ...DEFAULT_OPTIONS, ...opts };
  return createInMemoryLimiter(maxRequests, windowMs, prefix ?? "ratelimit");
}
