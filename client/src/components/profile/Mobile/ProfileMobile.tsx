"use client";

/**
 * ProfileMobile Component
 * Mobile layout for profile page - single column stack
 */

import { motion } from "framer-motion";
import type { ProfileMobileProps, UserProfile } from "../types";
import {
  UserInfoCard,
  SubscriptionCard,
  TemplateUsageCard,
  TemplatesList,
} from "../components";

interface Props extends ProfileMobileProps {
  profile: UserProfile;
  onRenew: () => void;
  onUpgrade: () => void;
  onViewTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
}

export function ProfileMobile({
  profile,
  onRenew,
  onUpgrade,
  onViewTemplate,
  onDeleteTemplate,
}: Props) {
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
              fullName={profile.fullName}
              email={profile.email}
              joinDate={profile.joinDate}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <TemplateUsageCard
              used={profile.templatesUsed}
              plan={profile.subscription.plan}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SubscriptionCard
              subscription={profile.subscription}
              onRenew={onRenew}
              onUpgrade={onUpgrade}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <TemplatesList
              templates={profile.templates}
              onView={onViewTemplate}
              onDelete={onDeleteTemplate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
