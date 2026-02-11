"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "../faq/constants/data";
import type { FAQItem as FAQItemType } from "../faq/types";

// Removed whitespace-pre-line from answer container to fix layout
interface FAQItemProps {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ item, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-none">
      <button
        onClick={onToggle}
        className="w-full py-4 px-2 flex items-center justify-between text-right focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-[#2e3c52] dark:text-white group-hover:text-[#d4826f] transition-colors">
          {item.question}
        </span>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#d4826f]"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-2 text-[#2e3c52] dark:text-gray-300 text-base leading-relaxed text-right">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full max-w-3xl mx-auto py-12 px-4" dir="rtl">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#2e3c52] dark:text-white font-hebrew">
        שאלות נפוצות
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        {FAQ_ITEMS.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
