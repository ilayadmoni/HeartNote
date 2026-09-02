"use client";

/**
 * ProfileDesktop Component
 * Desktop layout for profile page - two column grid.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { UserProfile, ProfileDesktopProps } from "../types";
import type { DashboardData } from "@/hooks/useDashboard";
import type { SubscriptionUsage } from "../ProfileClient";
import { useProfileViewModel } from "../hooks/useProfileViewModel";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
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
}: Props): JSX.Element {
  const t = useTranslations("profile");
  const { isPaidSubscriptionActive, isPaidQuotaFull, freeSubscriptionData, paidSubscriptionData } =
    useProfileViewModel(profile, subscriptionUsage);
  const creations = dashboard?.creations ?? [];

  return (
    <div className="min-h-[100dvh] bg-surface py-10 px-gutter">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-display-md font-bold text-ink mb-8"
        >
          {t("page.title")}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="space-y-6">
            <UserInfoCard
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
              email={profile.email}
              joinDate={profile.createdAt}
              avatarUrl={profile.avatarUrl}
              dateOfBirth={profile.dateOfBirth}
            />
            <EditProfileCard
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
              onSave={onEditProfile}
            />
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

          <motion.div variants={fadeUp} className="space-y-6">
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
            <AvatarSelector avatarOptions={avatarOptions} currentAvatar={profile.avatarUrl} onSelect={onAvatarSelect} />
            <TemplatesList creations={creations} onView={onViewTemplate} onDelete={onDeleteTemplate} />
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
