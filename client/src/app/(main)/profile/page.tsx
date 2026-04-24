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
import { checkAndDowngradeSubscription } from "@/lib/subscription/checkAndDowngradeSubscription";
import { ProfileClient } from "@/components/profile/ProfileClient";
import type {
  ProfileResponse,
  DashboardResponse,
  DashboardStats,
  DashboardCreation,
} from "@/lib/validations";

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
      tier: ((row.subscription_tier as string) ?? "free") as
        | "free"
        | "lite"
        | "premium",
      creations_count_free: (row.creations_count_free as number) ?? 0,
      creations_count_pro: (row.creations_count_pro as number) ?? 0,
      additional_creation_free: (row.additional_creation_free as number) ?? 0,
      additional_creation_pro: (row.additional_creation_pro as number) ?? 0,
      premium_start: (row.premium_start as string) ?? null,
      premium_expiry: (row.premium_expiry as string) ?? null,
      is_active: isSubscriptionActive(row),
      creation_limit: null, // populated separately via subscriptionUsage.limit
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
       created_at, updated_at, subscription_tier, creations_count_free,
       creations_count_pro, additional_creation_free, additional_creation_pro,
       premium_start, premium_expiry`,
    )
    .eq("id", user.id)
    .single();

  // Handle missing profile row — trigger the 404 page
  if (profileError || !profileRow) {
    notFound();
  }

  const { profile: normalizedProfileRow } =
    await checkAndDowngradeSubscription(profileRow as Record<string, unknown> & {
      id: string;
      subscription_tier: string | null;
      premium_start: string | null;
      premium_expiry: string | null;
      creations_count_pro: number;
    });

  const profile: ProfileResponse = buildProfileResponse(normalizedProfileRow);

  // ── 3. Fetch subscription policy for the user's tier ─────────────────
  const userTier = (normalizedProfileRow.subscription_tier as string) ?? "free";

  const { data: freePolicyRow } = await supabase
    .from("subscription_policies")
    .select("tier_code, creation_limit, default_expiry")
    .eq("tier_code", "free")
    .single();

  let paidPolicyRow: Record<string, unknown> | null = null;
  if (userTier !== "free") {
    const { data } = await supabase
      .from("subscription_policies")
      .select("tier_code, creation_limit, default_expiry")
      .eq("tier_code", userTier)
      .single();
    paidPolicyRow = (data as Record<string, unknown>) ?? null;
  }

  const freePolicyLimit: number | null =
    (freePolicyRow?.creation_limit as number) ?? null;
  const additionalFree = (normalizedProfileRow.additional_creation_free as number) ?? 0;
  const freeTotalAllowed =
    freePolicyLimit != null ? freePolicyLimit + additionalFree : null;

  const paidPolicyLimit: number | null =
    paidPolicyRow != null
      ? ((paidPolicyRow.creation_limit as number | null) ?? null)
      : null;
  const additionalPro = (normalizedProfileRow.additional_creation_pro as number) ?? 0;
  const paidTotalAllowed =
    paidPolicyLimit != null ? paidPolicyLimit + additionalPro : null;

  // ── 3b. Fetch creation lifespan from templates.expiration_policy ─────
  const { data: templatePolicyRow } = await supabase
    .from("templates")
    .select("expiration_policy")
    .eq("is_active", true)
    .limit(1)
    .single();

  const expirationPolicy = (templatePolicyRow?.expiration_policy ?? {}) as {
    free_days?: number;
    paid_days?: number;
  };
  const freeExpiryDays = expirationPolicy.free_days ?? null;
  const paidExpiryDays = expirationPolicy.paid_days ?? null;

  const subscriptionUsage = {
    free: {
      used: (normalizedProfileRow.creations_count_free as number) ?? 0,
      limit: freeTotalAllowed,
      expiryDays: freeExpiryDays,
    },
    paid:
      userTier !== "free" && isSubscriptionActive(normalizedProfileRow)
        ? {
            tier: userTier as "lite" | "premium",
            used: (normalizedProfileRow.creations_count_pro as number) ?? 0,
            limit: paidTotalAllowed,
            startDate: (normalizedProfileRow.premium_start as string) ?? null,
            expiryDate: (normalizedProfileRow.premium_expiry as string) ?? null,
            expiryDays: paidExpiryDays,
            isActive: isSubscriptionActive(normalizedProfileRow),
          }
        : undefined,
  };

  // ── 4. Fetch dashboard data (stats + creations) ──────────────────────
  const now = new Date();

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select(
      "subscription_tier, creations_count_free, creations_count_pro, additional_creation_free, additional_creation_pro",
    )
    .eq("id", user.id)
    .single();

  const pd = (rawProfile ?? {}) as Record<string, unknown>;
  const stats: DashboardStats = {
    creations_count_free: (pd.creations_count_free as number) ?? 0,
    creations_count_pro: (pd.creations_count_pro as number) ?? 0,
    additional_creation_free: (pd.additional_creation_free as number) ?? 0,
    additional_creation_pro: (pd.additional_creation_pro as number) ?? 0,
    subscription_tier: (pd.subscription_tier as string) ?? "free",
  };

  const { data: rawCreations } = await supabase
    .from("creations")
    .select(
      "id, is_paid, expires_at, created_at, is_deleted, verification_code, templates!inner(slug, name)",
    )
    .eq("user_id", user.id)
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
      is_deleted: (c.is_deleted as boolean) ?? false,
      verification_code: (c.verification_code as string) ?? null,
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
