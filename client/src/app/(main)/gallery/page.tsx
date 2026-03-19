/**
 * Gallery Templates Page
 * Browse and select from available HeartNote templates
 */

import { GalleryTemplate } from "@/components/galleryTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeartNote | גלריית ברכות דיגיטליות",
  description:
    "בחרו תבנית מקורית מתוך מגוון התבניות שלנו, עצבו והתאימו אותה,ותשלחו ברכה דיגיטלית מרגשת למי שאתם אוהבים. גלגל החלטות | כרטיס גירוד | הזמנה לדייט | ציר זמן | קופוני אהבה | חידון חברות | ועוד",
};

export default function GalleryPage() {
  return <GalleryTemplate />;
}
