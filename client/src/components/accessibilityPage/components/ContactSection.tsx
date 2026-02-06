"use client";

/**
 * ContactSection Component
 * Contact information for accessibility issues
 */

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import {
  ACCESSIBILITY_CONTACT,
  COMMITMENT_TEXT,
  LAST_UPDATED,
} from "../constants";

export function ContactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-12 bg-[#2e3c52] dark:bg-gray-800 rounded-2xl p-8 text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-hebrew-heading">
        צרו קשר בנושא נגישות
      </h2>

      <p className="text-gray-300 mb-6 text-hebrew-body leading-relaxed whitespace-pre-line">
        {COMMITMENT_TEXT}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <a
          href={`mailto:${ACCESSIBILITY_CONTACT.email}`}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-colors duration-200"
        >
          <Mail size={20} />
          <span className="text-hebrew-body">
            {ACCESSIBILITY_CONTACT.email}
          </span>
        </a>
        <a
          href={`tel:${ACCESSIBILITY_CONTACT.phone}`}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-colors duration-200"
        >
          <Phone size={20} />
          <span className="text-hebrew-body" dir="ltr">
            {ACCESSIBILITY_CONTACT.phone}
          </span>
        </a>
      </div>

      <p className="text-sm text-gray-400 text-hebrew-body">
        עודכן לאחרונה: {LAST_UPDATED}
      </p>
    </motion.div>
  );
}
