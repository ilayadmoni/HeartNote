/**
 * Pricing Page - תוכניות ומחירים
 * Plans and pricing page for HeartNote
 */

import { Metadata } from "next";
import { Pricing } from "@/components/pricing";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "תוכניות ומחירים | HeartNote",
  description:
    "בחרו את התוכנית המתאימה לכם. יש לנו מגוון כרטיסיות פרימיום בתשלום, אבל כמובן שתוכלו להתחיל להתנסות בחינם :)",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const upgradesEnabled =
    (process.env.NEXT_PUBLIC_ENABLE_UPGRADES ?? "").toLowerCase() === "true";

  let hasActivePaidSubscription = false;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, premium_expiry")
      .eq("id", user.id)
      .single();

    const tier = String(profile?.subscription_tier ?? "free");
    const expiryRaw = profile?.premium_expiry as string | null | undefined;
    const expiryDate = expiryRaw ? new Date(expiryRaw) : null;
    const isActivePaidByExpiry = Boolean(
      expiryDate && !Number.isNaN(expiryDate.getTime()) && expiryDate > new Date(),
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
