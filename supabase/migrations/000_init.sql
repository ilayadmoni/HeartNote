-- =============================================================================
-- HeartNote – Consolidated Database Schema (Final State)
-- Generated: 2026-03-02
--
-- This single file represents the final state after all migrations (001–019).
-- Run this on a FRESH Supabase project to initialise the database.
--
-- Tables: profiles, templates, creations, subscription_policies,
--         banned_users, password_reset_attempts
-- Storage: card-assets, greeting-images
-- =============================================================================


-- =============================================================================
-- 0. CLEANUP (safe for fresh DB – uses IF EXISTS)
-- =============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created          ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_check_ban        ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_password_change             ON auth.users CASCADE;
DROP TRIGGER IF EXISTS set_profiles_updated_at        ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS trg_handle_new_creation_quota  ON public.creations CASCADE;
DROP TRIGGER IF EXISTS trigger_increment_template_uses ON public.creations CASCADE;

DROP TABLE IF EXISTS public.creations               CASCADE;
DROP TABLE IF EXISTS public.templates               CASCADE;
DROP TABLE IF EXISTS public.profiles                CASCADE;
DROP TABLE IF EXISTS public.subscription_policies   CASCADE;
DROP TABLE IF EXISTS public.banned_users            CASCADE;
DROP TABLE IF EXISTS public.password_reset_attempts  CASCADE;
DROP TABLE IF EXISTS public.user_pages              CASCADE;
DROP TABLE IF EXISTS public.user_actions            CASCADE;

DROP TYPE IF EXISTS subscription_type CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user()             CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at()           CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_creation_quota()   CASCADE;
DROP FUNCTION IF EXISTS public.increment_template_uses()     CASCADE;
DROP FUNCTION IF EXISTS public.handle_password_change()      CASCADE;
DROP FUNCTION IF EXISTS public.check_banned_user()           CASCADE;
DROP FUNCTION IF EXISTS public.generate_slug()               CASCADE;
DROP FUNCTION IF EXISTS public.delete_user_account()         CASCADE;


-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- 2. TABLES (ordered by FK dependencies)
-- =============================================================================

-- ─────────────────────────────────────────────
-- 2.1 profiles
-- ─────────────────────────────────────────────
CREATE TABLE public.profiles (
    id                      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email                   TEXT,
    first_name              TEXT,
    last_name               TEXT,
    date_of_birth           DATE,
    avatar_url              TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ,
    subscription_tier       TEXT        NOT NULL DEFAULT 'free'
                                        CHECK (subscription_tier IN ('free', 'premium')),
    creations_count_free    INT         NOT NULL DEFAULT 0,
    creations_count_pro     INT         NOT NULL DEFAULT 0,
    additional_creation_free INT        NOT NULL DEFAULT 0,
    additional_creation_pro  INT        NOT NULL DEFAULT 0,
    premium_start           TIMESTAMP,
    premium_expiry          TIMESTAMP,
    reset_attempts          INT         NOT NULL DEFAULT 0,
    is_blocked              BOOLEAN     NOT NULL DEFAULT false
);

CREATE INDEX idx_profiles_email        ON public.profiles (email);
CREATE INDEX idx_profiles_subscription ON public.profiles (subscription_tier);
CREATE INDEX idx_profiles_first_name   ON public.profiles (first_name);

-- ─────────────────────────────────────────────
-- 2.2 subscription_policies
-- ─────────────────────────────────────────────
CREATE TABLE public.subscription_policies (
    tier_code      TEXT PRIMARY KEY,
    creation_limit INT,
    default_expiry INT          -- seconds
);

-- ─────────────────────────────────────────────
-- 2.3 templates
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
    expiration_policy JSONB,
    uses              INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_templates_uses ON public.templates (uses);

-- ─────────────────────────────────────────────
-- 2.4 creations
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

-- ─────────────────────────────────────────────
-- 2.5 banned_users
-- ─────────────────────────────────────────────
CREATE TABLE public.banned_users (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email      TEXT        NOT NULL UNIQUE,
    reason     TEXT        NOT NULL DEFAULT 'self_deletion',
    banned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banned_users_email ON public.banned_users (email);

-- ─────────────────────────────────────────────
-- 2.6 password_reset_attempts
-- ─────────────────────────────────────────────
CREATE TABLE public.password_reset_attempts (
    id         BIGSERIAL   PRIMARY KEY,
    email      TEXT        NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pra_email_created
    ON public.password_reset_attempts (email, created_at DESC);


-- =============================================================================
-- 3. FUNCTIONS
-- =============================================================================

-- ── 3.1 handle_updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3.2 handle_new_user (final version — uses new column names) ─────────────
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
        creations_count_free
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
        (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
        'free',
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3.3 handle_new_creation_quota (counter-based model) ─────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_creation_quota()
RETURNS TRIGGER AS $$
DECLARE
    v_tier                  TEXT;
    v_count_free            INT;
    v_additional_free       INT;
    v_count_pro             INT;
    v_additional_pro        INT;
    v_policy_limit          INT;
    v_total_allowed         INT;
BEGIN
    -- Lock the profile row to prevent race conditions
    SELECT
        subscription_tier,
        creations_count_free,
        additional_creation_free,
        creations_count_pro,
        additional_creation_pro
    INTO
        v_tier,
        v_count_free,
        v_additional_free,
        v_count_pro,
        v_additional_pro
    FROM public.profiles
    WHERE id = NEW.user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found for user_id %', NEW.user_id;
    END IF;

    -- ── Free tier ──────────────────────────────────────────────────
    IF v_tier = 'free' THEN
        SELECT creation_limit
        INTO v_policy_limit
        FROM public.subscription_policies
        WHERE tier_code = 'free';

        v_policy_limit := COALESCE(v_policy_limit, 3);
        v_total_allowed := v_policy_limit + COALESCE(v_additional_free, 0);

        IF v_count_free >= v_total_allowed THEN
            RAISE EXCEPTION 'Insufficient creations quota';
        END IF;

        UPDATE public.profiles
        SET creations_count_free = creations_count_free + 1
        WHERE id = NEW.user_id;

        RETURN NEW;
    END IF;

    -- ── Premium / Pro tier ─────────────────────────────────────────
    IF v_tier IN ('premium', 'pro') THEN
        UPDATE public.profiles
        SET creations_count_pro = creations_count_pro + 1
        WHERE id = NEW.user_id;

        RETURN NEW;
    END IF;

    -- ── Unknown tier — deny ────────────────────────────────────────
    RAISE EXCEPTION 'Insufficient creations quota';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3.4 increment_template_uses ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_template_uses()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.templates
    SET uses = uses + 1
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3.5 handle_password_change ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_attempts INTEGER;
BEGIN
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

-- ── 3.6 check_banned_user ───────────────────────────────────────────────────
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


-- =============================================================================
-- 4. TRIGGERS
-- =============================================================================

-- Auto-create profile on sign-up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Block banned emails from re-registering
CREATE TRIGGER on_auth_user_check_ban
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_banned_user();

-- Track password changes
CREATE TRIGGER on_password_change
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_password_change();

-- Auto-update updated_at on profiles
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Quota check before new creation
CREATE TRIGGER trg_handle_new_creation_quota
    BEFORE INSERT ON public.creations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_creation_quota();

-- Increment template usage counter
CREATE TRIGGER trigger_increment_template_uses
    AFTER INSERT ON public.creations
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_template_uses();


-- =============================================================================
-- 5. ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- ── 5.1 profiles ────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING  (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    TO service_role
    WITH CHECK (true);

-- ── 5.2 templates ───────────────────────────────────────────────────────────
CREATE POLICY "Templates are viewable by everyone"
    ON public.templates FOR SELECT
    USING (true);

-- ── 5.3 creations ───────────────────────────────────────────────────────────
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

CREATE POLICY "Anyone can view non-deleted creations by id"
    ON public.creations FOR SELECT
    USING (is_deleted = false);

-- ── 5.4 subscription_policies ───────────────────────────────────────────────
CREATE POLICY "Subscription policies are viewable by everyone"
    ON public.subscription_policies FOR SELECT
    USING (true);

-- ── 5.5 banned_users (no policies = service-role only) ──────────────────────

-- ── 5.6 password_reset_attempts (no policies = service-role only) ────────────


-- =============================================================================
-- 6. STORAGE BUCKETS
-- =============================================================================

-- card-assets (user-uploaded images for cards)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'card-assets',
    'card-assets',
    true,
    2097152,  -- 2 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- greeting-images (user-uploaded greeting images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'greeting-images',
    'greeting-images',
    true,
    5242880,  -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS: card-assets ────────────────────────────────────────────────
DROP POLICY IF EXISTS "card_assets_select_public" ON storage.objects;
CREATE POLICY "card_assets_select_public"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'card-assets');

DROP POLICY IF EXISTS "card_assets_insert_auth" ON storage.objects;
CREATE POLICY "card_assets_insert_auth"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'card-assets'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'uploads'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );

DROP POLICY IF EXISTS "card_assets_update_own" ON storage.objects;
CREATE POLICY "card_assets_update_own"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'card-assets'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );

DROP POLICY IF EXISTS "card_assets_delete_own" ON storage.objects;
CREATE POLICY "card_assets_delete_own"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'card-assets'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );

-- ── Storage RLS: greeting-images ────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read greeting images" ON storage.objects;
CREATE POLICY "Public read greeting images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'greeting-images');

DROP POLICY IF EXISTS "Authenticated upload greeting images" ON storage.objects;
CREATE POLICY "Authenticated upload greeting images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'greeting-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users delete own greeting images" ON storage.objects;
CREATE POLICY "Users delete own greeting images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'greeting-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );


-- =============================================================================
-- 7. GRANTS
-- =============================================================================

GRANT SELECT ON public.banned_users TO authenticated;
GRANT SELECT ON public.banned_users TO anon;
GRANT USAGE ON SEQUENCE public.password_reset_attempts_id_seq TO authenticated;
GRANT SELECT, INSERT ON public.password_reset_attempts TO authenticated;


-- =============================================================================
-- 8. SEED DATA
-- =============================================================================

-- ── 8.1 Templates ───────────────────────────────────────────────────────────

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy)
VALUES

-- 1. Steamy Window
(
    'steamy-window',
    'חלון עם אדים',
    ARRAY['רומנטי'],
    'popular',
    false,
    '{
        "fields": [
            { "key": "revealMessage", "type": "textarea", "label": "הודעה נסתרת", "placeholder": "כתוב/י את ההודעה שתתגלה…", "maxLength": 200, "required": true },
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "חלון מאודה", "maxLength": 60 },
            { "key": "emoji", "type": "text", "label": "אימוג׳י", "placeholder": "💖", "maxLength": 4 },
            { "key": "background_image", "type": "image_url", "label": "תמונת רקע", "accept": "image/jpeg,image/png,image/webp" },
            { "key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 2. Decision Wheel
(
    'decision-wheel',
    'גלגל ההחלטות',
    ARRAY['משחקים'],
    'popular',
    true,
    '{
        "fields": [
            { "key": "options", "type": "array", "label": "אפשרויות בגלגל", "minItems": 2, "maxItems": 8, "itemType": "text", "placeholder": "אפשרות…", "required": true },
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "גלגל ההחלטות", "maxLength": 60 },
            { "key": "subtitle", "type": "text", "label": "כותרת משנה", "placeholder": "סובבו וגלו!", "maxLength": 80 },
            { "key": "primaryColor", "type": "color", "label": "צבע כפתור סיבוב", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 3. Date Invite
(
    'date-invite',
    'הזמנה לדייט',
    ARRAY['רומנטי'],
    'new',
    false,
    '{
        "fields": [
            { "key": "question", "type": "text", "label": "שאלת ההזמנה", "placeholder": "?האם תצאי איתי לדייט", "maxLength": 120, "required": true },
            { "key": "yesText", "type": "text", "label": "טקסט כפתור כן", "placeholder": "כן", "maxLength": 30, "default": "כן" },
            { "key": "noText", "type": "text", "label": "טקסט כפתור לא", "placeholder": "לא", "maxLength": 30, "default": "לא" },
            { "key": "successMessage", "type": "text", "label": "הודעת הצלחה", "placeholder": "!יש לנו דייט", "maxLength": 120, "default": "!יש לנו דייט" },
            { "key": "backgroundImage", "type": "image_url", "label": "תמונת רקע", "accept": "image/jpeg,image/png,image/webp" },
            { "key": "primaryColor", "type": "color", "label": "צבע כפתורים", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 4. Scratch Card
(
    'scratch-card',
    'גרד וגלה',
    ARRAY['משחקים'],
    null,
    false,
    '{
        "fields": [
            { "key": "prizeContent", "type": "textarea", "label": "תוכן ההפתעה", "placeholder": "כתוב/י את ההפתעה שתתגלה…", "maxLength": 200, "required": true },
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "גרד וגלה את ההפתעה", "maxLength": 60 },
            { "key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 5. Timeline
(
    'timeline',
    'ציר זמן',
    ARRAY['זיכרונות'],
    null,
    true,
    '{
        "fields": [
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "הסיפור שלנו", "maxLength": 60 },
            {
                "key": "events", "type": "array", "label": "אירועים", "minItems": 1, "maxItems": 20, "itemType": "object",
                "itemSchema": {
                    "id": { "type": "auto_uuid" },
                    "date": { "type": "date", "label": "תאריך", "required": true },
                    "title": { "type": "text", "label": "כותרת", "maxLength": 80, "required": true },
                    "description": { "type": "textarea", "label": "תיאור", "maxLength": 300 },
                    "icon": { "type": "text", "label": "אימוג׳י", "maxLength": 4, "default": "💖" }
                },
                "required": true
            },
            { "key": "primaryColor", "type": "color", "label": "צבע ציר", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 6. Love Coupons
(
    'love-coupons',
    'קופונים מיוחדים',
    ARRAY['רומנטי'],
    null,
    false,
    '{
        "fields": [
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "קופונים מיוחדים", "maxLength": 60 },
            {
                "key": "coupons", "type": "array", "label": "קופונים", "minItems": 1, "maxItems": 12, "itemType": "object",
                "itemSchema": {
                    "id": { "type": "auto_uuid" },
                    "title": { "type": "text", "label": "כותרת קופון", "maxLength": 60, "required": true },
                    "description": { "type": "textarea", "label": "תיאור", "maxLength": 200 },
                    "icon": { "type": "text", "label": "אימוג׳י", "maxLength": 4, "default": "🎁" },
                    "color": { "type": "select", "label": "צבע", "options": ["emerald","sky","amber","rose","violet","orange"] }
                },
                "required": true
            },
            { "key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 7. Relationship Quiz
(
    'relationship-quiz',
    'חידון זוגיות',
    ARRAY['משחקים'],
    null,
    true,
    '{
        "fields": [
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "כמה את/ה מכיר/ה אותי?", "maxLength": 60 },
            {
                "key": "questions", "type": "array", "label": "שאלות", "minItems": 1, "maxItems": 20, "itemType": "object",
                "itemSchema": {
                    "id": { "type": "auto_uuid" },
                    "question": { "type": "text", "label": "שאלה", "maxLength": 150, "required": true },
                    "options": { "type": "array", "label": "תשובות", "minItems": 2, "maxItems": 6, "itemType": "text" },
                    "correctIndex": { "type": "number", "label": "אינדקס תשובה נכונה", "min": 0 }
                },
                "required": true
            },
            {
                "key": "scoreMessages", "type": "array", "label": "הודעות לפי ציון", "minItems": 1, "maxItems": 5, "itemType": "object",
                "itemSchema": {
                    "minScore": { "type": "number", "label": "ציון מינימלי", "min": 0, "max": 100 },
                    "message": { "type": "text", "label": "הודעה", "maxLength": 120 }
                }
            },
            { "key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 8. Open When
(
    'open-when',
    'מכתבים מיוחדים',
    ARRAY['רומנטי', 'משפחה וחברים'],
    'new',
    false,
    '{
        "fields": [
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "מכתבים מיוחדים", "maxLength": 60 },
            {
                "key": "envelopes", "type": "array", "label": "מכתבים", "minItems": 1, "maxItems": 12, "itemType": "object",
                "itemSchema": {
                    "id": { "type": "auto_uuid" },
                    "title": { "type": "text", "label": "כותרת (כשאת/ה…)", "maxLength": 60, "required": true },
                    "content": { "type": "textarea", "label": "תוכן המכתב", "maxLength": 1000, "required": true },
                    "emoji": { "type": "text", "label": "אימוג׳י", "maxLength": 4, "default": "💌" },
                    "dateOpen": { "type": "date", "label": "תאריך פתיחה" },
                    "color": { "type": "select", "label": "צבע", "options": ["rose","sky","amber","violet","emerald","orange"] }
                },
                "required": true
            },
            { "key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- 9. Surprise Gift
(
    'surprise-gift',
    'מתנה בהפתעה',
    ARRAY['יום הולדת', 'רומנטי', 'משחקים'],
    'new',
    true,
    '{
        "fields": [
            { "key": "title", "type": "text", "label": "כותרת", "placeholder": "יש לך הפתעה! 🎁", "maxLength": 80 },
            { "key": "greeting", "type": "textarea", "label": "ברכה / הודעה", "placeholder": "הטקסט שייחשף אחרי הפתיחה", "maxLength": 500, "required": true },
            { "key": "boxColor", "type": "color", "label": "צבע קופסה", "default": "#e74c5e" },
            { "key": "ribbonColor", "type": "color", "label": "צבע סרט", "default": "#ffd700" },
            { "key": "clicksRequired", "type": "number", "label": "מספר לחיצות לפתיחה", "default": 5, "min": 1, "max": 20 },
            { "key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f" }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
);

-- ── 8.2 Subscription Policies ───────────────────────────────────────────────

INSERT INTO public.subscription_policies (tier_code, creation_limit, default_expiry)
VALUES
    ('free',    2,    86400),    -- 2 creations, 1 day expiry
    ('lite',    8,    259200),   -- 8 creations, 3 days expiry
    ('premium', NULL, 1209600); -- unlimited,   14 days expiry


-- =============================================================================
-- 9. COMMENTS
-- =============================================================================

COMMENT ON COLUMN public.templates.uses IS 'Tracks total number of times this template has been used by all users';
COMMENT ON FUNCTION public.increment_template_uses() IS 'Automatically increments template uses on new creation INSERT';
COMMENT ON TRIGGER trigger_increment_template_uses ON public.creations IS 'Maintains accurate usage count for templates';


-- =============================================================================
-- Done ✓  –  HeartNote production schema ready
-- =============================================================================
