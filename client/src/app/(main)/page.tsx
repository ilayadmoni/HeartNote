import type { Metadata } from "next";

import { Home } from "@/components/home";

export const metadata: Metadata = {
  title: "יצירת ברכות | יצירת ברכות דיגיטליות בקלות | HeartNote",
  description:
    "יצירת ברכות דיגיטליות מרהיבות לכל אירוע בקלות ובחינם. התחילו יצירת ברכות אישיות, מרגשות ומקוריות תוך דקות עם HeartNote.",
};

export default function HomePage() {
  return <Home />;
}
