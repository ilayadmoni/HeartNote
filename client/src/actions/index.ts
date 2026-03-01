/**
 * Server Actions barrel export
 */

// Profile
export {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getAvatarOptions,
} from "./profile";

// Creations
export {
  createCreation,
  submitGenericCreation,
  getMyCreations,
  getCreation,
  deleteCreation,
  redeemCoupon,
} from "./creations";

// Templates
export { getTemplates, getTemplateBySlug, getPopularTemplates } from "./templates";

// Dashboard
export { getDashboard } from "./dashboard";

// Auth
export { loginAction } from "./auth";
export { type LoginState, initialLoginState } from "./auth.types";

// Contact
export { sendContactEmail } from "./contact";

// Password Reset
export { requestPasswordReset, updatePassword } from "./password";

// Registration
export { registerUser } from "./registration";
