-- Add Bar/Bat Mitzvah template
-- Rollback: DELETE FROM public.templates WHERE slug = 'bar-bat-mitzvah';

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES (
  'bar-bat-mitzvah',
  'בר/בת מצווה',
  ARRAY['חגיגות'],
  'mitzvah',
  true,
  '{
    "fields": [
      { "key": "kind", "type": "select", "label": "בחר סוג", "options": [{"value": "bar", "label": "בר מצווה"}, {"value": "bat", "label": "בת מצווה"}], "required": true },
      { "key": "introTitle", "type": "text", "label": "כותרת", "maxLength": 60, "default": "מכונת ההתבגרות" },
      { "key": "introSubtitle", "type": "text", "label": "תיאור", "maxLength": 120, "default": "לחצו על הכתר או הספר כדי לגלות את הברכה" },
      { "key": "blessingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 80, "required": true, "default": "הגיע הזמן לחגוג! 🎉" },
      { "key": "blessingMessage", "type": "textarea", "label": "הברכה", "maxLength": 300, "required": true },
      { "key": "tapHintLabel", "type": "text", "label": "טקסט הרמז (אופציונלי)", "maxLength": 60 },
      { "key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 30}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
