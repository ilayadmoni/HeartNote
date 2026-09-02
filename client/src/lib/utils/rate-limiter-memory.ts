/**
 * In-memory rate limiter. Single-process counter — fine for HeartNote's
 * single-EC2-instance deployment, not safe if ever run multi-instance.
 */

import type { RateLimitResult } from "./rate-limiter";

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryEntry>();

export function createInMemoryLimiter(maxRequests: number, windowMs: number, prefix: string) {
  return {
    async check(key: string): Promise<RateLimitResult> {
      const storeKey = `${prefix}:${key}`;
      const now = Date.now();
      const entry = memoryStore.get(storeKey);

      if (!entry || entry.resetAt <= now) {
        memoryStore.set(storeKey, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1, reset: now + windowMs };
      }
      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0, reset: entry.resetAt };
      }
      entry.count += 1;
      return { success: true, remaining: maxRequests - entry.count, reset: entry.resetAt };
    },
    async getRemaining(key: string): Promise<number> {
      const entry = memoryStore.get(`${prefix}:${key}`);
      if (!entry || entry.resetAt <= Date.now()) return maxRequests;
      return Math.max(0, maxRequests - entry.count);
    },
    async reset(key: string): Promise<void> {
      memoryStore.delete(`${prefix}:${key}`);
    },
  };
}
