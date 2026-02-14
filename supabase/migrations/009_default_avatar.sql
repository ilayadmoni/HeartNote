-- =============================================================================
-- 009: Default Dicebear Avatar for New Users
-- =============================================================================
-- Updates handle_new_user() to assign a unique Dicebear avatar when
-- the OAuth provider does not supply one.
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
        subscription_tier,
        creations_count,
        creations_left_free
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://api.dicebear.com/9.x/avataaars/svg?seed=' || NEW.id::text
        ),
        'free',
        0,
        3
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
