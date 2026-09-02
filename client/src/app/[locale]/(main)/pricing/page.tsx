/**
 * Pricing Page
 * Plans and pricing page for HeartNote
 */

import type { Metadata } from "next";
import { Pricing } from "@/components/pricing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

interface PricingPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/pricing", key: "pricing" });
}

export default async function PricingPage(): Promise<JSX.Element> {
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
