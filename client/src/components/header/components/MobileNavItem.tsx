"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const C = {
  coral: "#d4826f",
  coralDark: "#b86a57",
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
    <motion.li role="listitem" style={{ marginBottom: 8 }} variants={itemVariants}>
      <motion.div whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 24 }}>
        <Link
          ref={ref}
          href={href}
          onClick={onClick}
          className="
            flex items-center justify-between
            text-right no-underline
            rounded-[16px]
            transition-all duration-200
            border-2 border-[rgba(212,130,111,0.18)] dark:border-[rgba(212,130,111,0.22)]
            hover:border-[rgba(212,130,111,0.45)] dark:hover:border-[rgba(212,130,111,0.55)]
            hover:bg-[rgba(212,130,111,0.06)] dark:hover:bg-[rgba(212,130,111,0.10)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
            focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a1f2e]
          "
          style={{
            padding: "13px 14px",
            boxShadow: `0 0 12px rgba(212, 130, 111, 0.3), 0 4px 12px -3px rgba(184, 106, 87, 0.25)`,
            borderColor: C.coral,
          }}
        >
          <div>
            <div
              className="text-[#2e3c52] dark:text-[#e8ddd5]"
              style={{
                fontSize: 17,
                fontWeight: 700,
                lineHeight: 1.25,
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
                  marginTop: 2,
                }}
              >
                {description}
              </div>
            )}
          </div>
          <span
            aria-hidden="true"
            className="bg-white dark:bg-[#252d3d] border-[rgba(212,130,111,0.25)] dark:border-[rgba(212,130,111,0.35)]"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke={C.coral}
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M6 1 L1 5 L6 9" />
            </svg>
          </span>
        </Link>
      </motion.div>
    </motion.li>
  ),
);
MobileNavItem.displayName = "MobileNavItem";
