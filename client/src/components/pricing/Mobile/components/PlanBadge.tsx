"use client";

import { motion } from "framer-motion";

type BadgeType = "coming-soon" | "popular" | "recommended";

interface PlanBadgeProps {
  type: BadgeType;
  label: string;
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path
        d="M5.5 1L6.8 4.1H10.2L7.5 6L8.5 9.3L5.5 7.4L2.5 9.3L3.5 6L0.8 4.1H4.2L5.5 1Z"
        fill="white"
      />
    </svg>
  );
}

function LockBadgeIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
      <rect x="0.7" y="5" width="8.6" height="6.3" rx="1.8" stroke="white" strokeWidth="1.35" />
      <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="white" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="white" strokeWidth="1.3" />
      <path d="M3.5 5.5L4.8 6.8L7.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CONFIG: Record<BadgeType, { className: string; icon: React.ReactNode }> = {
  "coming-soon": {
    className:
      "bg-gradient-to-r from-amber-400/95 to-orange-400/95 backdrop-blur-sm border-amber-300/30",
    icon: <LockBadgeIcon />,
  },
  popular: {
    className:
      "bg-gradient-to-r from-[#d4826f] to-[#b86a57] border-[#d4826f]/30",
    icon: <StarIcon />,
  },
  recommended: {
    className:
      "bg-gradient-to-r from-[#2e3c52]/90 to-[#4a5a72]/90 backdrop-blur-sm border-white/15",
    icon: <CheckBadgeIcon />,
  },
};

export function PlanBadge({ type, label }: PlanBadgeProps) {
  const { className, icon } = CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.18, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border whitespace-nowrap ${className}`}
    >
      {icon}
      <span className="text-hebrew-heading">{label}</span>
    </motion.div>
  );
}
