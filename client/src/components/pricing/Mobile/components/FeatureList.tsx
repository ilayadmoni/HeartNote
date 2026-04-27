"use client";

import type { PricingFeature } from "../../types";

interface FeatureListProps {
  features: PricingFeature[];
  isFeatured: boolean;
}

function CheckIcon({ isFeatured }: { isFeatured: boolean }) {
  return (
    <span
      className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
        isFeatured ? "bg-white/20" : "bg-[#d4826f]/10 dark:bg-[#d4826f]/15"
      }`}
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke={isFeatured ? "#fff" : "#d4826f"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function LockIcon({ isFeatured }: { isFeatured: boolean }) {
  return (
    <span
      className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
        isFeatured ? "bg-white/10" : "bg-gray-100 dark:bg-white/5"
      }`}
    >
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true">
        <rect
          x="0.7"
          y="4.5"
          width="7.6"
          height="5.8"
          rx="1.4"
          stroke={isFeatured ? "rgba(255,255,255,0.38)" : "#9ca3af"}
          strokeWidth="1.3"
        />
        <path
          d="M2.2 4.5V3.2a2.3 2.3 0 0 1 4.6 0v1.3"
          stroke={isFeatured ? "rgba(255,255,255,0.38)" : "#9ca3af"}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function FeatureList({ features, isFeatured }: FeatureListProps) {
  return (
    <ul className="space-y-3 mb-7">
      {features.map((feature) => (
        <li key={feature.id} className="flex items-center gap-3 justify-end">
          <span
            className={`text-sm font-medium leading-snug text-hebrew-body ${
              isFeatured
                ? "text-white/90"
                : "text-[#2e3c52] dark:text-gray-300"
            }`}
          >
            {feature.text}
          </span>
          {feature.included ? (
            <CheckIcon isFeatured={isFeatured} />
          ) : (
            <LockIcon isFeatured={isFeatured} />
          )}
        </li>
      ))}
    </ul>
  );
}
