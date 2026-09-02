/**
 * Contact Page Constants
 * Copy lives in the `contact` message namespace; this file only holds
 * non-translatable config.
 */

export const CONTACT_MAX_LENGTHS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
} as const;
