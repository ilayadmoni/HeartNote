export type ConsentValue = "granted" | "denied";

export interface ConsentState {
  ad_storage: ConsentValue;
  analytics_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
}

export interface ConsentData {
  consent: ConsentState;
  timestamp: string;
}

export interface CookieBannerContentProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
}
