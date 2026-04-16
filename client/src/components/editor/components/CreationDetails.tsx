"use client";

/**
 * CreationDetails — Bottom stats box inside CreationConfirmModal.
 * Shows: template name, expiry date, remaining after this creation, and tier badge.
 * Logic is unchanged from the original modal — only extracted for modularity.
 */

import { motion } from "framer-motion";

interface CreationDetailsProps {
  templateName: string;
  expirationDate: string;
  /** Remaining quota after this creation is made */
  remainingAfterCreate: number | typeof Infinity;
  selectedQuota: "free" | "pro";
}

export function CreationDetails({ templateName, expirationDate, remainingAfterCreate, selectedQuota }: CreationDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 dark:bg-navy-700/70 rounded-xl p-2.5 mb-3"
    >
      {/* Expiry + remaining grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 p-2 text-right">
          <p className="text-[10px] text-gray-500 dark:text-gray-300 text-hebrew-body mb-0.5">תוקף היצירה</p>
          <p className="text-xs font-bold text-navy-700 dark:text-white text-hebrew-heading">{expirationDate}</p>
        </div>

        <div className="rounded-lg bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 p-2 text-right">
          <p className="text-[10px] text-gray-500 dark:text-gray-300 text-hebrew-body mb-0.5">יתרה לאחר היצירה</p>
          <motion.p
            key={remainingAfterCreate === Infinity ? "unlimited" : `${selectedQuota}-${remainingAfterCreate}`}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold text-navy-700 dark:text-white text-hebrew-heading"
          >
            {remainingAfterCreate === Infinity ? "ללא הגבלה" : remainingAfterCreate}
          </motion.p>
        </div>
      </div>

      {/* Tier badge */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full text-white text-hebrew-body ${selectedQuota === "pro" ? "bg-coral-500" : "bg-navy-600"}`}>
          {selectedQuota === "pro" ? "בחירת פרימיום" : "בחירה חינמית"}
        </span>
      </div>
    </motion.div>
  );
}
