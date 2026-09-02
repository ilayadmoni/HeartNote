// src/utils/gtm.ts

import { logger } from "@/lib/utils/logger";

// Define the precise GTMEvent required schema
export type GTMEvent =
  | { event: "user_login"; user_id: string; user_status: string }
  | { event: "sign_up"; method: string }
  | { event: "generate_link"; template_name: string }
  | { event: "share"; method: string; template_name: string }
  | { event: "view_template"; template_name: string };

/**
 * Pushes a strictly typed event to the Google Tag Manager dataLayer.
 * Includes a safety check to silently ignore calls during SSR (where window is undefined).
 */
export const pushToDataLayer = (data: GTMEvent) => {
  // Client-side safety check to prevent "window is not defined" SSR crashing
  if (typeof window !== "undefined") {
    // Local typecast avoids overriding @next/third-parties global Window interfaces
    // which otherwise causes TS2717 "identical modifiers" typescript errors.
    const w = window as unknown as { dataLayer: GTMEvent[] };

    // Safety Array Initialization: if GTM script hasn't loaded yet, create the queue
    w.dataLayer = w.dataLayer || [];

    // Push the event to the queue
    w.dataLayer.push(data);
  } else if (process.env.NODE_ENV === "development") {
    logger.info("[gtm] Event (SSR, not pushed)", { event: data });
  }
};
