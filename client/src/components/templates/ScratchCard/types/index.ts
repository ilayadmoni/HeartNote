/**
 * ScratchCard Type Definitions
 * Shared interfaces for Desktop and Mobile components
 */

import type { ScratchCardData } from "../../types";

export interface ScratchCardProps {
  data: ScratchCardData;
}

// Extended data with additional fields for lottery-style design
export interface LotteryScratchData extends ScratchCardData {
  recipientName?: string;    // For personalized title
  serialNumber?: string;     // e.g., "LUV-888-WIN"
}
