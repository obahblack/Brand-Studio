-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Kits table
CREATE TABLE public.brand_kits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  brand_name TEXT NOT NULL,
  website_url TEXT,
  brand_description TEXT,
  logo_url TEXT,
  
  -- Stored as JSONB for flexibility
  brand_analysis JSONB,
  design_system JSONB,
  color_palette JSONB,
  typography JSONB,
  design_tokens JSONB,
  
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Assets table
CREATE TABLE public.assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_kit_id UUID REFERENCES public.brand_kits(id) ON DELETE CASCADE NOT NULL,
  
  asset_type TEXT NOT NULL, -- 'social_linkedin', 'social_instagram', 'pdf', etc.
  asset_name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Brand Kits policies
CREATE POLICY "Users can view own brand kits" ON public.brand_kits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create brand kits" ON public.brand_kits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand kits" ON public.brand_kits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand kits" ON public.brand_kits
  FOR DELETE USING (auth.uid() = user_id);

-- Assets policies
CREATE POLICY "Users can view own assets" ON public.assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brand_kits 
      WHERE brand_kits.id = assets.brand_kit_id 
      AND brand_kits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create assets" ON public.assets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brand_kits 
      WHERE brand_kits.id = assets.brand_kit_id 
      AND brand_kits.user_id = auth.uid()
    )
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('logos', 'logos', true),
  ('assets', 'assets', true),
  ('brand-kits', 'brand-kits', false);

-- Storage policies
CREATE POLICY "Logo uploads are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Anyone can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
