"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const USER_QUERY_KEY = ["user"] as const;

export interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  email: string | null;
}

async function fetchUserProfile(userId: string): Promise<UserProfileData | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, date_of_birth, avatar_url, email")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfileData;
}

export function useUser() {
  const { user } = useAuth();

  return useQuery({
    queryKey: user ? [...USER_QUERY_KEY, user.id] : USER_QUERY_KEY,
    queryFn: () => fetchUserProfile(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}
