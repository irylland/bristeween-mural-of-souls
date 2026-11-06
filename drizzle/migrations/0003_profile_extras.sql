ALTER TABLE public.profiles
 ADD COLUMN IF NOT EXISTS avatar_path text,
 ADD COLUMN IF NOT EXISTS cover_path text,
 ADD COLUMN IF NOT EXISTS monster_path text,
 ADD COLUMN IF NOT EXISTS human_name text,
 ADD COLUMN IF NOT EXISTS relationship text,
 ADD COLUMN IF NOT EXISTS social_battery integer NOT NULL DEFAULT 100,
 ADD COLUMN IF NOT EXISTS status text,
 ADD COLUMN IF NOT EXISTS music_url text;