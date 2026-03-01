-- =============================================================================
-- HeartNote: Password Reset Attempts Tracking
-- Version: 017
-- Date: 2026-03-01
-- Description:
--   Creates a password_reset_attempts table to track forgot-password requests
--   per email address. The server action counts rows in the last 24 hours;
--   after 3 attempts the email is auto-inserted into banned_users.
--
--   Old profiles.reset_attempts / is_blocked columns are left in place
--   (migration 014/015) for backward compat but are no longer the
--   primary rate-limit mechanism.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PASSWORD RESET ATTEMPTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.password_reset_attempts (
    id         BIGSERIAL   PRIMARY KEY,
    email      TEXT        NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pra_email_created
    ON public.password_reset_attempts (email, created_at DESC);

-- RLS enabled, no policies → only service-role can read/write
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- Grant usage on the sequence so service-role inserts work
GRANT USAGE ON SEQUENCE public.password_reset_attempts_id_seq TO authenticated;
GRANT SELECT, INSERT ON public.password_reset_attempts TO authenticated;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
