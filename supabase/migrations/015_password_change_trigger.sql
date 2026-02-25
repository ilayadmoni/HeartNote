-- =============================================================================
-- HeartNote – Password-change trigger (security limit)
-- Version: 015
-- Date: 2026-02-25
-- Description:
--   Tracks every *successful* password change via an AFTER UPDATE trigger on
--   auth.users. Each change increments public.profiles.reset_attempts; once
--   the counter reaches 3 the account is automatically blocked.
--
--   Safe to re-run: uses IF NOT EXISTS / DROP TRIGGER IF EXISTS.
-- =============================================================================

-- ── 1. Ensure required columns exist ────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reset_attempts INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE;

-- ── 2. Trigger function (SECURITY DEFINER → runs with owner privileges) ─────

CREATE OR REPLACE FUNCTION public.handle_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- required to write to public.profiles from the
                          -- auth schema context
SET search_path = public  -- harden against search_path hijacking
AS $$
DECLARE
  _new_attempts INTEGER;
BEGIN
  -- Only act when the hashed password actually changed
  IF OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password THEN

    -- Increment the counter and capture the new value in one statement
    UPDATE public.profiles
       SET reset_attempts = reset_attempts + 1
     WHERE id = NEW.id
     RETURNING reset_attempts INTO _new_attempts;

    -- Block the account when the limit is reached
    IF _new_attempts >= 3 THEN
      UPDATE public.profiles
         SET is_blocked = TRUE
       WHERE id = NEW.id;
    END IF;

  END IF;

  RETURN NEW;
END;
$$;

-- ── 3. (Re-)create the trigger ──────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_password_change ON auth.users;

CREATE TRIGGER on_password_change
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_password_change();
