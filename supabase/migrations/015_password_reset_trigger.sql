-- ============================================================
-- Migration 015: Password-reset tracking trigger
-- ============================================================
-- 1. Ensures `reset_attempts` (int, default 0) and
--    `is_blocked` (bool, default false) exist on profiles.
-- 2. Creates a SECURITY DEFINER function + AFTER UPDATE trigger
--    on auth.users that increments reset_attempts whenever the
--    encrypted_password column changes, and sets is_blocked=true
--    once it reaches 3 or more.
-- ============================================================

-- ── Step 1: Ensure columns exist ─────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reset_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_blocked     BOOLEAN NOT NULL DEFAULT false;

-- ── Step 2: Trigger function (SECURITY DEFINER bypasses RLS) ─
CREATE OR REPLACE FUNCTION public.handle_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- ── Step 3: Attach the trigger to auth.users ─────────────────
--  Drop first so this migration is safe to re-run.
DROP TRIGGER IF EXISTS on_password_change ON auth.users;

CREATE TRIGGER on_password_change
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_password_change();
