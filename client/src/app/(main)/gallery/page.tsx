/**
 * Gallery Templates Page
 * Browse and select from available HeartNote templates
 */

import { GalleryTemplate } from "@/components/galleryTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeartNote",
  description:
    "בחרו מתוך מגוון תבניות מקוריות ליצירת ברכות דיגיטליות מרגשות לכל אירוע",
};

export default function GalleryPage() {
  return <GalleryTemplate />;
}
