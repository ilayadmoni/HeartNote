/**
 * Profile Types
 * Type definitions for user profile and subscription data
 */

export type PlanType = "free" | "pro" | "premium";

export interface PlanConfig {
  name: string;
  hebrewName: string;
  maxTemplates: number;
  color: string;
  description: string;
}

export interface SubscriptionInfo {
  plan: PlanType;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface UserTemplate {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  previewUrl?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  joinDate: string;
  subscription: SubscriptionInfo;
  templates: UserTemplate[];
  templatesUsed: number;
}

export interface ProfileProps {
  className?: string;
}

export interface ProfileDesktopProps extends ProfileProps {}
export interface ProfileMobileProps extends ProfileProps {}
