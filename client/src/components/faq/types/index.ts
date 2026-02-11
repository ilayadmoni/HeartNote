/**
 * FAQ Page Types
 */

import { ReactNode } from "react";

export interface FAQProps {
  className?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string | ReactNode;
}
