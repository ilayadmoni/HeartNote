/**
 * FAQ Page - שאלות נפוצות
 * Frequently asked questions page for HeartNote
 */

import { Metadata } from "next";
import { FAQ } from "@/components/faq";

export const metadata: Metadata = {
  title: "שאלות נפוצות | HeartNote",
  description:
    "תשובות לשאלות הנפוצות ביותר על HeartNote - איך זה עובד?, איך יוצרים ברכה?, מחירים, ועוד",
};

export default function FAQPage() {
  return <FAQ />;
}
