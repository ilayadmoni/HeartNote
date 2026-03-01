-- =============================================================================
-- HeartNote: Banned Users Table & Signup Guard
-- Version: 016
-- Description:
--   Creates a standalone banned_users table (no FK to auth.users) that
--   persists after the auth user and cascaded profile row are deleted.
--   A BEFORE INSERT trigger on auth.users rejects sign-ups from banned emails.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. BANNED_USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.banned_users (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email      TEXT        NOT NULL UNIQUE,
    reason     TEXT        NOT NULL DEFAULT 'self_deletion',
    banned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banned_users_email ON public.banned_users(email);

-- RLS: only service-role / superuser can touch this table
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
-- No policies → no access via anon or authenticated roles

-- Grant read access to the postgres/service_role for the trigger function
GRANT SELECT ON public.banned_users TO authenticated;
GRANT SELECT ON public.banned_users TO anon;

-- -----------------------------------------------------------------------------
-- 2. TRIGGER FUNCTION — block banned emails from re-registering
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_banned_user()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.banned_users WHERE email = NEW.email
    ) THEN
        RAISE EXCEPTION 'Registration is not allowed for this email address.'
            USING ERRCODE = 'P0001';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 3. TRIGGER — fires before every new auth.users row
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_check_ban ON auth.users;
CREATE TRIGGER on_auth_user_check_ban
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_banned_user();

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
