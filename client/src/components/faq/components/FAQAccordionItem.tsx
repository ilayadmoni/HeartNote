"use client";

/**
 * FAQAccordionItem Component
 * Individual expandable/collapsible FAQ item. Question/answer copy comes
 * from the `faq` message namespace; the answer may carry rich markup
 * (bold, list) rendered via `t.rich`.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/lib/motion";
import type { FaqItemId } from "../constants";

interface FAQAccordionItemProps {
  id: FaqItemId;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const richTags = {
  b: (chunks: React.ReactNode) => <span className="font-bold">{chunks}</span>,
  i: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>,
  ul: (chunks: React.ReactNode) => <ul className="list-disc list-inside space-y-1 mt-2 mb-2">{chunks}</ul>,
  li: (chunks: React.ReactNode) => <li>{chunks}</li>,
  br: () => <br />,
};

export function FAQAccordionItem({ id, isOpen, onToggle, index }: FAQAccordionItemProps): JSX.Element {
  const t = useTranslations("faq");
  const motionOk = useMotionOk();

  return (
    <motion.div
      initial={motionOk ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: motionOk ? index * 0.08 : 0 }}
      className="border-b border-line last:border-b-0"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${id}`}
        className="w-full py-5 px-4 flex items-center justify-between gap-4 text-start hover:bg-surface-sunken transition-colors duration-base rounded-control group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: motionOk ? 0.3 : 0 }}
          className="shrink-0"
        >
          <ChevronDown
            size={20}
            className={cn("transition-colors duration-base", isOpen ? "text-accent" : "text-ink-subtle group-hover:text-accent")}
          />
        </motion.div>

        <span className={cn("flex-1 text-body-md font-medium transition-colors duration-base", isOpen ? "text-accent" : "text-ink")}>
          {t(`items.${id}.question`)}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: motionOk ? 0.3 : 0, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 ps-12">
              <div className="text-body-sm text-ink-muted leading-relaxed">
                {t.rich(`items.${id}.answer`, richTags)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
