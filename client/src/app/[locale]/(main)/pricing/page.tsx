/**
 * Pricing Page - תוכניות ומחירים
 * Plans and pricing page for HeartNote
 */

import { Metadata } from "next";
import { Pricing } from "@/components/pricing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "תוכניות ומחירים | HeartNote",
  description:
    "בחרו את התוכנית המתאימה לכם. יש לנו מגוון כרטיסיות פרימיום בתשלום, אבל כמובן שתוכלו להתחיל להתנסות בחינם :)",
};

export default async function PricingPage() {
  const upgradesEnabled =
    (process.env.NEXT_PUBLIC_ENABLE_UPGRADES ?? "").toLowerCase() === "true";

  let hasActivePaidSubscription = false;

  const session = await auth();

  if (session?.user?.id) {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true, premiumExpiry: true },
    });

    const tier = profile?.subscriptionTier ?? "free";
    const isActivePaidByExpiry = Boolean(
      profile?.premiumExpiry && profile.premiumExpiry > new Date(),
    );

    hasActivePaidSubscription = tier !== "free" && isActivePaidByExpiry;
  }

  return (
    <Pricing
      upgradesEnabled={upgradesEnabled}
      hasActivePaidSubscription={hasActivePaidSubscription}
    />
  );
}
