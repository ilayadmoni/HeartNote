"use client";

/**
 * Timeline Component
 * Vertical timeline with animated event cards (RTL support)
 */

import { motion } from "framer-motion";
import type {
  TemplateComponentProps,
  TimelineData,
  TimelineEvent,
} from "./types";

export function Timeline({ data }: TemplateComponentProps<TimelineData>) {
  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-center text-[#2e3c52] dark:text-white mb-12 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line - adjusted for RTL */}
          <div className="absolute right-4 md:right-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#d4826f] via-[#e8917a] to-[#d4826f]" />

          {/* Events */}
          <div className="space-y-8">
            {data.events.map((event, index) => (
              <TimelineCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
}

function TimelineCard({ event, index }: TimelineCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative flex items-center ${isEven ? "md:flex-row-reverse" : ""}`}
    >
      {/* Timeline Dot */}
      <div className="absolute right-2.5 md:right-auto md:left-1/2 md:-translate-x-1/2 z-10">
        <motion.div
          whileInView={{ scale: [0, 1.2, 1] }}
          viewport={{ once: true }}
          className="w-4 h-4 rounded-full bg-[#d4826f] border-4 border-white dark:border-gray-900 shadow-lg"
        />
      </div>

      {/* Card - Responsive positioning */}
      <div
        className={`w-full pr-10 md:pr-0 md:w-1/2 ${isEven ? "md:pr-8" : "md:pl-8"}`}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
        >
          {/* Date Badge */}
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#d4826f] bg-[#faf7f5] dark:bg-gray-700 rounded-full mb-3 text-hebrew-body">
            {formatDate(event.date)}
          </span>

          {/* Image */}
          {event.image && (
            <div className="mb-3 rounded-xl overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 text-hebrew-body leading-relaxed">
              {event.description}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/** Format date to Hebrew locale */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
