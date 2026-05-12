"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const C = {
  coral: "#d4826f",
} as const;

interface MobileNavItemProps {
  href: string;
  label: string;
  description?: string;
  onClick: () => void;
}

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
};

export const MobileNavItem = forwardRef<HTMLAnchorElement, MobileNavItemProps>(
  ({ href, label, description, onClick }, ref) => (
    <motion.li
      role="listitem"
      variants={itemVariants}
      className="border-b border-[rgba(212,130,111,0.12)] last:border-b-0"
    >
      <motion.div whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 24 }}>
        <Link
          ref={ref}
          href={href}
          onClick={onClick}
          className="
            flex items-center justify-between
            text-right no-underline
            rounded-lg
            transition-all duration-200
            hover:bg-[rgba(212,130,111,0.06)] dark:hover:bg-[rgba(212,130,111,0.10)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
            focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5] dark:focus-visible:ring-offset-[#1a1f2e]
          "
          style={{ padding: "16px 8px" }}
        >
          <div>
            <div
              className="text-[#2e3c52] dark:text-[#e8ddd5]"
              style={{
                fontSize: 17,
                fontWeight: 600,
                lineHeight: 1.3,
                fontFamily: "var(--font-open-sans)",
              }}
            >
              {label}
            </div>
            {description && (
              <div
                className="text-[#4a5a72] dark:text-[#8a9bb0]"
                style={{
                  fontFamily: "var(--font-open-sans)",
                  fontStyle: "italic",
                  fontSize: 13,
                  marginTop: 3,
                }}
              >
                {description}
              </div>
            )}
          </div>

          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 10 10"
            fill="none"
            stroke={C.coral}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, opacity: 0.7 }}
          >
            <path d="M6 1 L1 5 L6 9" />
          </svg>
        </Link>
      </motion.div>
    </motion.li>
  ),
);
MobileNavItem.displayName = "MobileNavItem";
