"use server";

import { prisma } from "@/lib/prisma";

export interface SubscriptionPolicyRow {
  tier_code: string;
  creation_limit: number | null;
  default_expiry: number | null;
}

/** Public — subscription_policies has no sensitive data. */
export async function getSubscriptionPolicies(): Promise<SubscriptionPolicyRow[]> {
  const rows = await prisma.subscriptionPolicy.findMany();
  return rows.map((r) => ({
    tier_code: r.tierCode,
    creation_limit: r.creationLimit,
    default_expiry: r.defaultExpiry,
  }));
}
