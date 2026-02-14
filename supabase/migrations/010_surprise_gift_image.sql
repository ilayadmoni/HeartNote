-- 010_surprise_gift_image.sql
-- Add image_url support to SurpriseGift template config_schema
-- and create a storage bucket for user-uploaded greeting images.

-- 1. Create storage bucket for greeting images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'greeting-images',
  'greeting-images',
  true,
  5242880,  -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS: anyone can read greeting images (public links)
CREATE POLICY "Public read greeting images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'greeting-images');

-- 3. RLS: authenticated users can upload to their own folder
CREATE POLICY "Authenticated upload greeting images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'greeting-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. RLS: users can delete their own uploads
CREATE POLICY "Users delete own greeting images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'greeting-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
