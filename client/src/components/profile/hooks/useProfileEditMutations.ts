"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { USER_QUERY_KEY } from "@/hooks/useUser";
import { updateMyProfile } from "@/actions/profile";
import { mapApiProfileToUserProfile } from "../types";
import type { UserProfile } from "../types";
import type { ProfileResponse } from "@/lib/validations";

interface UseProfileEditMutationsArgs {
  initialProfile: ProfileResponse;
  setProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  setError: (error: string | null) => void;
}

/** The two profile-edit mutations (name, avatar), sharing the same optimistic + rollback shape. */
export function useProfileEditMutations({ initialProfile, setProfile, setError }: UseProfileEditMutationsArgs) {
  const queryClient = useQueryClient();

  const onSettledSuccess = (data: ProfileResponse): void => {
    setProfile(() => mapApiProfileToUserProfile(data));
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
  };

  const onSettledError = (err: Error): void => {
    setError(err.message);
    setProfile(() => mapApiProfileToUserProfile(initialProfile));
  };

  const editProfileMutation = useMutation({
    mutationFn: async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
      const result = await updateMyProfile({ first_name: firstName, last_name: lastName });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onMutate: async ({ firstName, lastName }) => {
      setError(null);
      setProfile((prev) => ({ ...prev, firstName, lastName }));
    },
    onSuccess: onSettledSuccess,
    onError: onSettledError,
  });

  const avatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const result = await updateMyProfile({ avatar_url: avatarUrl });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onMutate: async (avatarUrl) => {
      setError(null);
      setProfile((prev) => ({ ...prev, avatarUrl }));
    },
    onSuccess: onSettledSuccess,
    onError: onSettledError,
  });

  return { editProfileMutation, avatarMutation };
}
