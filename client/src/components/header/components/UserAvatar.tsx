"use client";

/** UserAvatar – avatar display for UserMenu */

import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
  avatarUrl: string | null;
  displayName: string;
  size?: number;
}

export function UserAvatar({ avatarUrl, displayName, size = 32 }: UserAvatarProps): JSX.Element {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        className="w-8 h-8 rounded-full object-cover"
        unoptimized={avatarUrl.includes("dicebear.com")}
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center">
      <User size={16} className="text-accent" />
    </div>
  );
}
