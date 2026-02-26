-- =============================================================================
-- HeartNote – Password-change trigger (security limit) [CONSOLIDATED]
-- Version:     015
-- Date:        2026-02-25
-- Description:
--   Tracks every *successful* password change via an AFTER UPDATE trigger on
--   auth.users. Each change increments public.profiles.reset_attempts; once
--   the counter reaches 3 the account is automatically blocked.
--
--   Consolidated from:
--     015_password_change_trigger.sql
--     015_password_reset_trigger.sql
--
--   Safe to re-run: uses IF NOT EXISTS / DROP TRIGGER IF EXISTS.
-- =============================================================================

-- ── 1. Ensure required columns exist ────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reset_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_blocked     BOOLEAN NOT NULL DEFAULT false;

-- ── 2. Trigger function (SECURITY DEFINER → runs with owner privileges) ─────

CREATE OR REPLACE FUNCTION public.handle_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- required to write to public.profiles from the
                          -- auth schema context
SET search_path = public  -- harden against search_path hijacking
AS $$
DECLARE
  new_attempts INTEGER;
BEGIN
  -- Only act when the hashed password actually changed
  IF OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password THEN

    UPDATE public.profiles
    SET
      reset_attempts = reset_attempts + 1,
      is_blocked     = CASE WHEN reset_attempts + 1 >= 3 THEN TRUE ELSE is_blocked END
    WHERE id = NEW.id
    RETURNING reset_attempts INTO new_attempts;

  END IF;

  RETURN NEW;
END;
$$;

-- ── 3. (Re-)create the trigger ──────────────────────────────────────────────
--  Drop first so this migration is safe to re-run.

DROP TRIGGER IF EXISTS on_password_change ON auth.users;

CREATE TRIGGER on_password_change
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_password_change();
