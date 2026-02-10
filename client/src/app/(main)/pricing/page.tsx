/**
 * Pricing Page - תוכניות ומחירים
 * Plans and pricing page for HeartNote
 */

import { Metadata } from "next";
import { Pricing } from "@/components/pricing";

export const metadata: Metadata = {
  title: "תוכניות ומחירים | HeartNote",
  description: "בחרו את התוכנית המתאימה לכם. תוכניות גמישות לכל צורך.",
};

export default function PricingPage() {
  return <Pricing />;
}
