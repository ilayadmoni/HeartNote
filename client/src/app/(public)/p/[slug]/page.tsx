/**
 * Public Page View
 * Displays user-created cards by slug — NO main site header/nav.
 * Fetches from FastAPI /api/v1/pages/{slug} (public endpoint).
 *
 * Routing: unknown slug → redirect('/').
 * Expired: custom branded UI.
 * Valid: template + share buttons + footer.
 */

import { redirect } from "next/navigation";
import { Metadata } from "next";
import { UserPageClient } from "./client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PageData {
  id: string;
  slug: string;
  template_key: string;
  template_title: string;
  content_data: Record<string, unknown>;
  expires_at: string | null;
  created_at: string;
}

// Fetch page data from FastAPI (server-side)
async function getPage(slug: string): Promise<PageData | null> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

  try {
    const response = await fetch(`${baseUrl}/api/v1/pages/${slug}`, {
      cache: "no-store",
    });

    if (response.status === 404 || response.status === 410) {
      return null;
    }

    if (!response.ok) {
      console.error("Failed to fetch page:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return {
      title: "HeartNote - מפעל הברכות הדיגיטלי",
    };
  }

  return {
    title: `${page.template_title || "כרטיס"} | HeartNote`,
    description: "כרטיס אינטראקטיבי שנוצר ב-HeartNote",
    openGraph: {
      title: page.template_title || "כרטיס מיוחד",
      description: "פתחו וגלו את ההפתעה!",
      type: "website",
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);

  // ── 404 → redirect home ──────────────────────────────────────────
  if (!page) {
    redirect("/");
  }

  // ── Expired → branded UI ─────────────────────────────────────────
  if (page.expires_at && new Date(page.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf7f5] to-[#f0ebe5] dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span className="text-5xl">⏰</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-3"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            פג תוקף הכרטיס
          </h1>
          <p
            className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            הכרטיס הזה כבר לא זמין. בקשו מהשולח לשלוח כרטיס חדש!
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-xl transition-colors font-bold"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            צרו כרטיס משלכם
          </a>
        </div>
      </div>
    );
  }

  // ── Render Template + Share + Footer ──────────────────────────────
  return (
    <UserPageClient
      templateKey={page.template_key}
      contentData={page.content_data}
    />
  );
}
