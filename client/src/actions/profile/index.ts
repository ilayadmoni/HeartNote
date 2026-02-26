/**
 * Profile Server Actions — barrel export
 *
 * Maintains backward compatibility: all existing imports
 * from "@/actions/profile" continue to work unchanged.
 */

export { getMyProfile, getAvatarOptions } from "./get";
export { updateMyProfile } from "./update";
export { deleteMyAccount } from "./delete";
