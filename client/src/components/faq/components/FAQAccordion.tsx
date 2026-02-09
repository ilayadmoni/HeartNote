"use client";

/**
 * FAQAccordion Component
 * Container for FAQ items with single-open behavior
 */

import { useState } from "react";
import { FAQAccordionItem } from "./FAQAccordionItem";
import { FAQ_ITEMS } from "../constants";

export function FAQAccordion() {
  // Track which item is open (only one at a time)
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {FAQ_ITEMS.map((item, index) => (
        <FAQAccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
          index={index}
        />
      ))}
    </div>
  );
}
