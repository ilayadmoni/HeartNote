"use client";

/**
 * ProfileMobile Component
 * Mobile layout for profile page - single column stack
 * Includes user info, subscription, templates, edit, avatar, and delete account.
 * Receives real dashboard data (stats + pages) from the useDashboard hook.
 */

import { motion } from "framer-motion";
import type { UserProfile, ProfileMobileProps } from "../types";
import type { DashboardData } from "@/hooks/useDashboard";
import type { SubscriptionUsage } from "../ProfileClient";
import {
  UserInfoCard,
  SubscriptionCard,
  TemplateUsageCard,
  TemplatesList,
  EditProfileCard,
  AvatarSelector,
  DeleteAccountCard,
} from "../components";

interface Props extends ProfileMobileProps {
  profile: UserProfile;
  avatarOptions: string[];
  dashboard: DashboardData | null;
  subscriptionUsage: SubscriptionUsage;
  onRenew: () => void;
  onUpgrade: () => void;
  onViewTemplate: (slug: string) => void;
  onDeleteTemplate: (slug: string) => void;
  onEditProfile: (firstName: string, lastName: string) => Promise<void>;
  onAvatarSelect: (avatarUrl: string) => Promise<boolean>;
  onDeleteAccount: () => Promise<void>;
}

export function ProfileMobile({
  profile,
  avatarOptions,
  dashboard,
  subscriptionUsage,
  onRenew,
  onUpgrade,
  onViewTemplate,
  onDeleteTemplate,
  onEditProfile,
  onAvatarSelect,
  onDeleteAccount,
}: Props) {
  // Format subscription for the card
  const subscriptionData = {
    tier: profile.subscription.tier,
    startDate: profile.createdAt?.split("T")[0],
    expiryDate: subscriptionUsage.expiryLabel,
    isActive: profile.subscription.is_active,
  };
  const creations = dashboard?.creations ?? [];

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-6 px-4">
      <div className="max-w-md mx-auto">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-6 text-hebrew-heading"
        >
          הפרופיל שלי
        </motion.h1>

        {/* Stacked Cards */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <UserInfoCard
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
              email={profile.email}
              joinDate={profile.createdAt}
              avatarUrl={profile.avatarUrl}
              dateOfBirth={profile.dateOfBirth}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <EditProfileCard
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
              onSave={onEditProfile}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <AvatarSelector
              avatarOptions={avatarOptions}
              currentAvatar={profile.avatarUrl}
              onSelect={onAvatarSelect}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <TemplateUsageCard
              used={subscriptionUsage.used}
              limit={subscriptionUsage.limit}
              tier={profile.subscription.tier}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <SubscriptionCard
              subscription={subscriptionData}
              onRenew={onRenew}
              onUpgrade={onUpgrade}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TemplatesList
              creations={creations}
              onView={onViewTemplate}
              onDelete={onDeleteTemplate}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <DeleteAccountCard onDelete={onDeleteAccount} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
