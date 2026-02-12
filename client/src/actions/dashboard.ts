/**
 * Dashboard Server Actions
 *
 * Port of:
 *   server/app/api/v1/endpoints/dashboard.py
 *
 * Returns quota stats (from profiles) and creation history (from creations + templates).
 *
 * DB columns used:
 *   profiles  → subscription_tier, creations_count, creations_left_free, creations_left_pro
 *   creations → id, is_paid, expires_at, created_at, is_deleted, user_id
 *   templates → slug, name  (joined via creations.template_id)
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  DashboardResponse,
  DashboardStats,
  DashboardCreation,
} from "@/lib/validations";

/**
 * GET /user/dashboard → getDashboard()
 *
 * User Dashboard — returns quota stats and creation history.
 * Exact port of the Python endpoint logic.
 */
export async function getDashboard(): Promise<
  { data: DashboardResponse } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    const now = new Date();

    // ── Fetch profile for quota stats ──────────────────────────────
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select(
        "subscription_tier, creations_count, creations_left_free, creations_left_pro",
      )
      .eq("id", user.id)
      .single();

    const profileData = profile ?? {};

    const stats: DashboardStats = {
      creations_count: (profileData.creations_count as number) ?? 0,
      creations_left_free: (profileData.creations_left_free as number) ?? 3,
      creations_left_pro: (profileData.creations_left_pro as number) ?? null,
      subscription_tier:
        (profileData.subscription_tier as string) ?? "free",
    };

    // ── Fetch all non-deleted creations for this user ──────────────
    const { data: rawCreations, error: crErr } = await supabase
      .from("creations")
      .select(
        "id, is_paid, expires_at, created_at, templates!inner(slug, name)",
      )
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    const allCreations = rawCreations ?? [];

    const creations: DashboardCreation[] = allCreations.map((c) => {
      const expiresAtStr = c.expires_at as string | null;
      let isExpired = false;

      if (expiresAtStr) {
        try {
          const expStr = expiresAtStr.includes("Z")
            ? expiresAtStr
            : expiresAtStr.replace("+00:00", "Z");
          const expDt = new Date(expStr);
          isExpired = expDt < now;
        } catch {
          isExpired = false;
        }
      }

      const tmpl = (c.templates as Record<string, string>) ?? {};

      return {
        id: c.id as string,
        template_slug: tmpl.slug ?? "",
        template_name: tmpl.name ?? "כרטיס",
        created_at: c.created_at as string,
        expires_at: expiresAtStr ?? null,
        is_expired: isExpired,
        is_paid: (c.is_paid as boolean) ?? null,
      };
    });

    return {
      data: { stats, creations },
    };
  } catch (e) {
    return {
      error: `Failed to fetch dashboard: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
