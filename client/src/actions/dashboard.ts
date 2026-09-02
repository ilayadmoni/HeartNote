/**
 * Dashboard Server Actions
 *
 * Returns quota stats (from profiles) and creation history (from creations + templates).
 */

"use server";

import { prisma } from "@/lib/prisma";
import { protectedAction } from "@/lib/protectedAction";
import { getActionT } from "@/lib/i18n/server";
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
  return protectedAction(async (user) => {
    const now = Date.now();
    const t = await getActionT("errors");

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        subscriptionTier: true,
        creationsCountFree: true,
        creationsCountPro: true,
        additionalCreationFree: true,
        additionalCreationPro: true,
      },
    });

    const stats: DashboardStats = {
      creations_count_free: profile?.creationsCountFree ?? 0,
      creations_count_pro: profile?.creationsCountPro ?? 0,
      additional_creation_free: profile?.additionalCreationFree ?? 0,
      additional_creation_pro: profile?.additionalCreationPro ?? 0,
      subscription_tier: profile?.subscriptionTier ?? "free",
    };

    const rawCreations = await prisma.creation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { template: { select: { slug: true, name: true } } },
    });

    const creations: DashboardCreation[] = rawCreations.map((c) => ({
      id: c.id,
      template_slug: c.template.slug,
      template_name: c.template.name ?? t("dashboard.cardFallbackName"),
      created_at: c.createdAt.toISOString(),
      expires_at: c.expiresAt ? c.expiresAt.toISOString() : null,
      is_expired: c.expiresAt ? c.expiresAt.getTime() < now : false,
      is_paid: c.isPaid,
      is_deleted: c.isDeleted,
      verification_code: c.verificationCode ?? null,
    }));

    return { stats, creations };
  });
}
