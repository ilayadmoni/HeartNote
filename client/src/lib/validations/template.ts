/**
 * Template Zod Schemas
 *
 * Mirrors the Pydantic models in server/app/api/v1/endpoints/templates.py
 * Column names match the `templates` table in 005_destructive_reset.sql exactly.
 */

import { z } from "zod";

/** Template response (mirrors TemplateResponse). */
export const TemplateResponseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  category: z.array(z.string()).nullable().default(null),
  tags: z.string().nullable().default(null),
  is_premium: z.boolean().default(false),
  config_schema: z.record(z.string(), z.unknown()).default({}),
  is_active: z.boolean().default(true),
  expiration_policy: z.record(z.string(), z.unknown()).nullable().default(null),
});
export type TemplateResponse = z.infer<typeof TemplateResponseSchema>;
