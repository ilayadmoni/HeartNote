"use client";

/**
 * UserInfoCard Component
 * Displays user's basic information: name, email, join date, avatar
 */

import { Calendar, Mail, User, Cake } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

interface UserInfoCardProps {
  firstName: string;
  lastName: string;
  email: string | null;
  joinDate: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
}

export function UserInfoCard({
  firstName,
  lastName,
  email,
  joinDate,
  avatarUrl,
  dateOfBirth,
}: UserInfoCardProps): JSX.Element {
  const t = useTranslations("profile");
  const format = useFormatter();
  const fullName = `${firstName} ${lastName}`.trim() || t("userInfo.nameFallback");
  const formattedJoinDate = joinDate ? format.dateTime(new Date(joinDate), { dateStyle: "medium" }) : "-";

  return (
    <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-accent flex items-center justify-center shadow-card">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={fullName} fill className="object-cover" unoptimized />
          ) : (
            <span className="text-title-md font-bold text-accent-ink">
              {firstName.charAt(0) || (email ?? "").charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-title-md font-bold text-ink">{fullName}</h2>
          <p className="text-body-sm text-ink-muted" dir="ltr">
            {email}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <InfoRow icon={<User size={16} />} label={t("userInfo.fullName")} value={fullName} />
        <InfoRow icon={<Mail size={16} />} label={t("userInfo.email")} value={email ?? "-"} dir="ltr" />
        <InfoRow icon={<Calendar size={16} />} label={t("userInfo.joinDate")} value={formattedJoinDate} />
        {dateOfBirth && (
          <InfoRow
            icon={<Cake size={16} />}
            label={t("userInfo.dateOfBirth")}
            value={format.dateTime(new Date(dateOfBirth), { dateStyle: "medium" })}
          />
        )}
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

function InfoRow({ icon, label, value, dir }: InfoRowProps): JSX.Element {
  return (
    <div className="flex items-center justify-between py-2 border-b border-line last:border-0">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <span className="text-body-sm">{label}</span>
      </div>
      <span className="text-body-sm font-medium text-ink" dir={dir}>
        {value}
      </span>
    </div>
  );
}
