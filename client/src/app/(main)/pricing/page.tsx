/**
 * Pricing Page - תוכניות ומחירים
 * Plans and pricing page for HeartNote
 */

import { Metadata } from "next";
import { Pricing } from "@/components/pricing";

export const metadata: Metadata = {
  title: "תוכניות ומחירים | HeartNote",
  description:
    "בחרו את התוכנית המתאימה לכם. יש לנו מגוון כרטיסיות פרימיום בתשלום, אבל כמובן שתוכלו להתחיל להתנסות בחינם :)",
};

export default function PricingPage() {
  return <Pricing />;
}
