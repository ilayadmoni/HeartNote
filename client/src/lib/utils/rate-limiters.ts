/** Pre-configured rate limiters — see rate-limiter.ts for the factory. */

import { createRateLimiter } from "./rate-limiter";

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

/**
 * AI text-assist rate limiter: 10 generations per hour per user.
 * Keyed by user id (not IP) — the action requires auth. Bounds LLM spend
 * per account regardless of subscription tier.
 */
export const aiTextLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: "ai_text",
});
