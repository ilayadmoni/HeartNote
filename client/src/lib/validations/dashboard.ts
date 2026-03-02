/**
 * Dashboard Zod Schemas
 *
 * Mirrors the Pydantic models in server/app/api/v1/endpoints/dashboard.py
 * Column names match the `profiles` + `creations` tables in 005_destructive_reset.sql.
 */

import { z } from "zod";

/** Quota usage statistics derived from profiles columns (mirrors DashboardStats). */
export const DashboardStatsSchema = z.object({
  creations_count_free: z.number().int(),
  creations_count_pro: z.number().int(),
  additional_creation_free: z.number().int(),
  additional_creation_pro: z.number().int(),
  subscription_tier: z.string(),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

/** Single creation item in the dashboard list (mirrors DashboardCreation). */
export const DashboardCreationSchema = z.object({
  id: z.string().uuid(),
  template_slug: z.string(),
  template_name: z.string(),
  created_at: z.string(),
  expires_at: z.string().nullable().default(null),
  is_expired: z.boolean(),
  is_paid: z.boolean().nullable().default(null),
  is_deleted: z.boolean().default(false),
});
export type DashboardCreation = z.infer<typeof DashboardCreationSchema>;

/** Full dashboard payload (mirrors DashboardResponse). */
export const DashboardResponseSchema = z.object({
  stats: DashboardStatsSchema,
  creations: z.array(DashboardCreationSchema),
});
export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;
