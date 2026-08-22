-- =============================================================================
-- HeartNote — Consolidated Local Postgres Schema
-- Replaces Supabase (auth.users, RLS, triggers, RPCs) with plain Postgres +
-- Prisma + NextAuth (Auth.js v5). Business logic that used to live in DB
-- triggers/RPCs (handle_new_user, handle_new_creation_quota,
-- increment_template_uses, handle_password_change, check_banned_user,
-- redeem_love_coupon, enforce_creation_*) is reimplemented at the app layer —
-- see prisma/ and src/lib/auth/. This file is pure DDL + seed data.
--
-- RLS is intentionally NOT ported: Supabase RLS relies on PostgREST setting a
-- per-request Postgres role (auth.uid()/auth.role()); Prisma runs as a single
-- app-level DB role, so row-level authorization moves to the app (server
-- actions / auth() checks), matching what protectedAction() already enforced
-- on top of RLS.
--
-- Reconciled against the LIVE Supabase project (ref gdpkvnfmqezniilweefh) as
-- ground truth where it disagreed with the migration files under
-- supabase/migrations/, since several migrations (020, 021, the "-interactive"
-- template seed) were never actually applied there. Notable resolutions:
--   - profiles.subscription_tier CHECK includes 'lite' (live-confirmed; the
--     migration files never widened it past free/premium, but subscription_
--     policies and the quota trigger both treat 'lite' as real).
--   - creations.is_published / has_watermark columns dropped: migrations 020/
--     021 added them, but live doesn't have them and app code never reads/
--     writes them as real columns — has_watermark is stored inside the
--     `metadata` JSONB blob instead (see actions/creations/helpers/
--     persistCreation.ts). Not reimplemented.
--   - password_reset_attempts kept even though absent live: actions/
--     password.ts depends on it and its shape (migration 017) is unambiguous.
--   - drafts table added (live-only, never migrated): minimal shape inferred
--     from draftServices.ts / draftActions.ts usage, confirmed against live.
--   - The dead "pages" feature (user_pages/user_actions and their orphaned
--     functions: cleanup_old_drafts, generate_route_slug, get_public_page,
--     handle_new_page, increment_page_view, log_action) is excluded — those
--     tables were dropped in migration 005 and the functions are unused by
--     any current app code.
--   - Storage buckets (card-assets, greeting-images, image_steamy_Window) are
--     not modeled here at all: none are referenced by any real app code path
--     (the only upload feature that existed pointed at a bucket —
--     image_steamy_Window — that was never provisioned) and that dead feature
--     has been deleted from the app per product decision.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. AUTH TABLES (NextAuth / Auth.js v5 + Prisma Adapter shape)
-- =============================================================================

CREATE TABLE public.users (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT,
    email          TEXT        NOT NULL UNIQUE,
    email_verified TIMESTAMPTZ,
    image          TEXT,
    password_hash  TEXT,       -- NULL for OAuth-only (Google) users
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.accounts (
    id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type                TEXT    NOT NULL,
    provider            TEXT    NOT NULL,
    provider_account_id TEXT    NOT NULL,
    refresh_token       TEXT,
    access_token        TEXT,
    expires_at          INTEGER,
    token_type          TEXT,
    scope               TEXT,
    id_token            TEXT,
    session_state       TEXT,
    UNIQUE (provider, provider_account_id)
);

CREATE INDEX idx_accounts_user_id ON public.accounts (user_id);

-- Hand-rolled email-verification / password-reset tokens (Credentials
-- provider has no built-in flow for either — NextAuth's own VerificationToken
-- model is only auto-used by the Email/passwordless provider, which we don't
-- use). Tokens are stored hashed; the raw token only ever exists in the email.
CREATE TABLE public.verification_tokens (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier  TEXT        NOT NULL, -- email address
    token_hash  TEXT        NOT NULL,
    type        TEXT        NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
    expires_at  TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_verification_tokens_lookup ON public.verification_tokens (identifier, type, consumed_at);
CREATE UNIQUE INDEX idx_verification_tokens_hash ON public.verification_tokens (token_hash);

-- =============================================================================
-- 2. APPLICATION TABLES
-- =============================================================================

CREATE TABLE public.profiles (
    id                       UUID        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    email                    TEXT,
    first_name               TEXT,
    last_name                TEXT,
    date_of_birth            DATE,
    avatar_url               TEXT,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ,
    subscription_tier        TEXT        NOT NULL DEFAULT 'free'
                                         CHECK (subscription_tier IN ('free', 'lite', 'premium')),
    creations_count_free     INT         NOT NULL DEFAULT 0,
    creations_count_pro      INT         NOT NULL DEFAULT 0,
    additional_creation_free INT         NOT NULL DEFAULT 0,
    additional_creation_pro  INT         NOT NULL DEFAULT 0,
    premium_start            TIMESTAMP,
    premium_expiry           TIMESTAMP,
    reset_attempts           INT         NOT NULL DEFAULT 0,
    is_blocked               BOOLEAN     NOT NULL DEFAULT false
);

CREATE INDEX idx_profiles_email        ON public.profiles (email);
CREATE INDEX idx_profiles_subscription ON public.profiles (subscription_tier);
CREATE INDEX idx_profiles_first_name   ON public.profiles (first_name);

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

CREATE TABLE public.creations (
    id                UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID      NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id       UUID      NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    metadata          JSONB,
    is_paid           BOOLEAN,
    expires_at        TIMESTAMP,
    is_deleted        BOOLEAN   NOT NULL DEFAULT false,
    created_at        TIMESTAMP NOT NULL DEFAULT now(),
    verification_code TEXT      NOT NULL CHECK (verification_code ~ '^[0-9]{4}$')
);

CREATE INDEX idx_creations_user_id     ON public.creations (user_id);
CREATE INDEX idx_creations_template_id ON public.creations (template_id);
CREATE INDEX idx_creations_expires_at  ON public.creations (expires_at);

CREATE TABLE public.subscription_policies (
    tier_code      TEXT PRIMARY KEY,
    creation_limit INT,
    default_expiry INT -- seconds
);

CREATE TABLE public.banned_users (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email     TEXT        NOT NULL UNIQUE,
    reason    TEXT        NOT NULL DEFAULT 'self_deletion',
    banned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_banned_users_email ON public.banned_users (email);

CREATE TABLE public.password_reset_attempts (
    id         BIGSERIAL   PRIMARY KEY,
    email      TEXT        NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pra_email_created ON public.password_reset_attempts (email, created_at DESC);

CREATE TABLE public.audit_logs (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT        NOT NULL CHECK (event_type IN (
                               'user.registered', 'user.password_reset_requested',
                               'user.account_deleted', 'user.profile_updated',
                               'user.name_changed', 'creation.created',
                               'subscription.purchased'
                           )),
    metadata   JSONB       NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_created  ON public.audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_logs_event_created ON public.audit_logs (event_type, created_at DESC);

-- Guest drafts saved before OAuth login so in-progress work survives the
-- redirect round-trip. Write-only from the client's perspective (no SELECT
-- policy existed in Supabase either) — reads only ever happen server-side via
-- the admin/service client in claimGuestDraft().
CREATE TABLE public.drafts (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    metadata   JSONB       NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 3. SEED DATA
-- =============================================================================

INSERT INTO public.subscription_policies (tier_code, creation_limit, default_expiry) VALUES
    ('free',    5,    NULL),
    ('lite',    2,    2592000),
    ('premium', 6,    3888000);

-- Pulled verbatim from the live Supabase project (20 rows) so local dev has
-- the exact same template catalog as production.
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('apology-search', 'חיפוש סליחה', '{רומנטי,משחקים}', 'new', 'f', '{"fields": [{"key": "searchQuery", "type": "text", "label": "שאילתת חיפוש", "required": true, "maxLength": 150}, {"key": "resultTitle", "type": "text", "label": "כותרת תוצאה", "required": true, "maxLength": 80}, {"key": "resultSubtitle", "type": "textarea", "label": "תיאור תוצאה", "maxLength": 200}, {"key": "startButtonLabel", "type": "text", "label": "כפתור התחלה", "maxLength": 40}, {"key": "typingSpeedMs", "type": "number", "label": "מהירות הקלדה (ms)", "default": 80}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('birthday-candles-interactive', 'עוגת יום הולדת אינטראקטיבית', '{"אירועים מיוחדים"}', 'new,interactive,birthday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "recipientAge", "max": 120, "min": 1, "type": "number", "label": "גיל", "required": true}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('date-invite', 'הזמנה לדייט', '{רומנטי}', 'popular', 'f', '{"fields": [{"key": "question", "type": "text", "label": "שאלת ההזמנה", "required": true, "maxLength": 120, "placeholder": "?האם תצאי איתי לדייט"}, {"key": "yesText", "type": "text", "label": "טקסט כפתור כן", "default": "כן", "maxLength": 30, "placeholder": "כן"}, {"key": "noText", "type": "text", "label": "טקסט כפתור לא", "default": "לא", "maxLength": 30, "placeholder": "לא"}, {"key": "successMessage", "type": "text", "label": "הודעת הצלחה", "default": "!יש לנו דייט", "maxLength": 120, "placeholder": "!יש לנו דייט"}, {"key": "backgroundImage", "type": "image_url", "label": "תמונת רקע", "accept": "image/jpeg,image/png,image/webp"}, {"key": "primaryColor", "type": "color", "label": "צבע כפתורים", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '27');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('decision-wheel', 'גלגל ההחלטות', '{משחקים}', 'popular', 'f', '{"fields": [{"key": "options", "type": "array", "label": "אפשרויות בגלגל", "itemType": "text", "maxItems": 8, "minItems": 2, "required": true, "placeholder": "אפשרות…"}, {"key": "title", "type": "text", "label": "כותרת", "maxLength": 60, "placeholder": "גלגל ההחלטות"}, {"key": "subtitle", "type": "text", "label": "כותרת משנה", "maxLength": 80, "placeholder": "סובבו וגלו!"}, {"key": "primaryColor", "type": "color", "label": "צבע כפתור סיבוב", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '6');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('excuse-generator', 'מכונת התירוצים', '{משחקים}', 'new', 'f', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 60}, {"key": "subtitle", "type": "text", "label": "כותרת משנה", "maxLength": 120}, {"key": "excuses", "type": "options", "label": "תירוצים (3-20)", "required": true}, {"key": "buttonLabel", "type": "text", "label": "טקסט כפתור", "maxLength": 40}, {"key": "disclaimer", "type": "textarea", "label": "כתב ויתור", "maxLength": 200}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('holiday-hanukkah-interactive', 'חנוכה אינטראקטיבי', '{חגים}', 'new,interactive,holiday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "signature", "type": "text", "label": "חתימה", "maxLength": 70}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('holiday-passover-interactive', 'פסח אינטראקטיבי', '{חגים}', 'new,interactive,holiday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "signature", "type": "text", "label": "חתימה", "maxLength": 70}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('holiday-purim-interactive', 'פורים אינטראקטיבי', '{חגים}', 'new,interactive,holiday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "signature", "type": "text", "label": "חתימה", "maxLength": 70}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('holiday-rosh-hashanah-interactive', 'ראש השנה אינטראקטיבי', '{חגים}', 'new,interactive,holiday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('holiday-shavuot-interactive', 'שבועות אינטראקטיבי', '{חגים}', 'new,interactive,holiday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "signature", "type": "text", "label": "חתימה", "maxLength": 70}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('holiday-sukkot-interactive', 'סוכות אינטראקטיבי', '{חגים}', 'new,interactive,holiday', 't', '{"fields": [{"key": "recipientName", "type": "text", "label": "שם המקבל/ת", "required": true, "maxLength": 50}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 50}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 70}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 500}, {"key": "signature", "type": "text", "label": "חתימה", "maxLength": 70}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('love-coupons', 'קופונים מיוחדים', '{רומנטי}', NULL, 't', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 60, "placeholder": "קופונים מיוחדים"}, {"key": "coupons", "type": "array", "label": "קופונים", "itemType": "object", "maxItems": 12, "minItems": 1, "required": true, "itemSchema": {"id": {"type": "auto_uuid"}, "icon": {"type": "text", "label": "אימוג׳י", "default": "🎁", "maxLength": 4}, "color": {"type": "select", "label": "צבע", "options": ["emerald", "sky", "amber", "rose", "violet", "orange"]}, "title": {"type": "text", "label": "כותרת קופון", "required": true, "maxLength": 60}, "description": {"type": "textarea", "label": "תיאור", "maxLength": 200}}}, {"key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '8');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('open-when', 'מכתבים מיוחדים', '{רומנטי,"אירועים מיוחדים"}', 'new', 't', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 60, "placeholder": "מכתבים מיוחדים"}, {"key": "envelopes", "type": "array", "label": "מכתבים", "itemType": "object", "maxItems": 12, "minItems": 1, "required": true, "itemSchema": {"id": {"type": "auto_uuid"}, "color": {"type": "select", "label": "צבע", "options": ["rose", "sky", "amber", "violet", "emerald", "orange"]}, "emoji": {"type": "text", "label": "אימוג׳י", "default": "💌", "maxLength": 4}, "title": {"type": "text", "label": "כותרת (כשאת/ה…)", "required": true, "maxLength": 60}, "content": {"type": "textarea", "label": "תוכן המכתב", "required": true, "maxLength": 1000}, "dateOpen": {"type": "date", "label": "תאריך פתיחה"}}}, {"key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 2, "paid_days": 14}'::jsonb, '3');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('punching-bag', 'שק האיגרוף', '{משחקים}', 'new', 'f', '{"fields": [{"key": "introTitle", "type": "text", "label": "כותרת פתיחה", "maxLength": 60}, {"key": "introSubtitle", "type": "text", "label": "תת-כותרת", "maxLength": 120}, {"key": "hitsRequired", "max": 20, "min": 1, "type": "number", "label": "מספר מכות נדרשות", "required": true}, {"key": "hitInstructions", "type": "text", "label": "הוראות הכאה", "maxLength": 80}, {"key": "resultTitle", "type": "text", "label": "כותרת תוצאה", "maxLength": 60}, {"key": "resultMessage", "type": "textarea", "label": "הודעת סיום", "required": true, "maxLength": 400}, {"key": "bagColor", "type": "color", "label": "צבע השק", "default": "#d4826f"}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '0');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('relationship-quiz', 'חידון חברות', '{משחקים}', NULL, 't', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 60, "placeholder": "כמה את/ה מכיר/ה אותי?"}, {"key": "questions", "type": "array", "label": "שאלות", "itemType": "object", "maxItems": 20, "minItems": 1, "required": true, "itemSchema": {"id": {"type": "auto_uuid"}, "options": {"type": "array", "label": "תשובות", "itemType": "text", "maxItems": 6, "minItems": 2}, "question": {"type": "text", "label": "שאלה", "required": true, "maxLength": 150}, "correctIndex": {"min": 0, "type": "number", "label": "אינדקס תשובה נכונה"}}}, {"key": "scoreMessages", "type": "array", "label": "הודעות לפי ציון", "itemType": "object", "maxItems": 5, "minItems": 1, "itemSchema": {"message": {"type": "text", "label": "הודעה", "maxLength": 120}, "minScore": {"max": 100, "min": 0, "type": "number", "label": "ציון מינימלי"}}}, {"key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '4');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('scratch-card', 'גרד וגלה', '{משחקים}', 'popular', 'f', '{"fields": [{"key": "prizeContent", "type": "textarea", "label": "תוכן ההפתעה", "required": true, "maxLength": 200, "placeholder": "כתוב/י את ההפתעה שתתגלה…"}, {"key": "title", "type": "text", "label": "כותרת", "maxLength": 60, "placeholder": "גרד וגלה את ההפתעה"}, {"key": "primaryColor", "type": "color", "label": "צבע מודגש", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 2, "paid_days": 14}'::jsonb, '20');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('slot-machine', 'מכונת ההבטחות', '{משחקים}', 'new', 'f', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 60}, {"key": "subtitle", "type": "text", "label": "כותרת משנה", "maxLength": 120}, {"key": "reel1Options", "type": "array", "label": "אפשרויות גלגל 1", "itemType": "text", "maxItems": 8, "minItems": 2, "required": true}, {"key": "reel2Options", "type": "array", "label": "אפשרויות גלגל 2", "itemType": "text", "maxItems": 8, "minItems": 2, "required": true}, {"key": "reel3Options", "type": "array", "label": "אפשרויות גלגל 3", "itemType": "text", "maxItems": 8, "minItems": 2, "required": true}, {"key": "targetReel1", "type": "text", "label": "תוצאה סופית 1", "required": true, "maxLength": 40}, {"key": "targetReel2", "type": "text", "label": "תוצאה סופית 2", "required": true, "maxLength": 40}, {"key": "targetReel3", "type": "text", "label": "תוצאה סופית 3", "required": true, "maxLength": 40}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '1');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('surprise-gift', 'מתנה בהפתעה', '{"אירועים מיוחדים",רומנטי}', 'new', 'f', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 80, "placeholder": "יש לך הפתעה! 🎁"}, {"key": "greeting", "type": "textarea", "label": "ברכה / הודעה", "required": true, "maxLength": 500, "placeholder": "הטקסט שייחשף אחרי הפתיחה"}, {"key": "boxColor", "type": "color", "label": "צבע קופסה", "default": "#e74c5e"}, {"key": "ribbonColor", "type": "color", "label": "צבע סרט", "default": "#ffd700"}, {"key": "clicksRequired", "max": 20, "min": 1, "type": "number", "label": "מספר לחיצות לפתיחה", "default": 5}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '6');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('timeline', 'ציר זמן', '{זיכרונות,רומנטי}', NULL, 't', '{"fields": [{"key": "title", "type": "text", "label": "כותרת", "maxLength": 60, "placeholder": "הסיפור שלנו"}, {"key": "events", "type": "array", "label": "אירועים", "itemType": "object", "maxItems": 20, "minItems": 1, "required": true, "itemSchema": {"id": {"type": "auto_uuid"}, "date": {"type": "date", "label": "תאריך", "required": true}, "icon": {"type": "text", "label": "אימוג׳י", "default": "💖", "maxLength": 4}, "title": {"type": "text", "label": "כותרת", "required": true, "maxLength": 80}, "description": {"type": "textarea", "label": "תיאור", "maxLength": 300}}}, {"key": "primaryColor", "type": "color", "label": "צבע ציר", "default": "#d4826f"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 14}'::jsonb, '6');
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses) VALUES ('wedding-glass-interactive', 'חתונה אינטראקטיבית', '{חתונה}', 'new,interactive,wedding', 't', '{"fields": [{"key": "coupleNames", "type": "text", "label": "שמות הזוג", "required": true, "maxLength": 42}, {"key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 36}, {"key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 48}, {"key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 260}, {"key": "primaryColor", "type": "color", "label": "צבע ראשי"}]}'::jsonb, 't', '{"free_days": 1, "paid_days": 30}'::jsonb, '0');

-- =============================================================================
-- Done ✓ — HeartNote local Postgres schema ready
-- =============================================================================
