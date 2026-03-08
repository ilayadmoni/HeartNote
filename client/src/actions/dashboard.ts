/**
 * Dashboard Server Actions
 *
 * Port of:
 *   server/app/api/v1/endpoints/dashboard.py
 *
 * Returns quota stats (from profiles) and creation history (from creations + templates).
 *
 * DB columns used:
 *   profiles  → subscription_tier, creations_count_free, creations_count_pro, additional_creation_free, additional_creation_pro
 *   creations → id, is_paid, expires_at, created_at, is_deleted, user_id
 *   templates → slug, name  (joined via creations.template_id)
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import type {
  DashboardResponse,
  DashboardStats,
  DashboardCreation,
} from "@/lib/validations";
import type { ActionResult } from "@/lib/action-response";

/**
 * GET /user/dashboard → getDashboard()
 *
 * User Dashboard — returns quota stats and creation history.
 * Auth check handled by protectedAction wrapper.
 */
export async function getDashboard(): Promise<ActionResult<DashboardResponse>> {
  return protectedAction(async (user, supabase) => {
    const now = new Date();

    // ── Fetch profile for quota stats ──────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "subscription_tier, creations_count_free, creations_count_pro, additional_creation_free, additional_creation_pro",
      )
      .eq("id", user.id)
      .single();

    const profileData = (profile ?? {}) as Record<string, unknown>;

    const stats: DashboardStats = {
      creations_count_free: (profileData.creations_count_free as number) ?? 0,
      creations_count_pro: (profileData.creations_count_pro as number) ?? 0,
      additional_creation_free: (profileData.additional_creation_free as number) ?? 0,
      additional_creation_pro: (profileData.additional_creation_pro as number) ?? 0,
      subscription_tier:
        (profileData.subscription_tier as string) ?? "free",
    };

    // ── Fetch all creations for this user (including soft-deleted) ───
    const { data: rawCreations } = await supabase
      .from("creations")
      .select(
        "id, is_paid, expires_at, created_at, is_deleted, templates!inner(slug, name)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const creations: DashboardCreation[] = (rawCreations ?? []).map((c) => {
      const expiresAtStr = c.expires_at as string | null;
      let isExpired = false;

      if (expiresAtStr) {
        try {
          const expStr = expiresAtStr.includes("Z")
            ? expiresAtStr
            : expiresAtStr.replace("+00:00", "Z");
          isExpired = new Date(expStr) < now;
        } catch {
          isExpired = false;
        }
      }

      const tmpl = (c.templates as unknown as Record<string, string>) ?? {};

      return {
        id: c.id as string,
        template_slug: tmpl.slug ?? "",
        template_name: tmpl.name ?? "כרטיס",
        created_at: c.created_at as string,
        expires_at: expiresAtStr ?? null,
        is_expired: isExpired,
        is_paid: (c.is_paid as boolean) ?? null,
        is_deleted: (c.is_deleted as boolean) ?? false,
      };
    });

    return { stats, creations };
  });
}
