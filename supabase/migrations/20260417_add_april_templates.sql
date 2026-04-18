-- Migration: Add April 2026 interactive templates
-- 8 new templates: slot-machine, punching-bag, apology-search, birthday-candles,
--                  excuse-generator, wedding-glass, holiday-card, bar-bat-mitzvah
-- Rollback:
--   DELETE FROM public.templates WHERE slug IN (
--     'slot-machine','punching-bag','apology-search','birthday-candles',
--     'excuse-generator','wedding-glass','holiday-card','bar-bat-mitzvah'
--   );

-- Note: the `uses` column (added in migration 013) defaults to 0 and is
-- auto-incremented on every creations INSERT by trigger_increment_template_uses.
-- We still pass it explicitly here for documentation / safety.
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES
(
  'slot-machine',
  'מכונת ההבטחות',
  ARRAY['משחקים'],
  'new',
  false,
  '{
    "fields": [
      { "key": "title",        "type": "text",  "label": "כותרת",          "maxLength": 60 },
      { "key": "subtitle",     "type": "text",  "label": "כותרת משנה",     "maxLength": 120 },
      { "key": "reel1Options", "type": "array", "label": "אפשרויות גלגל 1", "minItems": 2, "maxItems": 8, "itemType": "text", "required": true },
      { "key": "reel2Options", "type": "array", "label": "אפשרויות גלגל 2", "minItems": 2, "maxItems": 8, "itemType": "text", "required": true },
      { "key": "reel3Options", "type": "array", "label": "אפשרויות גלגל 3", "minItems": 2, "maxItems": 8, "itemType": "text", "required": true },
      { "key": "targetReel1",  "type": "text",  "label": "תוצאה סופית 1",  "maxLength": 40, "required": true },
      { "key": "targetReel2",  "type": "text",  "label": "תוצאה סופית 2",  "maxLength": 40, "required": true },
      { "key": "targetReel3",  "type": "text",  "label": "תוצאה סופית 3",  "maxLength": 40, "required": true },
      { "key": "primaryColor", "type": "color", "label": "צבע ראשי",       "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 14}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES
(
  'punching-bag',
  'שק האיגרוף',
  ARRAY['משחקים'],
  'new',
  false,
  '{
    "fields": [
      { "key": "introTitle",      "type": "text",     "label": "כותרת פתיחה",           "maxLength": 60 },
      { "key": "introSubtitle",   "type": "text",     "label": "תת-כותרת",              "maxLength": 120 },
      { "key": "hitsRequired",    "type": "number",   "label": "מספר מכות נדרשות",       "required": true, "min": 1, "max": 20 },
      { "key": "hitInstructions", "type": "text",     "label": "הוראות הכאה",            "maxLength": 80 },
      { "key": "resultTitle",     "type": "text",     "label": "כותרת תוצאה",            "maxLength": 60 },
      { "key": "resultMessage",   "type": "textarea", "label": "הודעת סיום",             "maxLength": 400, "required": true },
      { "key": "bagColor",        "type": "color",    "label": "צבע השק",               "default": "#d4826f" },
      { "key": "primaryColor",    "type": "color",    "label": "צבע ראשי",              "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 14}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
