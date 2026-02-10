/**
 * Accessibility Page - הצהרת נגישות
 * Accessibility statement for HeartNote
 */

import { Metadata } from "next";
import { Accessibility } from "@/components/accessibilityPage";

export const metadata: Metadata = {
  title: "הצהרת נגישות | HeartNote",
  description:
    "הצהרת הנגישות של HeartNote - מחויבותנו לנגישות דיגיטלית לכלל המשתמשים",
};

export default function AccessibilityPage() {
  return <Accessibility />;
}
