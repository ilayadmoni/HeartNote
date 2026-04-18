-- Migration: Add slot-machine (מכונת ההבטחות) template
-- Rollback:
--   DELETE FROM public.templates WHERE slug = 'slot-machine';

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
