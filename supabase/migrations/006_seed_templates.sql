-- =============================================================================
-- HeartNote – Template Seed Data
-- Generated from React frontend component analysis
-- Date: 2026-02-11
--
-- Templates extracted from: client/src/components/templates/
--   1. SteamyWindow   (steamy-window)       – רומנטי
--   2. DecisionWheel  (decision-wheel)      – משחקים
--   3. DateInvite     (date-invite)          – רומנטי
--   4. ScratchCard    (scratch-card)         – משחקים
--   5. Timeline       (timeline)             – זיכרונות
--   6. LoveCoupons    (love-coupons)         – רומנטי
--   7. RelationshipQuiz (relationship-quiz)  – משחקים
--   8. OpenWhen       (open-when)            – רומנטי, משפחה וחברים
--
-- All slugs use kebab-case to match frontend templateId conventions.
-- =============================================================================

-- Clear existing templates (idempotent)
DELETE FROM public.templates;

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy)
VALUES

-- ─────────────────────────────────────────────
-- 1. Steamy Window  (חלון מאודה)
-- ─────────────────────────────────────────────
(
    'steamy-window',
    'חלון עם אדים',
    ARRAY['רומנטי'],
    'popular',
    false,
    '{
        "fields": [
            {
                "key": "revealMessage",
                "type": "textarea",
                "label": "הודעה נסתרת",
                "placeholder": "כתוב/י את ההודעה שתתגלה…",
                "maxLength": 200,
                "required": true
            },
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "חלון מאודה",
                "maxLength": 60
            },
            {
                "key": "emoji",
                "type": "text",
                "label": "אימוג׳י",
                "placeholder": "💖",
                "maxLength": 4
            },
            {
                "key": "background_image",
                "type": "image_url",
                "label": "תמונת רקע",
                "accept": "image/jpeg,image/png,image/webp"
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע מודגש",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 2. Decision Wheel  (גלגל ההחלטות)
-- ─────────────────────────────────────────────
(
    'decision-wheel',
    'גלגל ההחלטות',
    ARRAY['משחקים'],
    'popular',
    true,
    '{
        "fields": [
            {
                "key": "options",
                "type": "array",
                "label": "אפשרויות בגלגל",
                "minItems": 2,
                "maxItems": 8,
                "itemType": "text",
                "placeholder": "אפשרות…",
                "required": true
            },
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "גלגל ההחלטות",
                "maxLength": 60
            },
            {
                "key": "subtitle",
                "type": "text",
                "label": "כותרת משנה",
                "placeholder": "סובבו וגלו!",
                "maxLength": 80
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע כפתור סיבוב",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 3. Date Invite  (הזמנה לדייט)
-- ─────────────────────────────────────────────
(
    'date-invite',
    'הזמנה לדייט',
    ARRAY['רומנטי'],
    'new',
    false,
    '{
        "fields": [
            {
                "key": "question",
                "type": "text",
                "label": "שאלת ההזמנה",
                "placeholder": "?האם תצאי איתי לדייט",
                "maxLength": 120,
                "required": true
            },
            {
                "key": "yesText",
                "type": "text",
                "label": "טקסט כפתור כן",
                "placeholder": "כן",
                "maxLength": 30,
                "default": "כן"
            },
            {
                "key": "noText",
                "type": "text",
                "label": "טקסט כפתור לא",
                "placeholder": "לא",
                "maxLength": 30,
                "default": "לא"
            },
            {
                "key": "successMessage",
                "type": "text",
                "label": "הודעת הצלחה",
                "placeholder": "!יש לנו דייט",
                "maxLength": 120,
                "default": "!יש לנו דייט"
            },
            {
                "key": "backgroundImage",
                "type": "image_url",
                "label": "תמונת רקע",
                "accept": "image/jpeg,image/png,image/webp"
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע כפתורים",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 4. Scratch Card  (גרד וגלה)
-- ─────────────────────────────────────────────
(
    'scratch-card',
    'גרד וגלה',
    ARRAY['משחקים'],
    null,
    false,
    '{
        "fields": [
            {
                "key": "prizeContent",
                "type": "textarea",
                "label": "תוכן ההפתעה",
                "placeholder": "כתוב/י את ההפתעה שתתגלה…",
                "maxLength": 200,
                "required": true
            },
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "גרד וגלה את ההפתעה",
                "maxLength": 60
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע מודגש",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 5. Timeline  (ציר זמן)
-- ─────────────────────────────────────────────
(
    'timeline',
    'ציר זמן',
    ARRAY['זיכרונות'],
    null,
    true,
    '{
        "fields": [
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "הסיפור שלנו",
                "maxLength": 60
            },
            {
                "key": "events",
                "type": "array",
                "label": "אירועים",
                "minItems": 1,
                "maxItems": 20,
                "itemType": "object",
                "itemSchema": {
                    "id":          { "type": "auto_uuid" },
                    "date":        { "type": "date",     "label": "תאריך",  "required": true },
                    "title":       { "type": "text",     "label": "כותרת",  "maxLength": 80, "required": true },
                    "description": { "type": "textarea", "label": "תיאור",  "maxLength": 300 },
                    "icon":        { "type": "text",     "label": "אימוג׳י", "maxLength": 4,  "default": "💖" }
                },
                "required": true
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע ציר",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 6. Love Coupons  (קופונים מיוחדים)
-- ─────────────────────────────────────────────
(
    'love-coupons',
    'קופונים מיוחדים',
    ARRAY['רומנטי'],
    null,
    false,
    '{
        "fields": [
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "קופונים מיוחדים",
                "maxLength": 60
            },
            {
                "key": "coupons",
                "type": "array",
                "label": "קופונים",
                "minItems": 1,
                "maxItems": 12,
                "itemType": "object",
                "itemSchema": {
                    "id":          { "type": "auto_uuid" },
                    "title":       { "type": "text",     "label": "כותרת קופון", "maxLength": 60,  "required": true },
                    "description": { "type": "textarea", "label": "תיאור",       "maxLength": 200 },
                    "icon":        { "type": "text",     "label": "אימוג׳י",     "maxLength": 4,  "default": "🎁" },
                    "color":       { "type": "select",   "label": "צבע",         "options": ["emerald","sky","amber","rose","violet","orange"] }
                },
                "required": true
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע מודגש",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 7. Relationship Quiz  (חידון זוגיות)
-- ─────────────────────────────────────────────
(
    'relationship-quiz',
    'חידון זוגיות',
    ARRAY['משחקים'],
    null,
    true,
    '{
        "fields": [
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "כמה את/ה מכיר/ה אותי?",
                "maxLength": 60
            },
            {
                "key": "questions",
                "type": "array",
                "label": "שאלות",
                "minItems": 1,
                "maxItems": 20,
                "itemType": "object",
                "itemSchema": {
                    "id":           { "type": "auto_uuid" },
                    "question":     { "type": "text",   "label": "שאלה",       "maxLength": 150, "required": true },
                    "options":      { "type": "array",  "label": "תשובות",     "minItems": 2, "maxItems": 6, "itemType": "text" },
                    "correctIndex": { "type": "number", "label": "אינדקס תשובה נכונה", "min": 0 }
                },
                "required": true
            },
            {
                "key": "scoreMessages",
                "type": "array",
                "label": "הודעות לפי ציון",
                "minItems": 1,
                "maxItems": 5,
                "itemType": "object",
                "itemSchema": {
                    "minScore": { "type": "number", "label": "ציון מינימלי", "min": 0, "max": 100 },
                    "message":  { "type": "text",   "label": "הודעה",        "maxLength": 120 }
                }
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע מודגש",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
),

-- ─────────────────────────────────────────────
-- 8. Open When  (מכתבים מיוחדים)
-- ─────────────────────────────────────────────
(
    'open-when',
    'מכתבים מיוחדים',
    ARRAY['רומנטי', 'משפחה וחברים'],
    'new',
    false,
    '{
        "fields": [
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "מכתבים מיוחדים",
                "maxLength": 60
            },
            {
                "key": "envelopes",
                "type": "array",
                "label": "מכתבים",
                "minItems": 1,
                "maxItems": 12,
                "itemType": "object",
                "itemSchema": {
                    "id":       { "type": "auto_uuid" },
                    "title":    { "type": "text",     "label": "כותרת (כשאת/ה…)", "maxLength": 60,  "required": true },
                    "content":  { "type": "textarea", "label": "תוכן המכתב",     "maxLength": 1000, "required": true },
                    "emoji":    { "type": "text",     "label": "אימוג׳י",         "maxLength": 4,  "default": "💌" },
                    "dateOpen": { "type": "date",     "label": "תאריך פתיחה" },
                    "color":    { "type": "select",   "label": "צבע",             "options": ["rose","sky","amber","violet","emerald","orange"] }
                },
                "required": true
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע מודגש",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
);

-- =============================================================================
-- Subscription Policies
-- =============================================================================
DELETE FROM public.subscription_policies;

INSERT INTO public.subscription_policies (tier_code, creation_limit, default_expiry)
VALUES
    ('free',    2,    86400),    -- 2 creations, 1 day expiry
    ('lite',    8,    259200),   -- 8 creations, 3 days expiry
    ('premium', NULL, 1209600); -- unlimited,   14 days expiry
