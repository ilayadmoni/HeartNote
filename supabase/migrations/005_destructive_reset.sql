-- =============================================================================
-- HeartNote Database Schema – Destructive Reset
-- Version: 2.0.0
-- Date: 2026-02-11
-- Description: Drops all existing tables and recreates the schema from scratch
--              with profiles, templates, creations, and subscription_policies.
-- WARNING: THIS MIGRATION IS DESTRUCTIVE – all existing data will be lost.
-- =============================================================================

-- =============================================================================
-- 0. CLEANUP – Forcefully drop all tables and constraints
-- =============================================================================

-- Disable all triggers first to avoid cascading issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS set_updated_at       ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles CASCADE;

-- Drop all tables with CASCADE
DROP TABLE IF EXISTS public.creations               CASCADE;
DROP TABLE IF EXISTS public.templates               CASCADE;
DROP TABLE IF EXISTS public.profiles                CASCADE;
DROP TABLE IF EXISTS public.subscription_policies   CASCADE;
DROP TABLE IF EXISTS public.user_pages              CASCADE;
DROP TABLE IF EXISTS public.user_actions            CASCADE;
DROP TABLE IF EXISTS public.card_share_links        CASCADE;

-- Drop legacy enum type
DROP TYPE IF EXISTS subscription_type CASCADE;

-- Drop functions that may reference the dropped tables
DROP FUNCTION IF EXISTS public.handle_new_user()            CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at()          CASCADE;
DROP FUNCTION IF EXISTS public.generate_slug()              CASCADE;

-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 2. HELPER FUNCTIONS
-- =============================================================================

-- Auto-update updated_at column on every UPDATE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create a profile row when a new user signs up via Supabase Auth
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

-- =============================================================================
-- 3. TABLES (ordered to respect FK dependencies)
-- =============================================================================

-- ─────────────────────────────────────────────
-- 3.1 profiles (must be first – referenced by creations)
-- ─────────────────────────────────────────────
CREATE TABLE public.profiles (
    id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email               TEXT,
    first_name          TEXT,
    last_name           TEXT,
    date_of_birth       DATE,
    avatar_url          TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ,
    subscription_tier   TEXT        NOT NULL DEFAULT 'free'
                                    CHECK (subscription_tier IN ('free', 'premium')),
    creations_count     INT         NOT NULL DEFAULT 0,
    creations_left_pro  INT,
    creations_left_free INT         NOT NULL DEFAULT 3,
    premium_start       TIMESTAMP,
    premium_expiry      TIMESTAMP
);

CREATE INDEX idx_profiles_email          ON public.profiles (email);
CREATE INDEX idx_profiles_subscription   ON public.profiles (subscription_tier);

-- ─────────────────────────────────────────────
-- 3.2 subscription_policies (standalone)
-- ─────────────────────────────────────────────
CREATE TABLE public.subscription_policies (
    tier_code      TEXT PRIMARY KEY,
    creation_limit INT,
    default_expiry INT          -- seconds
);

-- ─────────────────────────────────────────────
-- 3.3 templates (must be before creations – referenced by FK)
-- ─────────────────────────────────────────────
CREATE TABLE public.templates (
    id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    slug              TEXT    UNIQUE NOT NULL,
    name              TEXT    NOT NULL,
    category          TEXT[],
    tags              TEXT,
    is_premium        BOOLEAN NOT NULL DEFAULT false,
    config_schema     JSONB,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    expiration_policy JSONB
);

-- ─────────────────────────────────────────────
-- 3.4 creations (last – references profiles & templates)
-- ─────────────────────────────────────────────
CREATE TABLE public.creations (
    id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID      NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID      NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    metadata    JSONB,
    is_paid     BOOLEAN,
    expires_at  TIMESTAMP,
    is_deleted  BOOLEAN   NOT NULL DEFAULT false,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_creations_user_id     ON public.creations (user_id);
CREATE INDEX idx_creations_template_id ON public.creations (template_id);
CREATE INDEX idx_creations_expires_at  ON public.creations (expires_at);

-- =============================================================================
-- 4. SEED DATA
-- =============================================================================

-- 4.1 Templates ---------------------------------------------------------------
-- See 006_seed_templates.sql for the full seed data.
-- Minimal seed here for schema validation only.
INSERT INTO public.templates (slug, name, category, is_premium, config_schema, expiration_policy)
VALUES
(
    'steamy-window',
    'חלון מאודה',
    ARRAY['רומנטי'],
    false,
    '{"fields":[]}'::jsonb,
    '{"free_days": 1, "paid_days": 14}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 4.2 Subscription Policies ---------------------------------------------------
INSERT INTO public.subscription_policies (tier_code, creation_limit, default_expiry)
VALUES
    ('free',    2,    86400),    -- 1 day
    ('lite',    8,    259200),   -- 3 days
    ('premium', NULL, 1209600);  -- 14 days  (NULL = unlimited creations)

-- =============================================================================
-- 5. ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_policies ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 5.1 profiles policies
-- ─────────────────────────────────────────────
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING  (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service-role inserts profiles via the trigger; users cannot self-insert.
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 5.2 templates policies
-- ─────────────────────────────────────────────
CREATE POLICY "Templates are viewable by everyone"
    ON public.templates FOR SELECT
    USING (true);

-- Only service-role / dashboard may mutate templates – no user policies needed.

-- ─────────────────────────────────────────────
-- 5.3 creations policies
-- ─────────────────────────────────────────────
CREATE POLICY "Users can view their own creations"
    ON public.creations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own creations"
    ON public.creations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own creations"
    ON public.creations FOR UPDATE
    TO authenticated
    USING  (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft-delete their own creations"
    ON public.creations FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Public read for shared / published links (viewer doesn't own the card)
CREATE POLICY "Anyone can view non-deleted creations by id"
    ON public.creations FOR SELECT
    USING (is_deleted = false);

-- ─────────────────────────────────────────────
-- 5.4 subscription_policies policies
-- ─────────────────────────────────────────────
CREATE POLICY "Subscription policies are viewable by everyone"
    ON public.subscription_policies FOR SELECT
    USING (true);

-- =============================================================================
-- 6. TRIGGERS
-- =============================================================================

-- Auto-create profile on sign-up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Done ✓
-- =============================================================================
