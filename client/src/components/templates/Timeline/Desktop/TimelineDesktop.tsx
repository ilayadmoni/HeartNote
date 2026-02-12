"use client";

/**
 * Timeline Component - Desktop Version
 * Card-based timeline with vertical connectors
 */

import { motion } from "framer-motion";
import type { TimelineDesktopProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function TimelineDesktop({ data }: TimelineDesktopProps) {
  const hasEvents = data.events && data.events.length > 0;
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 p-6 overflow-auto relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-6"
      >
        {/* Title */}
        {data.title && (
          <h1 className="text-xl font-bold text-center text-[#2e3c52] dark:text-white mb-6 text-hebrew-heading">
            {data.title}
          </h1>
        )}

        {/* Timeline Content */}
        {hasEvents ? (
          <div className="relative">
            {/* Vertical Line */}
            <div
              className="absolute left-4 top-3 bottom-3 w-0.5 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}30, ${primaryColor}50, ${primaryColor}30)`,
              }}
            />

            {/* Events */}
            <div className="space-y-4">
              {data.events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 pr-2"
                >
                  {/* Icon Circle */}
                  <div
                    className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
                    }}
                  >
                    <span className="text-sm">{event.icon || "📌"}</span>
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-2">
                    {/* Date Badge */}
                    <span
                      className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full mb-1.5"
                      style={{
                        color: primaryColor,
                        backgroundColor: `${primaryColor}15`,
                      }}
                    >
                      {formatDate(event.date)}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#2e3c52] dark:text-white mb-0.5 text-hebrew-heading">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">📅</span>
            <p className="text-sm text-gray-400 text-hebrew-body">
              הוסף אירועים לציר הזמן שלך
            </p>
          </div>
        )}
      </motion.div>

      {/* Spacer between content and footer branding */}
      <div className="mt-8" />

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-2" />
    </div>
  );
}

/** Format date to Hebrew format */
function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
