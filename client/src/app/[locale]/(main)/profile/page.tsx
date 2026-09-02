/**
 * Profile Page (React Server Component)
 *
 * Secure server-side data fetching:
 *  1. Authenticate via auth() (validates the session server-side).
 *  2. Fetch profile + dashboard data directly via Prisma.
 *  3. Handle missing profile row gracefully.
 *  4. Pass pre-fetched data to the interactive <ProfileClient /> component.
 *
 * No API route needed — the server component queries the DB directly.
 */

import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndDowngradeSubscription } from "@/lib/subscription/checkAndDowngradeSubscription";
import { buildProfileResponse } from "@/actions/profile/helpers";
import { ProfileClient } from "@/components/profile/ProfileClient";
import type {
  DashboardResponse,
  DashboardStats,
  DashboardCreation,
} from "@/lib/validations";

function isSubscriptionActive(tier: string, premiumExpiry: Date | null): boolean {
  if (tier === "free") return true;
  if (!premiumExpiry) return true;
  return premiumExpiry > new Date();
}

export default async function ProfilePage() {
  // ── 1. Auth (server-side session validation) ─────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return redirect({ href: "/", locale: await getLocale() });
  }
  const userId = session.user.id;

  // ── 2. Fetch profile ──────────────────────────────────────────────────
  const profileRow = await prisma.profile.findUnique({ where: { id: userId } });

  // Handle missing profile row — trigger the 404 page
  if (!profileRow) {
    notFound();
  }

  const { profile: normalizedProfileRow } = await checkAndDowngradeSubscription({
    id: profileRow.id,
    subscription_tier: profileRow.subscriptionTier,
    premium_start: profileRow.premiumStart?.toISOString() ?? null,
    premium_expiry: profileRow.premiumExpiry?.toISOString() ?? null,
    creations_count_pro: profileRow.creationsCountPro,
  });

  const userTier = normalizedProfileRow.subscription_tier ?? "free";
  const normalizedPremiumExpiry = normalizedProfileRow.premium_expiry
    ? new Date(normalizedProfileRow.premium_expiry)
    : null;

  const profile = await buildProfileResponse({
    ...profileRow,
    subscriptionTier: userTier,
    creationsCountPro: normalizedProfileRow.creations_count_pro ?? 0,
    premiumStart: normalizedProfileRow.premium_start ? new Date(normalizedProfileRow.premium_start) : null,
    premiumExpiry: normalizedPremiumExpiry,
  });

  // ── 3. Fetch subscription policy for the user's tier ─────────────────
  const freePolicyRow = await prisma.subscriptionPolicy.findUnique({ where: { tierCode: "free" } });
  const paidPolicyRow = userTier !== "free"
    ? await prisma.subscriptionPolicy.findUnique({ where: { tierCode: userTier } })
    : null;

  const freeTotalAllowed = freePolicyRow?.creationLimit != null
    ? freePolicyRow.creationLimit + profileRow.additionalCreationFree
    : null;
  const paidTotalAllowed = paidPolicyRow?.creationLimit != null
    ? paidPolicyRow.creationLimit + profileRow.additionalCreationPro
    : null;

  // ── 3b. Fetch creation lifespan from templates.expiration_policy ─────
  const templatePolicyRow = await prisma.template.findFirst({
    where: { isActive: true },
    select: { expirationPolicy: true },
  });

  const expirationPolicy = (templatePolicyRow?.expirationPolicy ?? {}) as {
    free_days?: number;
    paid_days?: number;
  };
  const freeExpiryDays = expirationPolicy.free_days ?? null;
  const paidExpiryDays = expirationPolicy.paid_days ?? null;

  const paidIsActive = isSubscriptionActive(userTier, normalizedPremiumExpiry);

  const subscriptionUsage = {
    free: {
      used: profileRow.creationsCountFree,
      limit: freeTotalAllowed,
      expiryDays: freeExpiryDays,
    },
    paid:
      userTier !== "free" && paidIsActive
        ? {
            tier: userTier as "lite" | "premium",
            used: normalizedProfileRow.creations_count_pro ?? 0,
            limit: paidTotalAllowed,
            startDate: normalizedProfileRow.premium_start ?? null,
            expiryDate: normalizedProfileRow.premium_expiry ?? null,
            expiryDays: paidExpiryDays,
            isActive: paidIsActive,
          }
        : undefined,
  };

  // ── 4. Fetch dashboard data (stats + creations) ──────────────────────
  const stats: DashboardStats = {
    creations_count_free: profileRow.creationsCountFree,
    creations_count_pro: normalizedProfileRow.creations_count_pro ?? 0,
    additional_creation_free: profileRow.additionalCreationFree,
    additional_creation_pro: profileRow.additionalCreationPro,
    subscription_tier: userTier,
  };

  const rawCreations = await prisma.creation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { template: { select: { slug: true, name: true } } },
  });

  const now = Date.now();
  const creations: DashboardCreation[] = rawCreations.map((c) => ({
    id: c.id,
    template_slug: c.template.slug,
    template_name: c.template.name ?? "כרטיס",
    created_at: c.createdAt.toISOString(),
    expires_at: c.expiresAt ? c.expiresAt.toISOString() : null,
    is_expired: c.expiresAt ? c.expiresAt.getTime() < now : false,
    is_paid: c.isPaid,
    is_deleted: c.isDeleted,
    verification_code: c.verificationCode ?? null,
  }));

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
