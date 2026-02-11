-- =============================================================================
-- HeartNote Database Schema Migration - Template Policy Refactor
-- Version: 1.2.0
-- Date: 2026-02-11
-- Description: Add per-template subscription policies and expiry configs,
--              seed SteamyWindow and DecisionWheel templates,
--              create card-assets storage bucket.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. STORAGE BUCKET
-- -----------------------------------------------------------------------------
-- Create the public bucket for user-uploaded images (backgrounds, etc.)
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

-- RLS: Anyone can view
DROP POLICY IF EXISTS "card_assets_select_public" ON storage.objects;
CREATE POLICY "card_assets_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'card-assets');

-- RLS: Authenticated users upload into their own folder
DROP POLICY IF EXISTS "card_assets_insert_auth" ON storage.objects;
CREATE POLICY "card_assets_insert_auth"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'card-assets'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'uploads'
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- RLS: Owners can update / delete their own files
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

-- -----------------------------------------------------------------------------
-- 1. ADD NEW COLUMNS TO TEMPLATES TABLE
-- -----------------------------------------------------------------------------

-- allowed_subscriptions: JSONB array of tier strings (not TEXT[])
ALTER TABLE public.templates
ADD COLUMN IF NOT EXISTS allowed_subscriptions JSONB
    NOT NULL DEFAULT '["free", "pro", "premium"]';

-- time_expired_config: per-tier expiry in seconds
ALTER TABLE public.templates
ADD COLUMN IF NOT EXISTS time_expired_config JSONB
    NOT NULL DEFAULT '{"free": 86400, "pro": 172800, "premium": 604800}';

-- thumbnail_url: display image for gallery cards
ALTER TABLE public.templates
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- -----------------------------------------------------------------------------
-- 2. BACK-FILL EXISTING TEMPLATES WITH SENSIBLE DEFAULTS
-- -----------------------------------------------------------------------------

-- Free templates: available to everyone, short expiry for free tier
UPDATE public.templates
SET
    allowed_subscriptions = '["free", "pro", "premium"]',
    time_expired_config   = '{"free": 86400, "pro": 172800, "premium": 604800}'
WHERE is_premium = FALSE
  AND allowed_subscriptions = '["free", "pro", "premium"]';

-- Premium templates: pro + premium only, longer expiry
UPDATE public.templates
SET
    allowed_subscriptions = '["pro", "premium"]',
    time_expired_config   = '{"pro": 259200, "premium": 604800}'
WHERE is_premium = TRUE
  AND allowed_subscriptions = '["free", "pro", "premium"]';

-- -----------------------------------------------------------------------------
-- 3. SEED: SteamyWindow TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order,
    allowed_subscriptions,
    time_expired_config,
    thumbnail_url
) VALUES (
    uuid_generate_v4(),
    'Steamy Window',
    'חלון מאודה',
    'Wipe the steam off a foggy window to reveal a hidden message.',
    'העבירו אצבע על החלון המאודה וגלו את ההודעה הסודית.',
    'SteamyWindow',
    '{
        "title":          { "type": "string",    "label": "כותרת",           "default": "יש לך הודעה..." },
        "revealMessage":  { "type": "string",    "label": "הודעה מוסתרת",    "default": "אני אוהב אותך! ❤️" },
        "emoji":          { "type": "emoji",     "label": "אימוג׳י",         "default": "💖" },
        "background_image": { "type": "image_url", "label": "תמונת רקע",    "optional": true },
        "primaryColor":   { "type": "color",     "label": "צבע ראשי",        "default": "#d4826f" }
    }',
    '{
        "title": "יש לך הודעה...",
        "revealMessage": "אני אוהב אותך! ❤️",
        "emoji": "💖"
    }',
    'romantic',
    ARRAY['רומנטי', 'הפתעה', 'אדים', 'חלון'],
    FALSE,
    8,
    '["free", "pro", "premium"]',
    '{"free": 86400, "pro": 172800, "premium": 604800}',
    'https://api.dicebear.com/7.x/shapes/svg?seed=steamy'
)
ON CONFLICT (component_key)
DO UPDATE SET
    config_schema         = EXCLUDED.config_schema,
    allowed_subscriptions = EXCLUDED.allowed_subscriptions,
    time_expired_config   = EXCLUDED.time_expired_config,
    thumbnail_url         = EXCLUDED.thumbnail_url;

-- -----------------------------------------------------------------------------
-- 4. SEED: WheelOfFortune TEMPLATE  (maps to DecisionWheel component)
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order,
    allowed_subscriptions,
    time_expired_config,
    thumbnail_url
) VALUES (
    uuid_generate_v4(),
    'Wheel of Fortune',
    'גלגל המזל',
    'Spin the wheel and let fate decide! Great for date-night choices.',
    'סובבו את הגלגל ותנו לגורל להחליט! מושלם לערבי דייט.',
    'DecisionWheel',
    '{
        "title":        { "type": "string", "label": "כותרת",        "default": "גלגל ההחלטות" },
        "subtitle":     { "type": "string", "label": "כותרת משנה",   "default": "סובבו וגלו!" },
        "options":      { "type": "array",  "label": "אופציות",      "minItems": 2, "maxItems": 8, "itemType": "string" },
        "primaryColor": { "type": "color",  "label": "צבע ראשי",     "default": "#d4826f" }
    }',
    '{
        "title": "גלגל ההחלטות",
        "subtitle": "לחצו לסיבוב!",
        "options": ["ארוחת ערב", "סרט", "טיול", "משחק", "מסאז׳", "בישול ביחד"]
    }',
    'fun',
    ARRAY['משחק', 'גלגל', 'כיף', 'החלטות'],
    FALSE,
    7,
    '["free", "pro", "premium"]',
    '{"free": 86400, "pro": 172800, "premium": 604800}',
    'https://api.dicebear.com/7.x/shapes/svg?seed=wheel'
)
ON CONFLICT (component_key)
DO UPDATE SET
    config_schema         = EXCLUDED.config_schema,
    allowed_subscriptions = EXCLUDED.allowed_subscriptions,
    time_expired_config   = EXCLUDED.time_expired_config,
    thumbnail_url         = EXCLUDED.thumbnail_url;

-- -----------------------------------------------------------------------------
-- 5. VERIFICATION
-- -----------------------------------------------------------------------------
-- SELECT name, component_key, allowed_subscriptions, time_expired_config
-- FROM public.templates ORDER BY sort_order;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
