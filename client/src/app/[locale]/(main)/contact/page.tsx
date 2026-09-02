/**
 * Contact Page - צרו קשר
 * Contact form page for HeartNote
 */

import { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "יצירת קשר | HeartNote",
  description:
    "צרו איתנו קשר - נשמח לענות על כל שאלה ולעזור לכם במידה ונתקלתם בבעיה. אנחנו כאן בשבילכם",
};

export default function ContactPage() {
  return <Contact />;
}
