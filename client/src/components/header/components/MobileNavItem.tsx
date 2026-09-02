"use client";

import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface MobileNavItemProps {
  href: string;
  label: string;
  description?: string;
  onClick: () => void;
}

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 28 } },
  closed: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export const MobileNavItem = forwardRef<HTMLAnchorElement, MobileNavItemProps>(
  ({ href, label, description, onClick }, ref) => (
    <motion.li role="listitem" variants={itemVariants} className="border-b border-line last:border-b-0">
      <motion.div whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 24 }}>
        <Link
          ref={ref}
          href={href}
          onClick={onClick}
          className="
            flex items-center justify-between gap-2 min-h-[3rem]
            text-start no-underline rounded-control px-2 py-4
            transition-colors duration-200
            hover:bg-accent-soft/60
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
            focus-visible:ring-offset-2 focus-visible:ring-offset-surface
          "
        >
          <div>
            <div className="text-title-sm text-ink">{label}</div>
            {description && <div className="text-caption text-ink-muted italic mt-0.5">{description}</div>}
          </div>

          <ChevronLeft aria-hidden="true" size={16} className="shrink-0 text-accent opacity-70 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </motion.div>
    </motion.li>
  ),
);
MobileNavItem.displayName = "MobileNavItem";
