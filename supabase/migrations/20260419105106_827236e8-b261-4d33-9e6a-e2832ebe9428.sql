-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  has_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Invitations table
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  template_id TEXT NOT NULL DEFAULT 'emerald-noir',
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_map_url TEXT,
  dress_code TEXT,
  message TEXT,
  hero_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Owner can manage their invitations
CREATE POLICY "Owners can view their invitations"
  ON public.invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can insert their invitations"
  ON public.invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their invitations"
  ON public.invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their invitations"
  ON public.invitations FOR DELETE USING (auth.uid() = user_id);

-- Public can view published invitations (for shareable link)
CREATE POLICY "Anyone can view published invitations"
  ON public.invitations FOR SELECT USING (is_published = true);

-- Guest messages
CREATE TABLE public.guest_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  attending BOOLEAN,
  guest_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message to a published invitation
CREATE POLICY "Anyone can insert guest messages"
  ON public.guest_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = invitation_id AND i.is_published = true)
  );

-- Only invitation owner can read messages
CREATE POLICY "Owners can read their guest messages"
  ON public.guest_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = invitation_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Owners can delete their guest messages"
  ON public.guest_messages FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = invitation_id AND i.user_id = auth.uid())
  );

-- Timestamps trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for hero images
INSERT INTO storage.buckets (id, name, public)
VALUES ('invitation-images', 'invitation-images', true);

CREATE POLICY "Invitation images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'invitation-images');

CREATE POLICY "Authenticated users can upload invitation images"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'invitation-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own invitation images"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'invitation-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own invitation images"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'invitation-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );