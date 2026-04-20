-- Migration: Add holiday-card template
-- Rollback: DELETE FROM public.templates WHERE slug = 'holiday-card'

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES (
  'holiday-card',
  'מפעל החגים',
  ARRAY['חגים'],
  'new',
  true,
  '{
    "fields": [
      {
        "key": "holidayKind",
        "type": "select",
        "label": "בחר חג",
        "options": [
          { "value": "rosh", "label": "🍎 ראש השנה" },
          { "value": "hanukkah", "label": "🕎 חנוכה" },
          { "value": "purim", "label": "🎭 פורים" },
          { "value": "pesach", "label": "🍷 פסח" }
        ],
        "required": true
      },
      { "key": "customTitle", "type": "text", "label": "כותרת (אופציונלי)", "maxLength": 60 },
      { "key": "customGreeting", "type": "textarea", "label": "הברכה שלך", "maxLength": 300 },
      { "key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 30}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
