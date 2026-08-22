/**
 * Profile-completeness check used by middleware's onboarding gate.
 *
 * The old Supabase version checked both `user_metadata` AND the `profiles`
 * row (belt-and-suspenders against trigger lag). With Prisma there's a
 * single source of truth — the `profiles` row itself — so this simplifies
 * to just that.
 */

import { prisma } from "@/lib/prisma";

function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export async function computeProfileComplete(userId: string): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, dateOfBirth: true },
  });

  return (
    isNonEmpty(profile?.firstName) &&
    isNonEmpty(profile?.lastName) &&
    profile?.dateOfBirth != null
  );
}
