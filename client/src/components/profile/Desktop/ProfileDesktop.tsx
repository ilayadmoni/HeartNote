"use client";

/**
 * ProfileDesktop Component
 * Desktop layout for profile page - two column grid
 * Includes user info, subscription, templates, edit, avatar, and delete account
 */

import { motion } from "framer-motion";
import type { UserProfile, ProfileDesktopProps } from "../types";
import {
  UserInfoCard,
  SubscriptionCard,
  TemplateUsageCard,
  TemplatesList,
  EditProfileCard,
  AvatarSelector,
  DeleteAccountCard,
} from "../components";

interface Props extends ProfileDesktopProps {
  profile: UserProfile;
  avatarOptions: string[];
  onRenew: () => void;
  onUpgrade: () => void;
  onViewTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onEditProfile: (firstName: string, lastName: string) => Promise<void>;
  onAvatarSelect: (avatarUrl: string) => Promise<boolean>;
  onDeleteAccount: () => Promise<void>;
}

export function ProfileDesktop({
  profile,
  avatarOptions,
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
    plan: profile.subscription.plan,
    startDate: profile.createdAt.split("T")[0],
    expiryDate: profile.subscription.expires_at?.split("T")[0],
    isActive: profile.subscription.is_active,
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[#2e3c52] dark:text-white mb-8 text-hebrew-heading"
        >
          הפרופיל שלי
        </motion.h1>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <UserInfoCard
                firstName={profile.firstName || ""}
                lastName={profile.lastName || ""}
                email={profile.email}
                joinDate={profile.createdAt}
                avatarUrl={profile.avatarUrl}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <EditProfileCard
                firstName={profile.firstName || ""}
                lastName={profile.lastName || ""}
                onSave={onEditProfile}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SubscriptionCard
                subscription={subscriptionData}
                onRenew={onRenew}
                onUpgrade={onUpgrade}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TemplateUsageCard used={0} plan={profile.subscription.plan} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <AvatarSelector
                avatarOptions={avatarOptions}
                currentAvatar={profile.avatarUrl}
                onSelect={onAvatarSelect}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TemplatesList
                templates={[]}
                onView={onViewTemplate}
                onDelete={onDeleteTemplate}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <DeleteAccountCard onDelete={onDeleteAccount} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
