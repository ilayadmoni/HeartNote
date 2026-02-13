/**
 * Privacy Page - מדיניות פרטיות
 * Privacy policy page for HeartNote
 */

import { Metadata } from "next";
import { Privacy } from "@/components/privacy";

export const metadata: Metadata = {
  title: "תנאי שימוש ומדיניות פרטיות | HeartNote",
  description: "תנאי שימוש, מדיניות פרטיות ונגישות באתר HeartNote",
};

export default function PrivacyPage() {
  return <Privacy />;
}
