"use client";

import { useProfileQuery, PROFILE_QUERY_KEY } from "./useProfileQuery";

export { PROFILE_QUERY_KEY as USER_QUERY_KEY };

export interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  email: string | null;
}

export function useUser() {
  const result = useProfileQuery();

  const data: UserProfileData | null | undefined = result.data
    ? {
        id: result.data.id,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        date_of_birth: result.data.date_of_birth,
        avatar_url: result.data.avatar_url,
        email: result.data.email,
      }
    : (result.data as null | undefined);

  return { ...result, data };
}
