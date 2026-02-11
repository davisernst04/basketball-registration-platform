-- Migration temporarily disabled to unblock startup
-- BEGIN;

-- -- Update bucket to be public only if the table exists
-- DO $$
-- BEGIN
--     IF EXISTS (
--         SELECT FROM information_schema.tables 
--         WHERE table_schema = 'storage' AND table_name = 'buckets'
--     ) THEN
--         UPDATE storage.buckets SET public = true WHERE id = 'avatars';
--     END IF;
-- END $$;

-- -- Drop loose policies
-- DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
-- DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;

-- -- Create secure policies
-- CREATE POLICY "Users can upload their own avatar."
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'avatars' AND
--   (storage.foldername(name))[1] = auth.uid()::text
-- );

-- CREATE POLICY "Users can update their own avatar."
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'avatars' AND
--   (storage.foldername(name))[1] = auth.uid()::text
-- );

-- CREATE POLICY "Users can delete their own avatar."
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'avatars' AND
--   (storage.foldername(name))[1] = auth.uid()::text
-- );

-- CREATE POLICY "Avatar images are publicly accessible."
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'avatars');

-- COMMIT;