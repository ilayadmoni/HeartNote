/**
 * Optional Examples: Using Template Usage Stats in Your UI
 * 
 * These are example implementations showing how to display and use
 * the template usage data. You can adapt these to your needs.
 */

// =============================================================================
// 1. SERVER ACTION - Get Popular Templates
// =============================================================================
// File: client/src/actions/templates.ts

import { createClient } from "@/lib/supabase/server";

/**
 * GET /templates/popular → getPopularTemplates(limit)
 * 
 * Returns the most-used templates sorted by usage count.
 * Useful for "Most Popular" section or recommendations.
 */
export async function getPopularTemplates(limit = 5): Promise<
  | { data: Array<{ id: string; name: string; slug: string; uses: number }> }
  | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("templates")
      .select("id, name, slug, uses")
      .eq("is_active", true)
      .order("uses", { ascending: false })
      .limit(limit);

    if (error) {
      return { error: error.message, status: 500 };
    }

    return {
      data: data || [],
    };
  } catch (e) {
    return {
      error: `Failed to fetch popular templates: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/**
 * GET /templates/:id/stats → getTemplateStats(templateId)
 * 
 * Returns detailed stats for a specific template.
 */
export async function getTemplateStats(templateId: string): Promise<
  | {
      data: {
        uses: number;
        percentageOfMax?: number;
        popularity: "low" | "medium" | "high" | "trending";
      };
    }
  | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    // Get the template's uses and max uses across all templates
    const { data: template, error: tmplErr } = await supabase
      .from("templates")
      .select("uses")
      .eq("id", templateId)
      .eq("is_active", true)
      .single();

    if (tmplErr || !template) {
      return { error: "Template not found", status: 404 };
    }

    const { data: stats, error: statsErr } = await supabase
      .from("templates")
      .select("uses")
      .eq("is_active", true);

    if (statsErr || !stats) {
      return { error: "Failed to calculate stats", status: 500 };
    }

    const maxUses = Math.max(...(stats.map((t) => (t as Record<string, number>).uses) || [0]));
    const percentageOfMax = maxUses > 0 ? (template.uses / maxUses) * 100 : 0;

    // Categorize popularity
    let popularity: "low" | "medium" | "high" | "trending" = "low";
    if (percentageOfMax > 80) {
      popularity = "trending";
    } else if (percentageOfMax > 60) {
      popularity = "high";
    } else if (percentageOfMax > 30) {
      popularity = "medium";
    }

    return {
      data: {
        uses: template.uses,
        percentageOfMax: Math.round(percentageOfMax),
        popularity,
      },
    };
  } catch (e) {
    return {
      error: `Failed to fetch template stats: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// =============================================================================
// 2. REACT HOOK - Use Popular Templates Query
// =============================================================================
// File: client/src/hooks/usePopularTemplates.ts

"use client";

import { useState, useEffect } from "react";
import { getPopularTemplates } from "@/actions/templates";

export interface PopularTemplate {
  id: string;
  name: string;
  slug: string;
  uses: number;
}

export interface UsePopularTemplatesReturn {
  templates: PopularTemplate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePopularTemplates(
  limit = 5
): UsePopularTemplatesReturn {
  const [templates, setTemplates] = useState<PopularTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPopularTemplates(limit);

      if ("error" in result) {
        setError(result.error);
      } else {
        setTemplates(result.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching popular templates:", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularTemplates();
  }, [limit]);

  return {
    templates,
    loading,
    error,
    refetch: fetchPopularTemplates,
  };
}

// =============================================================================
// 3. REACT COMPONENT - Popular Templates Section
// =============================================================================
// File: client/src/components/home/PopularTemplatesSection.tsx

"use client";

import { usePopularTemplates } from "@/hooks/usePopularTemplates";
import { Flame, Loader } from "lucide-react";
import Link from "next/link";

export function PopularTemplatesSection() {
  const { templates, loading, error } = usePopularTemplates(5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error || templates.length === 0) {
    return null; // Hide section if no popular templates
  }

  return (
    <section className="py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="text-orange-500" size={20} />
          <h2 className="text-2xl font-bold">הטמפלטים הפופולריים ביותר</h2>
        </div>
        <p className="text-gray-600">אלו הטמפלטים שמשתמשים אחרים אוהבים</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Link
            key={template.id}
            href={`/create/${template.slug}`}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg flex-1">{template.name}</h3>
              <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium whitespace-nowrap">
                {template.uses} שימושים
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              נבחר ע"י {template.uses.toLocaleString()} משתמשים
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// 4. REACT COMPONENT - Template Popularity Badge
// =============================================================================
// File: client/src/components/templates/PopularityBadge.tsx

"use client";

import { Flame, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getTemplateStats } from "@/actions/templates";

interface PopularityBadgeProps {
  templateId: string;
  compact?: boolean;
}

export function PopularityBadge({
  templateId,
  compact = false,
}: PopularityBadgeProps) {
  const [stats, setStats] = useState<{
    uses: number;
    popularity: "low" | "medium" | "high" | "trending";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplateStats(templateId).then((result) => {
      if ("data" in result) {
        setStats(result.data);
      }
      setLoading(false);
    });
  }, [templateId]);

  if (loading || !stats) return null;

  const badgeStyles = {
    trending: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    low: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const badgeLabels = {
    trending: "Trending 🔥",
    high: "פופולרי",
    medium: "בינוני",
    low: "חדש",
  };

  if (compact) {
    return (
      <span className={`text-xs px-2 py-1 rounded border ${badgeStyles[stats.popularity]}`}>
        {stats.uses > 0 && (
          <>
            <Flame className="inline mr-1" size={12} />
            {stats.uses}
          </>
        )}
      </span>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${badgeStyles[stats.popularity]}`}>
      <div className="flex items-center gap-2 mb-1">
        {stats.popularity === "trending" && (
          <TrendingUp size={16} className="text-red-600" />
        )}
        {stats.popularity !== "trending" && (
          <Flame size={16} className="text-orange-500" />
        )}
        <span className="font-semibold">{badgeLabels[stats.popularity]}</span>
      </div>
      <p className="text-sm opacity-75">
        {stats.uses} משתמשים בחרו בטמפלט זה
      </p>
    </div>
  );
}

// =============================================================================
// 5. UPDATED HOOK - Include Uses in Active Templates
// =============================================================================
// File: client/src/hooks/useActiveTemplates.ts (UPDATED)

// Add this to your existing useActiveTemplates.ts:

export interface SupabaseTemplateRow {
  slug: string;
  category: string[] | null;
  is_premium: boolean;
  is_active: boolean;
  uses: number; // ADD THIS LINE
}

export interface TemplateMetadata {
  slug: string;
  categories: string[];
  isPremium: boolean;
  uses: number; // ADD THIS LINE
}

// In your fetchActiveTemplates function, update the select:
const { data, error: fetchError } = await supabase
  .from("templates")
  .select("slug, category, is_premium, is_active, uses") // Add uses
  .eq("is_active", true);

// In the mapping, add uses:
const dbMetadata: TemplateMetadata[] = (data || [])
  .map((row: SupabaseTemplateRow) => ({
    slug: row.slug,
    categories: row.category || [],
    isPremium: row.is_premium,
    uses: row.uses, // ADD THIS LINE
  }));

// =============================================================================
// 6. USAGE EXAMPLES
// =============================================================================

/*
Example 1: Display popular templates section on homepage
────────────────────────────────────────────────────────

// In client/src/app/(main)/page.tsx

import { PopularTemplatesSection } from "@/components/home/PopularTemplatesSection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <PopularTemplatesSection />
      <SomeOtherSection />
    </div>
  );
}

───────────────────────────────────────────────────────────

Example 2: Show popularity badge on template card
────────────────────────────────────────────────────

// In your template gallery component

import { PopularityBadge } from "@/components/templates/PopularityBadge";

function TemplateCard({ template }) {
  return (
    <div className="card">
      <h3>{template.name}</h3>
      <PopularityBadge templateId={template.id} compact={true} />
    </div>
  );
}

───────────────────────────────────────────────────────────

Example 3: Sort templates by popularity
────────────────────────────────────────────────────────

const { enrichedTemplates } = useActiveTemplates(TEMPLATES);
const sorted = enrichedTemplates.sort((a, b) => (b.uses || 0) - (a.uses || 0));

───────────────────────────────────────────────────────────

Example 4: React Query integration (Optional)
────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { getPopularTemplates } from "@/actions/templates";

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["popular-templates"],
    queryFn: () => getPopularTemplates(5),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.data.map((t) => (
        <div key={t.id}>{t.name} - {t.uses} uses</div>
      ))}
    </div>
  );
}
*/
