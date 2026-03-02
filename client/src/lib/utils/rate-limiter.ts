/**
 * In-Memory Rate Limiter
 * ──────────────────────
 * Lightweight sliding-window rate limiter for Next.js Server Actions.
 * Uses a `Map<string, number[]>` keyed by IP address.
 *
 * This is suitable for single-instance deployments. For multi-instance
 * (e.g. Vercel serverless), swap this for a Redis-backed store.
 */

interface RateLimiterOptions {
  /** Maximum number of requests allowed inside the window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
}

const DEFAULT_OPTIONS: RateLimiterOptions = {
  maxRequests: 5,
  windowMs: 60_000, // 1 minute
};

/** Per-limiter stores are isolated so different actions can have different limits */
export function createRateLimiter(opts: Partial<RateLimiterOptions> = {}) {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...opts };
  const store = new Map<string, number[]>();

  /** Periodic cleanup every 5 minutes to prevent unbounded memory growth */
  const CLEANUP_INTERVAL = 5 * 60_000;
  let lastCleanup = Date.now();

  function cleanup(now: number) {
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    store.forEach((timestamps, key) => {
      const valid = timestamps.filter((t: number) => now - t < windowMs);
      if (valid.length === 0) {
        store.delete(key);
      } else {
        store.set(key, valid);
      }
    });
  }

  /**
   * Check whether the given key (typically an IP) is within the rate limit.
   * Returns `true` if the request is ALLOWED, `false` if it should be rejected.
   */
  function check(key: string): boolean {
    const now = Date.now();
    cleanup(now);

    const timestamps = (store.get(key) ?? []).filter(
      (t) => now - t < windowMs,
    );

    if (timestamps.length >= maxRequests) {
      store.set(key, timestamps);
      return false; // rate-limited
    }

    timestamps.push(now);
    store.set(key, timestamps);
    return true; // allowed
  }

  return { check };
}
