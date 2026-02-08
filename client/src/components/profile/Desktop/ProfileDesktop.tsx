"use client";

/**
 * ProfileDesktop Component
 * Desktop layout for profile page - two column grid
 */

import { motion } from "framer-motion";
import type { ProfileDesktopProps, UserProfile } from "../types";
import {
  UserInfoCard,
  SubscriptionCard,
  TemplateUsageCard,
  TemplatesList,
} from "../components";

interface Props extends ProfileDesktopProps {
  profile: UserProfile;
  onRenew: () => void;
  onUpgrade: () => void;
  onViewTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
}

export function ProfileDesktop({
  profile,
  onRenew,
  onUpgrade,
  onViewTemplate,
  onDeleteTemplate,
}: Props) {
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
                fullName={profile.fullName}
                email={profile.email}
                joinDate={profile.joinDate}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SubscriptionCard
                subscription={profile.subscription}
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
              <TemplateUsageCard
                used={profile.templatesUsed}
                plan={profile.subscription.plan}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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
    </div>
  );
}
