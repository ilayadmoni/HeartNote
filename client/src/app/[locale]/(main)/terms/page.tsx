/**
 * Terms of Use Page - תנאי שימוש
 * Terms of use page for HeartNote
 */

import { Metadata } from "next";
import { Terms } from "@/components/terms";

export const metadata: Metadata = {
  title: "תנאי שימוש | HeartNote",
  description: "תנאי השימוש והתחייבויות באתר HeartNote",
};

export default function TermsPage() {
  return <Terms />;
}
