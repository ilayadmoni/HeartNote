"use client";

/**
 * ProfileMobile Component
 * Mobile layout for profile page - single column stack.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { UserProfile, ProfileMobileProps } from "../types";
import type { DashboardData } from "@/hooks/useDashboard";
import type { SubscriptionUsage } from "../ProfileClient";
import { useProfileViewModel } from "../hooks/useProfileViewModel";
import { fadeUp, stagger } from "@/lib/motion";
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
  isSlideOverOpen: boolean;
  onCloseSlideOver: () => void;
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
  isSlideOverOpen,
  onCloseSlideOver,
}: Props): JSX.Element {
  const t = useTranslations("profile");
  const { isPaidSubscriptionActive, isPaidQuotaFull, freeSubscriptionData, paidSubscriptionData } =
    useProfileViewModel(profile, subscriptionUsage);
  const creations = dashboard?.creations ?? [];

  return (
    <div className="min-h-[100dvh] bg-surface py-6 px-gutter">
      <div className="max-w-md mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-display-sm font-bold text-ink mb-6"
        >
          {t("page.title")}
        </motion.h1>

        <motion.div className="space-y-4" variants={stagger(0.06)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <UserInfoCard
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
              email={profile.email}
              joinDate={profile.createdAt}
              avatarUrl={profile.avatarUrl}
              dateOfBirth={profile.dateOfBirth}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <EditProfileCard
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
              onSave={onEditProfile}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <AvatarSelector avatarOptions={avatarOptions} currentAvatar={profile.avatarUrl} onSelect={onAvatarSelect} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <TemplateUsageCard
              freeUsage={{ tier: "free", used: subscriptionUsage.free.used, limit: subscriptionUsage.free.limit }}
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
          <motion.div variants={fadeUp}>
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
          <motion.div variants={fadeUp}>
            <TemplatesList creations={creations} onView={onViewTemplate} onDelete={onDeleteTemplate} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DeleteAccountCard onDelete={onDeleteAccount} />
          </motion.div>
        </motion.div>
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
