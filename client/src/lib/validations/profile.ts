/**
 * Profile Zod Schemas
 *
 * Mirrors the Pydantic models in server/app/schemas/profile.py
 * Column names match the `profiles` table in 005_destructive_reset.sql exactly.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const SubscriptionTierEnum = z.enum(["free", "lite", "premium"]);
export type SubscriptionTier = z.infer<typeof SubscriptionTierEnum>;

/** Netflix-style avatar options (DiceBear Avataaars v9) */
export const AVATAR_OPTIONS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=d1d4f9",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Chase&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Bella&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=c1f0c1",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=f9d1f9",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=b8e0f7",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Riley&backgroundColor=ffc3a0",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Noa&backgroundColor=c4f1be",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sasha&backgroundColor=e8d5b7",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jade&backgroundColor=b5d8eb",
] as const;

// ---------------------------------------------------------------------------
// Nested schemas
// ---------------------------------------------------------------------------

/** Subscription status derived from profiles columns (mirrors SubscriptionInfo). */
export const SubscriptionInfoSchema = z.object({
  tier: SubscriptionTierEnum.default("free"),
  creations_count_free: z.number().int().default(0),
  creations_count_pro: z.number().int().default(0),
  additional_creation_free: z.number().int().default(0),
  additional_creation_pro: z.number().int().default(0),
  premium_start: z.string().datetime({ offset: true }).nullable().default(null),
  premium_expiry: z.string().datetime({ offset: true }).nullable().default(null),
  is_active: z.boolean().default(true),
  creation_limit: z.number().int().nullable().default(null), // from subscription_policies table
});
export type SubscriptionInfo = z.infer<typeof SubscriptionInfoSchema>;

// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------

/** Schema for updating profile. All fields optional (mirrors ProfileUpdate). */
export const ProfileUpdateSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  date_of_birth: z.string().date().optional(), // ISO date string "YYYY-MM-DD"
  avatar_url: z.string().url().optional(),
});
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

// ---------------------------------------------------------------------------
// Response schemas
// ---------------------------------------------------------------------------

/** Full profile response with subscription info (mirrors ProfileResponse). */
export const ProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable().default(null),
  first_name: z.string().nullable().default(null),
  last_name: z.string().nullable().default(null),
  date_of_birth: z.string().nullable().default(null),
  avatar_url: z.string().nullable().default(null),
  created_at: z.string().nullable().default(null),
  updated_at: z.string().nullable().default(null),
  subscription: SubscriptionInfoSchema,
});
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

/** Avatar options response (mirrors AvatarOptionsResponse). */
export const AvatarOptionsResponseSchema = z.object({
  avatars: z.array(z.string().url()),
});
export type AvatarOptionsResponse = z.infer<typeof AvatarOptionsResponseSchema>;
