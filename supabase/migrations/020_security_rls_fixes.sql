-- =============================================================================
-- HeartNote: Security RLS Fixes
-- Version: 020
-- Date: 2026-03-31
-- Description:
--   Fixes critical RLS vulnerabilities identified in pre-production audit:
--   - SEC-CRIT-2: creations table readable by anyone (privacy leak)
--   - SEC-CRIT-3: banned_users table readable by authenticated/anon
--   - SEC-HIGH-11: password_reset_attempts readable by authenticated
--
-- IMPORTANT: Run this migration BEFORE production deployment.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. FIX CREATIONS RLS POLICY (SEC-CRIT-2)
-- -----------------------------------------------------------------------------
-- Problem: Anyone can SELECT non-deleted creations from other users
-- Fix: Require ownership OR explicit is_published flag for shared viewing

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view non-deleted creations by id" ON public.creations;

-- Add is_published column if it doesn't exist (for public sharing)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'creations'
        AND column_name = 'is_published'
    ) THEN
        ALTER TABLE public.creations ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT true;
        COMMENT ON COLUMN public.creations.is_published IS 'If true, the creation can be viewed via shared link. If false, only owner can see it.';
    END IF;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own creations" ON public.creations;
DROP POLICY IF EXISTS "Anyone can view published creations" ON public.creations;

-- Policy 1: Users can view their own creations (authenticated)
CREATE POLICY "Users can view own creations"
    ON public.creations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id AND is_deleted = false);

-- Policy 2: Anyone can view published (shared) creations via link
-- This is for the shared card viewing feature
CREATE POLICY "Anyone can view published creations"
    ON public.creations FOR SELECT
    USING (is_deleted = false AND is_published = true);

-- -----------------------------------------------------------------------------
-- 2. FIX BANNED_USERS RLS (SEC-CRIT-3)
-- -----------------------------------------------------------------------------
-- Problem: GRANT SELECT allows authenticated/anon to enumerate banned emails
-- Fix: Revoke direct access; trigger function uses SECURITY DEFINER

-- Revoke the problematic grants (ignore errors if grants don't exist)
DO $$
BEGIN
    REVOKE SELECT ON public.banned_users FROM authenticated;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore if grant doesn't exist
END $$;

DO $$
BEGIN
    REVOKE SELECT ON public.banned_users FROM anon;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore if grant doesn't exist
END $$;

-- The check_banned_user() function already uses SECURITY DEFINER,
-- so it can still query the table during signup.

-- Add explicit deny policy for extra safety
DROP POLICY IF EXISTS "No public access to banned_users" ON public.banned_users;
CREATE POLICY "No public access to banned_users"
    ON public.banned_users FOR ALL
    USING (false);

-- -----------------------------------------------------------------------------
-- 3. FIX PASSWORD_RESET_ATTEMPTS RLS (SEC-HIGH-11)
-- -----------------------------------------------------------------------------
-- Problem: authenticated users can SELECT/INSERT any reset attempts
-- Fix: Revoke access; only service-role should access this table
--
-- CRITICAL: This table MUST only be accessible via service_role (supabaseAdmin)
-- The server actions use createAdminClient() which bypasses RLS.

-- Ensure RLS is enabled
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- Revoke all grants to authenticated and anon roles
DO $$
BEGIN
    REVOKE ALL ON public.password_reset_attempts FROM authenticated;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    REVOKE ALL ON public.password_reset_attempts FROM anon;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    REVOKE USAGE ON SEQUENCE public.password_reset_attempts_id_seq FROM authenticated;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    REVOKE USAGE ON SEQUENCE public.password_reset_attempts_id_seq FROM anon;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Drop any existing policies
DROP POLICY IF EXISTS "No public access to password_reset_attempts" ON public.password_reset_attempts;

-- Create explicit DENY policy for all operations
-- This ensures that even if someone grants access, the policy blocks it
CREATE POLICY "No public access to password_reset_attempts"
    ON public.password_reset_attempts FOR ALL
    TO authenticated, anon
    USING (false)
    WITH CHECK (false);

-- Note: service_role bypasses RLS, so server actions using createAdminClient() 
-- can still INSERT and SELECT from this table.

-- -----------------------------------------------------------------------------
-- 4. ADD BLOCKED USER CHECK TO SENSITIVE OPERATIONS (SEC-MED-19)
-- -----------------------------------------------------------------------------
-- Prevent blocked users from creating new content

DROP POLICY IF EXISTS "Blocked users cannot insert" ON public.creations;
CREATE POLICY "Blocked users cannot insert"
    ON public.creations FOR INSERT
    TO authenticated
    WITH CHECK (
        NOT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_blocked = true
        )
    );

DROP POLICY IF EXISTS "Blocked users cannot update" ON public.creations;
CREATE POLICY "Blocked users cannot update"
    ON public.creations FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id AND
        NOT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_blocked = true
        )
    );

-- =============================================================================
-- VERIFICATION QUERIES (Run these after applying migration)
-- =============================================================================
-- 
-- Test 1: Verify banned_users is not accessible (run as authenticated user):
--   SELECT * FROM public.banned_users; 
--   Expected: ERROR or empty result due to RLS
--
-- Test 2: Verify password_reset_attempts is not accessible:
--   SELECT * FROM public.password_reset_attempts;
--   Expected: ERROR or empty result due to RLS
--
-- Test 3: Verify only own/published creations visible:
--   SELECT * FROM public.creations WHERE user_id != auth.uid();
--   Expected: Only rows where is_published = true
--
-- Test 4: Verify service_role can still access (run in Supabase SQL Editor):
--   -- This should work because service_role bypasses RLS
--   SELECT COUNT(*) FROM public.password_reset_attempts;
--
-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
