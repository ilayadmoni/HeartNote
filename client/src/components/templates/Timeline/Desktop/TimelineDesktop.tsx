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
import { FloatingIcons } from "../../OpenWhen/components";


export function TimelineDesktop({ data }: TimelineDesktopProps) {
  const hasEvents = data.events && data.events.length > 0;
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <FloatingIcons />
      <BackToGallery className="top-4 right-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-8">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-6"
        >
          {/* Title */}
          {data.title && (
            <h1
              className="text-xl font-bold text-center mb-6 text-hebrew-heading break-words max-w-[360px] mx-auto"
              style={{ color: primaryColor }}
            >
              {data.title}
            </h1>
          )}

          {/* Timeline Content */}
          {hasEvents ? (
            <div className="relative" dir="rtl">
              {/* Vertical dashed line — aligned with icon center (w-9 = 36px → center at 18px from right) */}
              <div
                className="absolute right-[18px] top-3 bottom-3 w-[2px] rounded-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, ${primaryColor}70 0px, ${primaryColor}70 7px, transparent 7px, transparent 13px)`,
                }}
              />

              {/* Events */}
              <div className="space-y-4">
                {data.events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.35, ease: "easeOut" }}
                    className="relative flex items-start gap-4 pl-1"
                  >
                    {/* Icon Circle */}
                    <div
                      className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}0d)`,
                        boxShadow: `0 0 0 2.5px ${primaryColor}65, 0 3px 10px ${primaryColor}22`,
                      }}
                    >
                      <span className="text-base leading-none">{event.icon || "📌"}</span>
                    </div>

                    {/* Event Card */}
                    <motion.div
                      className="flex-1 rounded-xl p-3 border cursor-default"
                      whileHover={{ scale: 1.02, y: -2, boxShadow: `0 6px 20px ${primaryColor}20` }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      style={{
                        backgroundColor: `${primaryColor}07`,
                        borderColor: `${primaryColor}22`,
                        boxShadow: `0 1px 4px ${primaryColor}10`,
                      }}
                    >
                      {/* Date Badge */}
                      <span
                        className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full mb-1.5 tracking-wide"
                        style={{
                          color: primaryColor,
                          backgroundColor: `${primaryColor}18`,
                        }}
                      >
                        {formatDate(event.date)}
                      </span>

                      {/* Event Title */}
                      <h3 className="text-sm font-bold text-[#2e3c52] dark:text-white mb-1 text-hebrew-heading break-words leading-snug">
                        {event.title}
                      </h3>

                      {/* Description */}
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body leading-relaxed break-words">
                          {event.description}
                        </p>
                      )}
                    </motion.div>
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
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
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
