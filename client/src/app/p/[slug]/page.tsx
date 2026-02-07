/**
 * Public Page View
 * Displays user-created cards by slug
 */

import { notFound } from "next/navigation";
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

// Fetch page data from API
async function getPage(slug: string): Promise<PageData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${baseUrl}/api/pages/${slug}`, {
      cache: "no-store", // Don't cache - check expiry each time
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
      title: "דף לא נמצא | HeartNote",
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

  if (!page) {
    notFound();
  }

  // Check if page expired (double check on client side)
  if (page.expires_at && new Date(page.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 p-4">
        <div className="text-center">
          <span className="text-6xl mb-4 block">⏰</span>
          <h1 className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            פג תוקף הכרטיס
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
            הכרטיס הזה כבר לא זמין
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserPageClient
      templateKey={page.template_key}
      contentData={page.content_data}
    />
  );
}
