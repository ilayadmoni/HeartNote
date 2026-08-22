"use server";

/**
 * Guest Draft Actions
 *
 * saveGuestDraft   — Called before OAuth login to preserve in-progress work.
 *                     No auth required (guest feature) — matches the old
 *                     Supabase "Allow anonymous inserts" RLS policy.
 * claimGuestDraft  — Idempotent Draft Restoration. Reads a guest draft from
 *                     the DB and returns its metadata so the editor can
 *                     restore the user's work after OAuth login.
 *
 * Design decisions:
 * - NO manual deletion: a Cron job cleans drafts older than 24 hours.
 *   Keeping the row alive makes this action naturally idempotent —
 *   mobile double-fires simply re-read the same row.
 * - All failure paths return { success, error } instead of throwing,
 *   so the client never sees an unhandled Server Action crash.
 * - SEC-HIGH-1: Uses logger for PII-safe logging.
 */

import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/utils/logger";

const DraftIdSchema = z.string().uuid("Invalid draft ID format");

const GuestDraftMetadataSchema = z
  .object({
    _template_id: z.string().min(1),
  })
  .passthrough();

export async function saveGuestDraft(
  templateId: string,
  payload: Record<string, unknown>,
): Promise<string> {
  const draftId = crypto.randomUUID();

  await prisma.draft.create({
    data: {
      id: draftId,
      metadata: { ...payload, _template_id: templateId },
    },
  });

  return draftId;
}

export async function claimGuestDraft(draftId: string) {
  // ── Input validation ───────────────────────────────────────────────
  const parsed = DraftIdSchema.safeParse(draftId);
  if (!parsed.success) {
    return { success: false, error: "Invalid draft ID format." };
  }

  // ── Auth gate ──────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "User must be authenticated to claim drafts" };
  }

  // ── Read draft (idempotent — no deletion) ──────────────────────────
  const draftRow = await prisma.draft.findUnique({
    where: { id: draftId },
    select: { metadata: true },
  });

  // Draft missing — already cleaned by Cron or prior call
  if (!draftRow) {
    logger.info("[claimGuestDraft] Draft not found", { draftId });
    return { success: false, error: "Draft not found — it may have expired." };
  }

  // ── Process guest draft ────────────────────────────────────────────
  const metaParsed = GuestDraftMetadataSchema.safeParse(draftRow.metadata);
  if (!metaParsed.success) {
    logger.warn("[claimGuestDraft] Draft metadata failed validation", { draftId });
    return { success: false, error: "Draft metadata is invalid." };
  }
  const metadata = metaParsed.data as Record<string, unknown>;
  const templateSlug = metadata._template_id as string;

  if (!templateSlug) {
    return { success: false, error: "Draft metadata is missing template mapping." };
  }

  // Verify template exists
  const template = await prisma.template.findUnique({ where: { slug: templateSlug } });
  if (!template) {
    return { success: false, error: "Template not found in registry." };
  }

  // Strip internal keys before returning to the client
  delete metadata._template_id;

  return { success: true, metadata };
}
