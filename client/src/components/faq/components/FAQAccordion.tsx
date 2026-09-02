"use client";

/**
 * FAQAccordion Component
 * Container for FAQ items with single-open behavior.
 */

import { useState } from "react";
import { FAQAccordionItem } from "./FAQAccordionItem";
import { FAQ_ITEM_IDS } from "../constants";

export function FAQAccordion(): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string): void => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="bg-surface-raised rounded-card shadow-card border border-line overflow-hidden">
      {FAQ_ITEM_IDS.map((id, index) => (
        <FAQAccordionItem key={id} id={id} isOpen={openId === id} onToggle={() => handleToggle(id)} index={index} />
      ))}
    </div>
  );
}
