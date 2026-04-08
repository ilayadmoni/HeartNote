import { z } from "zod";

export const UpgradeTierCodeSchema = z.enum(["lite", "premium"]);
export type UpgradeTierCode = z.infer<typeof UpgradeTierCodeSchema>;

export const UpgradeSubscriptionRequestSchema = z.object({
  tierCode: UpgradeTierCodeSchema,
});
export type UpgradeSubscriptionInput = z.infer<
  typeof UpgradeSubscriptionRequestSchema
>;

export const UpgradeSubscriptionResponseSchema = z.object({
  tierCode: UpgradeTierCodeSchema,
  premium_start: z.string(),
  premium_expiry: z.string(),
});
export type UpgradeSubscriptionResponse = z.infer<
  typeof UpgradeSubscriptionResponseSchema
>;
