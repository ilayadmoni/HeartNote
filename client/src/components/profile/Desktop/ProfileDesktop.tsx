"use client";

/**
 * ProfileDesktop Component
 * Desktop layout for profile page - two column grid
 * Includes user info, subscription, templates, edit, avatar, and delete account.
 * Receives real dashboard data (stats + pages) from the useDashboard hook.
 */

import { motion } from "framer-motion";
import type { UserProfile, ProfileDesktopProps } from "../types";
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
import { UpgradeSlideOver } from "@/components/ui/UpgradeSlideOver";

interface Props extends ProfileDesktopProps {
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
  isSlideOverOpen: boolean;
  onCloseSlideOver: () => void;
}

export function ProfileDesktop({
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
  isSlideOverOpen,
  onCloseSlideOver,
}: Props) {
  const premiumExpiryRaw = profile.subscription.premium_expiry;
  const premiumExpiryDate = premiumExpiryRaw
    ? new Date(premiumExpiryRaw)
    : null;
  const isPaidSubscriptionActive = Boolean(
    premiumExpiryDate &&
    !Number.isNaN(premiumExpiryDate.getTime()) &&
    premiumExpiryDate > new Date(),
  );

  const isPaidQuotaFull = Boolean(
    subscriptionUsage.paid?.isActive &&
    subscriptionUsage.paid.limit !== null &&
    subscriptionUsage.paid.used >= subscriptionUsage.paid.limit,
  );

  /** Format creation lifespan days as a Hebrew duration string */
  const formatExpiryDays = (days: number | null | undefined): string => {
    if (days == null) return "ללא תוקף";
    if (days === 1) return "יום אחד";
    return `${days} ימים`;
  };

  const freeSubscriptionData = {
    tier: "free" as const,
    startDate: profile.createdAt?.split("T")[0],
    expiryDate: formatExpiryDays(subscriptionUsage.free.expiryDays),
    isActive: true,
  };

  const paidSubscriptionData = subscriptionUsage.paid
    ? {
        tier: subscriptionUsage.paid.tier,
        startDate: subscriptionUsage.paid.startDate ?? undefined,
        expiryDate: formatExpiryDays(subscriptionUsage.paid.expiryDays),
        isActive: isPaidSubscriptionActive,
      }
    : undefined;

  const creations = dashboard?.creations ?? [];

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
                dateOfBirth={profile.dateOfBirth}
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
                freeSubscription={freeSubscriptionData}
                paidSubscription={paidSubscriptionData}
                onRenew={onRenew}
                onUpgrade={onUpgrade}
                freeCreationLimit={subscriptionUsage.free.limit}
                paidCreationLimit={subscriptionUsage.paid?.limit}
                isPaidQuotaFull={isPaidQuotaFull}
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
              <TemplateUsageCard
                freeUsage={{
                  tier: "free",
                  used: subscriptionUsage.free.used,
                  limit: subscriptionUsage.free.limit,
                }}
                paidUsage={
                  subscriptionUsage.paid && isPaidSubscriptionActive
                    ? {
                        tier: subscriptionUsage.paid.tier,
                        used: subscriptionUsage.paid.used,
                        limit: subscriptionUsage.paid.limit,
                      }
                    : undefined
                }
              />
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
                creations={creations}
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

      <UpgradeSlideOver
        isOpen={isSlideOverOpen}
        onClose={onCloseSlideOver}
        tier={subscriptionUsage.paid?.tier ?? "lite"}
        creationLimit={subscriptionUsage.paid?.limit ?? 0}
        expiryDate={subscriptionUsage.paid?.expiryDate ?? null}
      />
    </div>
  );
}
