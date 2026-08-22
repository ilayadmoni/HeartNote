/**
 * Read Server Actions — List & Get Creations
 *
 * - getMyCreations(): Authenticated user's non-deleted creations
 * - getCreation(id): Public endpoint for shared links
 */

"use server";

import { prisma } from "@/lib/prisma";
import { protectedAction } from "@/lib/protectedAction";
import { ok, fail, type ActionResult } from "@/lib/action-response";
import { logger } from "@/lib/utils/logger";
import type { CreationListItem, CreationDetail } from "@/lib/validations";

// ---------------------------------------------------------------------------
// LIST (authenticated)
// ---------------------------------------------------------------------------

/**
 * Returns current user's non-deleted creations with joined template info.
 */
export async function getMyCreations(): Promise<
  ActionResult<CreationListItem[]>
> {
  return protectedAction(async (user) => {
    const creations = await prisma.creation.findMany({
      where: { userId: user.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: { template: { select: { slug: true, name: true } } },
    });

    return creations.map((c) => ({
      id: c.id,
      template_slug: c.template.slug,
      template_name: c.template.name ?? "כרטיס",
      is_paid: c.isPaid,
      expires_at: c.expiresAt ? c.expiresAt.toISOString() : null,
      is_deleted: c.isDeleted,
      created_at: c.createdAt.toISOString(),
    }));
  });
}

// ---------------------------------------------------------------------------
// GET (public – shared links)
// ---------------------------------------------------------------------------

/**
 * Public endpoint for shared links. Checks is_deleted and expiry.
 */
export async function getCreation(
  creationId: string,
): Promise<ActionResult<CreationDetail>> {
  try {
    const c = await prisma.creation.findUnique({
      where: { id: creationId },
      include: { template: { select: { slug: true, name: true } } },
    });

    if (!c) {
      return fail("Creation not found", 404);
    }

    if (c.isDeleted) {
      return fail("This creation has been deleted", 410);
    }

    // ── SEC-HIGH-7: Expiry check (expiresAt is a real Date from Prisma —
    //    no manual timestamp-format parsing needed here anymore). ────────
    if (c.expiresAt && c.expiresAt.getTime() < Date.now()) {
      return fail("This creation has expired", 410);
    }

    return ok({
      id: c.id,
      template_slug: c.template.slug,
      template_name: c.template.name ?? "כרטיס",
      metadata: (c.metadata as Record<string, unknown>) ?? {},
      is_paid: c.isPaid,
      expires_at: c.expiresAt ? c.expiresAt.toISOString() : null,
      created_at: c.createdAt.toISOString(),
    });
  } catch (e) {
    // SEC-HIGH-6: Never expose internal error details to clients
    logger.error("[getCreation] Internal error", { error: e instanceof Error ? e.message : String(e) });
    return fail("Failed to load creation. Please try again.", 500);
  }
}
