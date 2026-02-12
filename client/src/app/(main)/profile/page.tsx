/**
 * Profile Page (React Server Component)
 *
 * Secure server-side data fetching:
 *  1. Authenticate via supabase.auth.getUser() (validates JWT server-side).
 *  3. Fetch profile + dashboard data directly from Supabase (RLS-protected).
 *  4. Handle missing profile row gracefully.
 *  5. Pass pre-fetched data to the interactive <ProfileClient /> component.
 *
 * No API route needed — the server component queries Supabase directly.
 */

import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "@/components/profile/ProfileClient";
import type { ProfileResponse, DashboardResponse, DashboardStats, DashboardCreation } from "@/lib/validations";

// ---------------------------------------------------------------------------
// Helpers — DB row → typed response (mirrors actions/profile.ts logic)
// ---------------------------------------------------------------------------

function isSubscriptionActive(row: Record<string, unknown>): boolean {
  const tier = (row.subscription_tier as string) ?? "free";
  if (tier === "free") return true;
  const premiumExpiry = row.premium_expiry;
  if (!premiumExpiry) return true;
  try {
    return new Date(String(premiumExpiry)) > new Date();
  } catch {
    return true;
  }
}

function buildProfileResponse(row: Record<string, unknown>): ProfileResponse {
  return {
    id: row.id as string,
    email: (row.email as string) ?? null,
    first_name: (row.first_name as string) ?? null,
    last_name: (row.last_name as string) ?? null,
    date_of_birth: (row.date_of_birth as string) ?? null,
    avatar_url: (row.avatar_url as string) ?? null,
    created_at: (row.created_at as string) ?? null,
    updated_at: (row.updated_at as string) ?? null,
    subscription: {
      tier: ((row.subscription_tier as string) ?? "free") as "free" | "premium",
      creations_count: (row.creations_count as number) ?? 0,
      creations_left_free: (row.creations_left_free as number) ?? 3,
      creations_left_pro: (row.creations_left_pro as number) ?? null,
      premium_start: (row.premium_start as string) ?? null,
      premium_expiry: (row.premium_expiry as string) ?? null,
      is_active: isSubscriptionActive(row),
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProfilePage() {
  const supabase = await createClient();

  // ── 1. Auth (server-side JWT validation) ─────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/");
  }

  // ── 2. Fetch profile (RLS: only own row) ─────────────────────────────
  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select(
      `id, email, first_name, last_name, date_of_birth, avatar_url,
       created_at, updated_at, subscription_tier, creations_count,
       creations_left_pro, creations_left_free, premium_start, premium_expiry`,
    )
    .eq("id", user.id)
    .single();

  // Handle missing profile row — trigger the 404 page
  if (profileError || !profileRow) {
    notFound();
  }

  const profile: ProfileResponse = buildProfileResponse(profileRow);

  // ── 3. Fetch subscription policy for the user's tier ─────────────────
  const userTier = (profileRow.subscription_tier as string) ?? "free";

  const { data: policyRow } = await supabase
    .from("subscription_policies")
    .select("tier_code, creation_limit, default_expiry")
    .eq("tier_code", userTier)
    .single();

  // Calculate usage: Used = Policy_Limit - Remaining_In_Profile
  const policyLimit: number | null = (policyRow?.creation_limit as number) ?? null;
  const remaining = userTier === "premium"
    ? (profileRow.creations_left_pro as number | null) ?? 0
    : (profileRow.creations_left_free as number) ?? 0;
  const used = policyLimit != null ? Math.max(policyLimit - remaining, 0) : 0;

  const subscriptionUsage = {
    used,
    limit: policyLimit,                        // null = unlimited
    tier: userTier as "free" | "premium",
    expiryLabel: userTier === "free"
      ? "לנצח"
      : profileRow.premium_expiry
        ? new Date(String(profileRow.premium_expiry)).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "—",
  };

  // ── 4. Fetch dashboard data (stats + creations) ──────────────────────
  const now = new Date();

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("subscription_tier, creations_count, creations_left_free, creations_left_pro")
    .eq("id", user.id)
    .single();

  const pd = (rawProfile ?? {}) as Record<string, unknown>;
  const stats: DashboardStats = {
    creations_count: (pd.creations_count as number) ?? 0,
    creations_left_free: (pd.creations_left_free as number) ?? 3,
    creations_left_pro: (pd.creations_left_pro as number) ?? null,
    subscription_tier: (pd.subscription_tier as string) ?? "free",
  };

  const { data: rawCreations } = await supabase
    .from("creations")
    .select("id, is_paid, expires_at, created_at, templates!inner(slug, name)")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  const creations: DashboardCreation[] = (rawCreations ?? []).map((c) => {
    const expiresAt = c.expires_at as string | null;
    let isExpired = false;
    if (expiresAt) {
      try {
        isExpired = new Date(expiresAt) < now;
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
      expires_at: expiresAt ?? null,
      is_expired: isExpired,
      is_paid: (c.is_paid as boolean) ?? null,
    };
  });

  const dashboard: DashboardResponse = { stats, creations };

  // ── 5. Render client component with server data ──────────────────────
  return (
    <ProfileClient
      initialProfile={profile}
      initialDashboard={dashboard}
      subscriptionUsage={subscriptionUsage}
    />
  );
}
