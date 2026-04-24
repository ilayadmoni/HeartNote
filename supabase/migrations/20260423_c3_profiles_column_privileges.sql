-- 20260423_c3_profiles_column_privileges.sql
-- C3: Lock down sensitive profile columns at the PostgREST/grant layer.
-- RLS still applies (users may only touch their own row); this migration
-- additionally restricts *which columns* the authenticated role can UPDATE,
-- preventing privilege escalation via subscription_tier / is_blocked /
-- premium_expiry / premium_start / creations_count_* / additional_creation_*
-- / reset_attempts by direct PostgREST calls.

-- Revoke the table-wide UPDATE privilege.
revoke update on public.profiles from authenticated;

-- Grant UPDATE on the safe, user-facing columns only.
grant update (first_name, last_name, avatar_url, date_of_birth)
  on public.profiles
  to authenticated;

-- Note: date_of_birth is included because the complete-profile flow sets it
-- via the user-scoped client. If that flow moves to the service-role client,
-- drop date_of_birth from the grant above.
