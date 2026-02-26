/**
 * Read Server Actions — List & Get Creations
 *
 * - getMyCreations(): Authenticated user's non-deleted creations
 * - getCreation(id): Public endpoint for shared links
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { CreationListItem, CreationDetail } from "@/lib/validations";

// ---------------------------------------------------------------------------
// LIST (authenticated)
// ---------------------------------------------------------------------------

/**
 * Returns current user's non-deleted creations with joined template info.
 * RLS enforces user_id ownership.
 */
export async function getMyCreations(): Promise<
  { data: CreationListItem[] } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { data, error } = await supabase
      .from("creations")
      .select(
        "id, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)",
      )
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message, status: 500 };
    }

    const items: CreationListItem[] = (data ?? []).map((c) => {
      const tmpl = (c.templates as unknown as Record<string, string>) ?? {};
      return {
        id: c.id as string,
        template_slug: tmpl.slug ?? "",
        template_name: tmpl.name ?? "כרטיס",
        is_paid: (c.is_paid as boolean) ?? null,
        expires_at: (c.expires_at as string) ?? null,
        is_deleted: (c.is_deleted as boolean) ?? false,
        created_at: c.created_at as string,
      };
    });

    return { data: items };
  } catch (e) {
    return {
      error: `Failed to fetch creations: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// GET (public – shared links)
// ---------------------------------------------------------------------------

/**
 * Public endpoint for shared links. Checks is_deleted and expiry.
 * The anon-key RLS policy allows SELECT on non-deleted creations.
 */
export async function getCreation(
  creationId: string,
): Promise<{ data: CreationDetail } | { error: string; status: number }> {
  try {
    const supabase = await createClient();

    const { data: c, error } = await supabase
      .from("creations")
      .select(
        "id, metadata, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)",
      )
      .eq("id", creationId)
      .single();

    if (error || !c) {
      return { error: "Creation not found", status: 404 };
    }

    if (c.is_deleted) {
      return { error: "This creation has been deleted", status: 410 };
    }

    if (c.expires_at) {
      try {
        const expStr = String(c.expires_at);
        const expDt = new Date(
          expStr.includes("Z")
            ? expStr
            : expStr.replace("+00:00", "Z"),
        );
        if (expDt < new Date()) {
          return { error: "This creation has expired", status: 410 };
        }
      } catch {
        // Ignore parse errors
      }
    }

    const tmpl = (c.templates as unknown as Record<string, string>) ?? {};

    return {
      data: {
        id: c.id as string,
        template_slug: tmpl.slug ?? "",
        template_name: tmpl.name ?? "כרטיס",
        metadata: (c.metadata as Record<string, unknown>) ?? {},
        is_paid: (c.is_paid as boolean) ?? null,
        expires_at: (c.expires_at as string) ?? null,
        created_at: c.created_at as string,
      },
    };
  } catch (e) {
    return {
      error: `Failed to fetch creation: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
