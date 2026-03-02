/**
 * Creation Zod Schemas
 *
 * Mirrors the Pydantic models in server/app/api/v1/endpoints/creations.py
 * Column names match the `creations` table in 005_destructive_reset.sql exactly.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------

/** Request to create a new creation (mirrors CreateCreationRequest). */
export const CreateCreationRequestSchema = z.object({
  template_id: z.string().uuid(),
  metadata: z.record(z.string(), z.unknown()),
});
export type CreateCreationInput = z.infer<typeof CreateCreationRequestSchema>;

// ---------------------------------------------------------------------------
// Response schemas
// ---------------------------------------------------------------------------

/** Response after creating a creation (mirrors CreateCreationResponse). */
export const CreateCreationResponseSchema = z.object({
  id: z.string().uuid(),
  expires_at: z.string().nullable().default(null),
});
export type CreateCreationResponse = z.infer<typeof CreateCreationResponseSchema>;

/** Creation item for listing (mirrors CreationListItem). */
export const CreationListItemSchema = z.object({
  id: z.string().uuid(),
  template_slug: z.string(),
  template_name: z.string(),
  is_paid: z.boolean().nullable().default(null),
  expires_at: z.string().nullable().default(null),
  is_deleted: z.boolean().default(false),
  created_at: z.string(),
});
export type CreationListItem = z.infer<typeof CreationListItemSchema>;

/** Public creation detail (mirrors CreationDetailResponse). */
export const CreationDetailSchema = z.object({
  id: z.string().uuid(),
  template_slug: z.string(),
  template_name: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  is_paid: z.boolean().nullable().default(null),
  expires_at: z.string().nullable().default(null),
  created_at: z.string(),
});
export type CreationDetail = z.infer<typeof CreationDetailSchema>;
