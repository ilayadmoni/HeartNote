-- Migration: Add new interactive event greeting templates.
-- Existing birthday-candles, wedding-glass, and holiday-card rows are untouched.

INSERT INTO public.templates
  (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES
  (
    'birthday-candles-interactive',
    'עוגת יום הולדת אינטראקטיבית',
    ARRAY['יום הולדת'],
    'new,interactive,birthday',
    true,
    '{"fields":[
      {"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},
      {"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},
      {"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},
      {"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},
      {"key":"recipientAge","type":"number","label":"גיל","required":true,"min":1,"max":120}
    ]}'::jsonb,
    true,
    '{"free_days":1,"paid_days":30}'::jsonb,
    0
  ),
  (
    'wedding-glass-interactive',
    'חתונה אינטראקטיבית',
    ARRAY['חתונה'],
    'new,interactive,wedding',
    true,
    '{"fields":[
      {"key":"coupleNames","type":"text","label":"שמות הזוג","required":true,"maxLength":42},
      {"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":36},
      {"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":48},
      {"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":260}
    ]}'::jsonb,
    true,
    '{"free_days":1,"paid_days":30}'::jsonb,
    0
  ),
  (
    'holiday-rosh-hashanah-interactive',
    'ראש השנה אינטראקטיבי',
    ARRAY['חגים'],
    'new,interactive,holiday',
    true,
    '{"fields":[
      {"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},
      {"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},
      {"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},
      {"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},

    ]}'::jsonb,
    true,
    '{"free_days":1,"paid_days":30}'::jsonb,
    0
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.templates
  (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES
  ('holiday-passover-interactive','פסח אינטראקטיבי',ARRAY['חגים'],'new,interactive,holiday',true,
   '{"fields":[{"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},{"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},{"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},{"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},{"key":"signature","type":"text","label":"חתימה","maxLength":70}]}'::jsonb,
   true,'{"free_days":1,"paid_days":30}'::jsonb,0),
  ('holiday-purim-interactive','פורים אינטראקטיבי',ARRAY['חגים'],'new,interactive,holiday',true,
   '{"fields":[{"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},{"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},{"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},{"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},{"key":"signature","type":"text","label":"חתימה","maxLength":70}]}'::jsonb,
   true,'{"free_days":1,"paid_days":30}'::jsonb,0),
  ('holiday-shavuot-interactive','שבועות אינטראקטיבי',ARRAY['חגים'],'new,interactive,holiday',true,
   '{"fields":[{"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},{"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},{"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},{"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},{"key":"signature","type":"text","label":"חתימה","maxLength":70}]}'::jsonb,
   true,'{"free_days":1,"paid_days":30}'::jsonb,0),
  ('holiday-sukkot-interactive','סוכות אינטראקטיבי',ARRAY['חגים'],'new,interactive,holiday',true,
   '{"fields":[{"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},{"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},{"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},{"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},{"key":"signature","type":"text","label":"חתימה","maxLength":70}]}'::jsonb,
   true,'{"free_days":1,"paid_days":30}'::jsonb,0),
  ('holiday-hanukkah-interactive','חנוכה אינטראקטיבי',ARRAY['חגים'],'new,interactive,holiday',true,
   '{"fields":[{"key":"recipientName","type":"text","label":"שם המקבל/ת","required":true,"maxLength":50},{"key":"senderName","type":"text","label":"שם השולח/ת","maxLength":50},{"key":"greetingTitle","type":"text","label":"כותרת הברכה","maxLength":70},{"key":"message","type":"textarea","label":"הברכה","required":true,"maxLength":500},{"key":"signature","type":"text","label":"חתימה","maxLength":70}]}'::jsonb,
   true,'{"free_days":1,"paid_days":30}'::jsonb,0)
ON CONFLICT (slug) DO NOTHING;
