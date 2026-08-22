/**
 * App-layer replacement for the Supabase `handle_new_user()` trigger, which
 * used to auto-insert a `profiles` row on every `auth.users` INSERT. Since
 * there's no `auth.users` table anymore, this runs explicitly:
 *   - Credentials registration → called directly inside registerUser()'s
 *     transaction (src/actions/registration.ts).
 *   - Google OAuth first sign-in → called from the NextAuth `createUser`
 *     event (src/lib/auth/index.ts), which only fires once per new user.
 *
 * Mirrors the FINAL trigger body (20260508_sec7_handle_new_user_search_path.sql):
 * no Dicebear-avatar fallback — avatar_url is left null unless provided.
 */

import { prisma } from "@/lib/prisma";

export interface NewProfileInput {
  userId: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  avatarUrl?: string | null;
}

export async function createProfileForUser(input: NewProfileInput) {
  return prisma.profile.create({
    data: {
      id: input.userId,
      email: input.email,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? "",
      avatarUrl: input.avatarUrl ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      subscriptionTier: "free",
      creationsCountFree: 0,
    },
  });
}

/** Best-effort first/last name split for OAuth profiles that only give a full name. */
export function splitFullName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  const trimmed = (fullName ?? "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}
