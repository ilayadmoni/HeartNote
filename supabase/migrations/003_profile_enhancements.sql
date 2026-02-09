-- =============================================================================
-- HeartNote Database Schema Migration - Profile Enhancements
-- Version: 1.1.0
-- Date: 2026-02-09
-- Description: Split full_name into first_name/last_name, add date_of_birth
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ADD NEW COLUMNS TO PROFILES TABLE
-- -----------------------------------------------------------------------------

-- Add first_name and last_name columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- -----------------------------------------------------------------------------
-- 2. MIGRATE EXISTING DATA
-- -----------------------------------------------------------------------------

-- Split existing full_name into first_name and last_name
-- Takes first word as first_name, rest as last_name
UPDATE public.profiles
SET 
    first_name = COALESCE(
        NULLIF(split_part(full_name, ' ', 1), ''),
        full_name
    ),
    last_name = NULLIF(
        TRIM(SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)),
        ''
    )
WHERE full_name IS NOT NULL AND first_name IS NULL;

-- -----------------------------------------------------------------------------
-- 3. UPDATE TRIGGER FUNCTION FOR NEW USERS
-- -----------------------------------------------------------------------------

-- Update the handle_new_user function to use first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    raw_name TEXT;
    fname TEXT;
    lname TEXT;
BEGIN
    raw_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'first_name',
        split_part(NEW.email, '@', 1)
    );
    
    -- Extract first_name and last_name from metadata or split full_name
    fname := COALESCE(
        NEW.raw_user_meta_data->>'first_name',
        split_part(raw_name, ' ', 1)
    );
    
    lname := COALESCE(
        NEW.raw_user_meta_data->>'last_name',
        NULLIF(TRIM(SUBSTRING(raw_name FROM POSITION(' ' IN raw_name) + 1)), '')
    );
    
    INSERT INTO public.profiles (
        id, 
        email, 
        first_name, 
        last_name, 
        full_name,
        avatar_url,
        date_of_birth
    )
    VALUES (
        NEW.id,
        NEW.email,
        fname,
        lname,
        raw_name,
        NEW.raw_user_meta_data->>'avatar_url',
        (NEW.raw_user_meta_data->>'date_of_birth')::DATE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 4. CREATE DELETE ACCOUNT FUNCTION (RPC)
-- -----------------------------------------------------------------------------

-- Function to allow users to delete their own account
-- This is needed because client-side cannot delete auth.users directly
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS VOID AS $$
BEGIN
    -- Delete from auth.users (this will cascade to profiles due to FK)
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. ADD INDEX FOR NEW COLUMNS
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON public.profiles(first_name);

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
