/**
 * Returns true when the provided URL is a safe internal path.
 * Allowed examples: /dashboard, /profile?tab=security
 */
export function isInternalUrl(url: string): boolean {
  if (!url) return false;
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  if (url.includes("\\")) return false;
  if (url.includes("://")) return false;
  if (/\r|\n/.test(url)) return false;

  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.origin === "http://localhost" && parsed.pathname.startsWith("/");
  } catch {
    return false;
  }
}