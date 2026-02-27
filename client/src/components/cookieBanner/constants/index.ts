import type { ConsentState } from "../types";

/** localStorage key for persisting the user's cookie consent choice */
export const CONSENT_STORAGE_KEY = "heartnote_cookie_consent";

/** Consent state when the user accepts all cookies */
export const GRANTED_CONSENT: ConsentState = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

/** Consent state when the user rejects all cookies */
export const DENIED_CONSENT: ConsentState = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};
