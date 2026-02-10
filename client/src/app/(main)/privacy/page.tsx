/**
 * Privacy Page - מדיניות פרטיות
 * Privacy policy page for HeartNote
 */

import { Metadata } from "next";
import { Privacy } from "@/components/privacy";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | HeartNote",
  description: "מדיניות הפרטיות של HeartNote - כיצד אנו שומרים על המידע שלכם",
};

export default function PrivacyPage() {
  return <Privacy />;
}
