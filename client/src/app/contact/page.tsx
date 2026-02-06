/**
 * Contact Page - צרו קשר
 * Contact form page for HeartNote
 */

import { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "צרו קשר | HeartNote",
  description:
    "צרו איתנו קשר - נשמח לענות על כל שאלה ולעזור לכם ליצור רגעים מרגשים",
};

export default function ContactPage() {
  return <Contact />;
}
