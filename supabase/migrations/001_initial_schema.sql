-- =============================================================================
-- HeartNote Database Schema Migration
-- Version: 1.0.0
-- Date: 2026-02-07
-- Description: Clean slate schema using Supabase Auth
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. CUSTOM TYPES
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE subscription_type AS ENUM ('free', 'pro', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate random slug (8 chars)
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 3. TABLES
-- -----------------------------------------------------------------------------

-- =====================
-- 3.1 PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_type subscription_type NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles(subscription_type);

-- =====================
-- 3.2 TEMPLATES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_he TEXT,
    description TEXT,
    description_he TEXT,
    component_key TEXT NOT NULL UNIQUE,
    config_schema JSONB NOT NULL DEFAULT '{}',
    example_data JSONB DEFAULT '{}',
    category TEXT DEFAULT 'general',
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_component_key ON public.templates(component_key);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON public.templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON public.templates(is_premium);

-- =====================
-- 3.3 USER_PAGES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.user_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE RESTRICT,
    route_slug TEXT NOT NULL UNIQUE,
    title TEXT,
    custom_settings JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_pages_user_id ON public.user_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pages_route_slug ON public.user_pages(route_slug);
CREATE INDEX IF NOT EXISTS idx_user_pages_expires_at ON public.user_pages(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_pages_is_deleted ON public.user_pages(is_deleted);

-- =====================
-- 3.4 USER_ACTIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.user_actions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type ON public.user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON public.user_actions(created_at);

-- -----------------------------------------------------------------------------
-- 4. TRIGGERS
-- -----------------------------------------------------------------------------

-- Auto-update updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_templates_updated ON public.templates;
CREATE TRIGGER on_templates_updated
    BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_user_pages_updated ON public.user_pages;
CREATE TRIGGER on_user_pages_updated
    BEFORE UPDATE ON public.user_pages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Templates: Anyone can read active templates
CREATE POLICY "templates_select_public" ON public.templates
    FOR SELECT USING (is_active = TRUE);

-- User Pages: Public can view published non-deleted non-expired
CREATE POLICY "user_pages_select_public" ON public.user_pages
    FOR SELECT USING (
        is_published = TRUE 
        AND is_deleted = FALSE 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- User Pages: Owners can do everything
CREATE POLICY "user_pages_owner_all" ON public.user_pages
    FOR ALL USING (auth.uid() = user_id);

-- User Actions: Users can insert/read their own
CREATE POLICY "user_actions_insert_own" ON public.user_actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_actions_select_own" ON public.user_actions
    FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 6. SEED DATA - Default Templates
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (name, name_he, component_key, is_premium, config_schema, example_data) VALUES
    ('Date Invite', 'הזמנה לדייט', 'DateInvite', FALSE, 
     '{"question": {"type": "text"}, "yesText": {"type": "text"}, "noText": {"type": "text"}}',
     '{"question": "?האם תצא/י איתי לדייט", "yesText": "כן!", "noText": "לא"}'),
    ('Scratch Card', 'כרטיס גירוד', 'ScratchCard', FALSE,
     '{"title": {"type": "text"}, "prize": {"type": "text"}}',
     '{"title": "גרד וגלה", "prize": "🎁 זכית!"}'),
    ('Timeline', 'ציר הזמן שלנו', 'Timeline', TRUE,
     '{"title": {"type": "text"}, "events": {"type": "array"}}',
     '{"title": "הסיפור שלנו", "events": []}'),
    ('Love Coupons', 'קופוני אהבה', 'LoveCoupons', TRUE,
     '{"title": {"type": "text"}, "coupons": {"type": "array"}}',
     '{"title": "קופונים מיוחדים", "coupons": []}'),
    ('Relationship Quiz', 'חידון זוגיות', 'RelationshipQuiz', TRUE,
     '{"title": {"type": "text"}, "questions": {"type": "array"}}',
     '{"title": "כמה את/ה מכיר/ה אותי?", "questions": []}'),
    ('Open When', 'פתח כש...', 'OpenWhen', TRUE,
     '{"title": {"type": "text"}, "envelopes": {"type": "array"}}',
     '{"title": "מכתבים מיוחדים", "envelopes": []}')
ON CONFLICT (component_key) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 7. GRANTS
-- -----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.templates TO authenticated, anon;
GRANT SELECT ON public.user_pages TO authenticated, anon;
GRANT SELECT ON public.user_actions TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_pages TO authenticated;
GRANT INSERT ON public.user_actions TO authenticated;
GRANT USAGE ON SEQUENCE public.user_actions_id_seq TO authenticated;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
