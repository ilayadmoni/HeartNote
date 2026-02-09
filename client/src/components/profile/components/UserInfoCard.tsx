"use client";

/**
 * UserInfoCard Component
 * Displays user's basic information: name, email, join date, avatar
 */

import { Calendar, Mail, User } from "lucide-react";
import Image from "next/image";

interface UserInfoCardProps {
  firstName: string;
  lastName: string;
  email: string;
  joinDate: string;
  avatarUrl?: string | null;
}

export function UserInfoCard({
  firstName,
  lastName,
  email,
  joinDate,
  avatarUrl,
}: UserInfoCardProps) {
  const fullName = `${firstName} ${lastName}`.trim() || "משתמש";
  const formattedJoinDate = new Date(joinDate).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header with avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#d4826f] to-[#c4735f] flex items-center justify-center shadow-lg">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-2xl font-bold text-white">
              {firstName.charAt(0) || email.charAt(0).toUpperCase()}
            </span>
          )}
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
