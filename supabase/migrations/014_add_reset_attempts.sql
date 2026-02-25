-- =============================================================================
-- HeartNote – Add reset_attempts to profiles
-- Version: 014
-- Date: 2026-02-25
-- Description: Adds a reset_attempts column to track password reset requests
--              per user. After 3 attempts the account is blocked from further
--              resets until a successful password update resets the counter.
-- =============================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS reset_attempts INT NOT NULL DEFAULT 0;
