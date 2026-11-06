CREATE TABLE public.registrations (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 email text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved')),
 created_at timestamptz NOT NULL DEFAULT now(),
 approved_at timestamptz,
 approved_by uuid
);
GRANT SELECT, UPDATE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own registration or admin" ON public.registrations FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin approves registrations" ON public.registrations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.registrations (user_id,email,status,approved_at) SELECT p.id,u.email,'approved',now() FROM public.profiles p JOIN auth.users u ON u.id=p.id;
CREATE OR REPLACE FUNCTION public.community_access() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.registrations WHERE user_id=auth.uid() AND status='approved');
$$;
REVOKE ALL ON FUNCTION public.community_access() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.community_access() TO authenticated;
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles (id,display_name,avatar_url) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',NEW.raw_user_meta_data->>'name',split_part(NEW.email,'@',1)),NEW.raw_user_meta_data->>'avatar_url') ON CONFLICT (id) DO NOTHING;
 INSERT INTO public.user_roles (user_id,role) VALUES (NEW.id,'user') ON CONFLICT DO NOTHING;
 INSERT INTO public.registrations (user_id,email) VALUES (NEW.id,NEW.email) ON CONFLICT (user_id) DO NOTHING;
 RETURN NEW;
END;
$$;
CREATE POLICY "approved community only" ON public.profiles AS RESTRICTIVE FOR ALL TO authenticated USING (public.community_access()) WITH CHECK (public.community_access());
CREATE POLICY "approved community only" ON public.posts AS RESTRICTIVE FOR ALL TO authenticated USING (public.community_access()) WITH CHECK (public.community_access());
CREATE POLICY "approved community only" ON public.scraps AS RESTRICTIVE FOR ALL TO authenticated USING (public.community_access()) WITH CHECK (public.community_access());
CREATE POLICY "approved media only" ON storage.objects AS RESTRICTIVE FOR ALL TO authenticated USING (bucket_id <> 'media' OR public.community_access()) WITH CHECK (bucket_id <> 'media' OR public.community_access());