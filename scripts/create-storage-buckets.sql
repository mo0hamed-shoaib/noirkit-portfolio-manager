-- Create storage buckets for file uploads

-- Profile images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Project images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- CV files bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-files',
  'cv-files',
  true,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile-images bucket
CREATE POLICY "Anyone can view profile images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Users can upload profile images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile images" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own profile images" ON storage.objects FOR DELETE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for project-images bucket
CREATE POLICY "Anyone can view project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Users can upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own project images" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own project images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for cv-files bucket
CREATE POLICY "Anyone can view CV files" ON storage.objects FOR SELECT USING (bucket_id = 'cv-files');
CREATE POLICY "Users can upload CV files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own CV files" ON storage.objects FOR UPDATE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own CV files" ON storage.objects FOR DELETE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);
