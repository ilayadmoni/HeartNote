// src/utils/gtm.ts

// src/utils/gtm.ts

// Define the precise GTMEvent required schema
export type GTMEvent =
  | { event: "user_login"; user_id: string; user_status: string }
  | { event: "sign_up"; method: string }
  | { event: "generate_link" }
  | { event: "share"; platform: string }
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
    const w = window as unknown as { dataLayer: Record<string, any>[] };
    
    // Safety Array Initialization: if GTM script hasn't loaded yet, create the queue
    w.dataLayer = w.dataLayer || [];
    
    // Push the event to the queue
    w.dataLayer.push(data);
  } else {
    // In development or server context, do nothing or log (optional)
    if (process.env.NODE_ENV === "development") {
      console.log('📊 GTM Event:', data);
    }
  }
};
