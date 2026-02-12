-- =============================================================================
-- HeartNote – Ensure surprise-gift template is active & gallery-ready
-- Date: 2026-02-12
--
-- Idempotent: runs safely whether the row exists or not.
-- =============================================================================

-- Upsert: insert if missing, update if exists
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy)
VALUES (
    'surprise-gift',
    'מתנה בהפתעה',
    ARRAY['יום הולדת', 'רומנטי', 'משחקים'],
    'new',
    true,
    '{
        "fields": [
            {
                "key": "title",
                "type": "text",
                "label": "כותרת",
                "placeholder": "יש לך הפתעה! 🎁",
                "maxLength": 80
            },
            {
                "key": "greeting",
                "type": "textarea",
                "label": "ברכה / הודעה",
                "placeholder": "הטקסט שייחשף אחרי הפתיחה",
                "maxLength": 500,
                "required": true
            },
            {
                "key": "boxColor",
                "type": "color",
                "label": "צבע קופסה",
                "default": "#e74c5e"
            },
            {
                "key": "ribbonColor",
                "type": "color",
                "label": "צבע סרט",
                "default": "#ffd700"
            },
            {
                "key": "clicksRequired",
                "type": "number",
                "label": "מספר לחיצות לפתיחה",
                "default": 5,
                "min": 1,
                "max": 20
            },
            {
                "key": "primaryColor",
                "type": "color",
                "label": "צבע ראשי",
                "default": "#d4826f"
            }
        ]
    }'::jsonb,
    true,
    '{"free_days": 1, "paid_days": 14}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    is_active         = true,
    name              = EXCLUDED.name,
    category          = EXCLUDED.category,
    tags              = EXCLUDED.tags,
    is_premium        = EXCLUDED.is_premium,
    config_schema     = EXCLUDED.config_schema,
    expiration_policy = EXCLUDED.expiration_policy;

-- Also ensure all existing templates are active
UPDATE public.templates
SET is_active = true
WHERE slug IN (
    'date-invite', 'scratch-card', 'timeline', 'love-coupons',
    'relationship-quiz', 'open-when', 'decision-wheel', 'steamy-window',
    'surprise-gift'
);
