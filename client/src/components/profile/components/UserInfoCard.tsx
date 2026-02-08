"use client";

/**
 * UserInfoCard Component
 * Displays user's basic information: name, email, join date
 */

import { Calendar, Mail, User } from "lucide-react";

interface UserInfoCardProps {
  fullName: string;
  email: string;
  joinDate: string;
}

export function UserInfoCard({ fullName, email, joinDate }: UserInfoCardProps) {
  const formattedJoinDate = new Date(joinDate).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header with initials */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4826f] to-[#c4735f] flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">
            {fullName.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
            {fullName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">
            {email}
          </p>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-3">
        <InfoRow icon={<User size={16} />} label="שם מלא" value={fullName} />
        <InfoRow
          icon={<Mail size={16} />}
          label="אימייל"
          value={email}
          dir="ltr"
        />
        <InfoRow
          icon={<Calendar size={16} />}
          label="תאריך הצטרפות"
          value={formattedJoinDate}
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}

function InfoRow({ icon, label, value, dir = "rtl" }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        {icon}
        <span className="text-sm text-hebrew-body">{label}</span>
      </div>
      <span
        className="text-sm font-medium text-[#2e3c52] dark:text-white text-hebrew-body"
        dir={dir}
      >
        {value}
      </span>
    </div>
  );
}
