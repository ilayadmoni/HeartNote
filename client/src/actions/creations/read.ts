/**
 * Read Server Actions — List & Get Creations
 *
 * - getMyCreations(): Authenticated user's non-deleted creations
 * - getCreation(id): Public endpoint for shared links
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { protectedAction } from "@/lib/protectedAction";
import { ok, fail, ActionError, type ActionResult } from "@/lib/action-response";
import { logger } from "@/lib/utils/logger";
import type { CreationListItem, CreationDetail } from "@/lib/validations";

// ---------------------------------------------------------------------------
// LIST (authenticated)
// ---------------------------------------------------------------------------

/**
 * Returns current user's non-deleted creations with joined template info.
 * RLS enforces user_id ownership.
 */
export async function getMyCreations(): Promise<
  ActionResult<CreationListItem[]>
> {
  return protectedAction(async (user, supabase) => {
    const { data, error } = await supabase
      .from("creations")
      .select(
        "id, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)",
      )
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      throw new ActionError(error.message, 500);
    }

    return (data ?? []).map((c) => {
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
  });
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
): Promise<ActionResult<CreationDetail>> {
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
      return fail("Creation not found", 404);
    }

    if (c.is_deleted) {
      return fail("This creation has been deleted", 410);
    }

    // ── SEC-HIGH-7: Expiry date validation ─────────────────────────
    // Safely parse and compare expiry date against current UTC time.
    // If parsing fails or date is invalid, treat as expired (fail-secure).
    if (c.expires_at) {
      const expStr = String(c.expires_at);
      let expiryDate: Date;

      try {
        // Handle various timestamp formats from Supabase
        // PostgreSQL timestamps can come as:
        // - "2024-12-31T23:59:59.000Z" (ISO with Z)
        // - "2024-12-31T23:59:59+00:00" (ISO with offset)
        // - "2024-12-31 23:59:59" (space-separated, assumes UTC)
        let normalizedStr = expStr;

        // Normalize "+00:00" to "Z" for consistent parsing
        if (normalizedStr.includes("+00:00")) {
          normalizedStr = normalizedStr.replace("+00:00", "Z");
        }

        // Add Z suffix if no timezone indicator present (assume UTC)
        if (!normalizedStr.includes("Z") && !normalizedStr.includes("+") && !normalizedStr.includes("-", 10)) {
          normalizedStr = normalizedStr.replace(" ", "T") + "Z";
        }

        expiryDate = new Date(normalizedStr);

        // Validate the parsed date
        if (isNaN(expiryDate.getTime())) {
          logger.error("[getCreation] Invalid expiry date format", { expStr });
          return fail("This creation has expired", 410);
        }
      } catch (parseError) {
        // If date parsing throws, treat as expired (fail-secure)
        logger.error("[getCreation] Date parsing error", { parseError, expStr });
        return fail("This creation has expired", 410);
      }

      // Compare against current UTC time
      const nowUtc = new Date();
      if (expiryDate.getTime() < nowUtc.getTime()) {
        return fail("This creation has expired", 410);
      }
    }

    const tmpl = (c.templates as unknown as Record<string, string>) ?? {};

    return ok({
      id: c.id as string,
      template_slug: tmpl.slug ?? "",
      template_name: tmpl.name ?? "כרטיס",
      metadata: (c.metadata as Record<string, unknown>) ?? {},
      is_paid: (c.is_paid as boolean) ?? null,
      expires_at: (c.expires_at as string) ?? null,
      created_at: c.created_at as string,
    });
  } catch (e) {
    // SEC-HIGH-6: Never expose internal error details to clients
    logger.error("[getCreation] Internal error", { error: e instanceof Error ? e.message : String(e) });
    return fail("Failed to load creation. Please try again.", 500);
  }
}
