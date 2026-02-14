-- =============================================================================
-- Migration 011: Fix handle_new_user trigger to include date_of_birth
-- =============================================================================
-- The original trigger (005) did not pass date_of_birth from
-- raw_user_meta_data into the profiles table. This patch adds it.
-- The column already exists as DATE in public.profiles (from 005).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        avatar_url,
        date_of_birth,
        subscription_tier,
        creations_count,
        creations_left_free
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.raw_user_meta_data->>'avatar_url',
        (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
        'free',
        0,
        3
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
