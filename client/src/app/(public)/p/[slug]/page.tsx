/**
 * Public Creation View
 * Displays user-created cards by ID — NO main site header/nav.
 * Fetches directly from Supabase using the server client.
 *
 * Routing: unknown ID → notFound().
 * Expired: custom branded UI.
 * Valid: template + share buttons + footer.
 */

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UserPageClient } from "./client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CreationData {
  id: string;
  template_slug: string;
  template_name: string;
  metadata: Record<string, unknown>;
  is_paid: boolean | null;
  expires_at: string | null;
  created_at: string;
}

// Fetch creation data directly from Supabase (server-side)
async function getCreation(id: string): Promise<CreationData | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("creations")
      .select(
        "id, metadata, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)"
      )
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (error || !data) {
      console.error("Failed to fetch creation:", error?.message);
      return null;
    }

    const tmpl = (data.templates as unknown as { slug: string; name: string }) ?? {};

    return {
      id: data.id as string,
      template_slug: tmpl.slug ?? "",
      template_name: tmpl.name ?? "כרטיס",
      metadata: (data.metadata as Record<string, unknown>) ?? {},
      is_paid: (data.is_paid as boolean) ?? null,
      expires_at: (data.expires_at as string) ?? null,
      created_at: data.created_at as string,
    };
  } catch (error) {
    console.error("Error fetching creation:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const creation = await getCreation(slug);

  if (!creation) {
    return {
      title: "HeartNote",
    };
  }

  return {
    title: `${creation.template_name || "כרטיס"} | HeartNote`,
    description: "כרטיס אינטראקטיבי שנוצר ב-HeartNote",
    openGraph: {
      title: creation.template_name || "כרטיס מיוחד",
      description: "פתחו וגלו את ההפתעה!",
      type: "website",
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  const creation = await getCreation(slug);

  // ── 404 → show not found page ───────────────────────────────────
  if (!creation) {
    notFound();
  }

  // ── Expired → branded UI ─────────────────────────────────────────
  if (creation.expires_at && new Date(creation.expires_at) < new Date()) {
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
      templateKey={creation.template_slug}
      contentData={creation.metadata}
      isPaid={!!creation.is_paid}
      creationId={creation.id}
    />
  );
}
