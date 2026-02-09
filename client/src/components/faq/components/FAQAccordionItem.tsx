"use client";

/**
 * FAQAccordionItem Component
 * Individual expandable/collapsible FAQ item
 */

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "../types";

interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

export function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: FAQAccordionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="w-full py-5 px-4 flex items-center justify-between gap-4 text-right hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            size={20}
            className={`transition-colors duration-200 ${
              isOpen
                ? "text-[#d4826f] dark:text-[#e8917a]"
                : "text-gray-400 dark:text-gray-500 group-hover:text-[#d4826f] dark:group-hover:text-[#e8917a]"
            }`}
          />
        </motion.div>

        <span
          className={`flex-1 text-base font-medium text-hebrew-heading transition-colors duration-200 ${
            isOpen
              ? "text-[#d4826f] dark:text-[#e8917a]"
              : "text-[#2e3c52] dark:text-white"
          }`}
        >
          {item.question}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pr-12">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-hebrew-body">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
