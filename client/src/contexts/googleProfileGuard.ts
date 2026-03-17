import type { User } from "@supabase/supabase-js";

interface ProfileRow {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
}

export function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isGoogleUser(user: User): boolean {
  const provider = (user.app_metadata as Record<string, unknown> | undefined)?.provider;
  if (provider === "google") return true;

  const identities = (user.identities ?? []) as Array<{ provider?: string }>;
  return identities.some((identity) => identity.provider === "google");
}

export function isProfileIncomplete(user: User, profileRow: ProfileRow | null): boolean {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;

  const hasMetaFirstName = isNonEmpty(metadata.first_name);
  const hasMetaLastName = isNonEmpty(metadata.last_name);
  const hasMetaBirthDate = isNonEmpty(metadata.birth_date) || isNonEmpty(metadata.date_of_birth);

  const hasProfileFirstName = isNonEmpty(profileRow?.first_name);
  const hasProfileLastName = isNonEmpty(profileRow?.last_name);
  const hasProfileBirthDate = isNonEmpty(profileRow?.date_of_birth);

  return (
    !hasMetaFirstName ||
    !hasMetaLastName ||
    !hasMetaBirthDate ||
    !hasProfileFirstName ||
    !hasProfileLastName ||
    !hasProfileBirthDate
  );
}
