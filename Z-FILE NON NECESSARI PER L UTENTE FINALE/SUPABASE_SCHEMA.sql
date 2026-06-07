-- ─────────────────────────────────────────────────────────────────────────────
-- SUPABASE_SCHEMA.sql
-- CodeLearn BETA V1.1.2c-3 - The Synch Update
--
-- COME USARE QUESTO FILE:
--   1. Vai su https://supabase.com → il tuo progetto
--   2. Clicca su "SQL Editor" nel menu laterale
--   3. Clicca "New query"
--   4. Incolla TUTTO il contenuto di questo file
--   5. Clicca "Run" (▶)
--   6. Se vedi "Success" sei a posto!
--
-- DOPO AVER ESEGUITO LO SCHEMA:
--   Vai su Settings → API e copia:
--     - Project URL  → VITE_SUPABASE_URL nel tuo .env
--     - anon key     → VITE_SUPABASE_ANON_KEY nel tuo .env
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 0. Estensioni ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── 1. Tabella principale: users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT          NOT NULL,
  last_version  TEXT          NOT NULL DEFAULT '1.1.2c-3',
  platform      TEXT          NOT NULL DEFAULT 'Web',
  device_info   TEXT          NOT NULL DEFAULT '',
  progress_data JSONB         NOT NULL DEFAULT '{
    "completedLessons": [],
    "xp": 0,
    "level": 1,
    "streak": 0,
    "badges": [],
    "courseProgress": {},
    "startedCourses": []
  }'::jsonb,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Vincolo: username univoco (case-insensitive)
-- Se esiste già, salta silenziosamente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_username_unique'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_username_unique UNIQUE (username);
  END IF;
END $$;


-- ── 2. Indici ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_username
  ON public.users USING btree (lower(username) text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_users_id
  ON public.users (id);

-- Indice sul campo XP dentro il JSONB (utile per la leaderboard)
CREATE INDEX IF NOT EXISTS idx_users_xp
  ON public.users ((( progress_data->>'xp')::int) DESC);


-- ── 3. Trigger: aggiorna updated_at in automatico ────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 4. Funzione: merge intelligente dei progressi ─────────────────────────────
-- Questa funzione viene chiamata dal client quando vuole sincronizzare.
-- Applica una logica "prendi il meglio": usa l'XP più alto tra quello
-- salvato sul DB e quello inviato dal dispositivo, e unisce le lezioni
-- completate da entrambe le sorgenti (web + Android).
-- In questo modo non si perdono mai i progressi fatti su un dispositivo
-- mentre si usava l'altro.

CREATE OR REPLACE FUNCTION public.merge_progress(
  p_username    TEXT,
  p_new_data    JSONB,
  p_version     TEXT,
  p_platform    TEXT,
  p_device_info TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing      JSONB;
  v_merged        JSONB;
  v_old_xp        INT;
  v_new_xp        INT;
  v_merged_xp     INT;
  v_old_lessons   JSONB;
  v_new_lessons   JSONB;
  v_merged_lessons JSONB;
  v_old_badges    JSONB;
  v_new_badges    JSONB;
  v_merged_badges JSONB;
BEGIN
  -- Leggi il progress attuale dal DB
  SELECT progress_data INTO v_existing
  FROM public.users
  WHERE lower(username) = lower(p_username);

  -- Se l'utente non esiste ancora, inseriscilo e restituisci i dati nuovi
  IF NOT FOUND THEN
    INSERT INTO public.users (username, last_version, platform, device_info, progress_data)
    VALUES (p_username, p_version, p_platform, p_device_info, p_new_data);
    RETURN p_new_data;
  END IF;

  -- XP: prendi il più alto
  v_old_xp := COALESCE((v_existing->>'xp')::int, 0);
  v_new_xp := COALESCE((p_new_data->>'xp')::int, 0);
  v_merged_xp := GREATEST(v_old_xp, v_new_xp);

  -- Lezioni completate: unione degli array (senza duplicati)
  v_old_lessons := COALESCE(v_existing->'completedLessons', '[]'::jsonb);
  v_new_lessons := COALESCE(p_new_data->'completedLessons', '[]'::jsonb);
  SELECT jsonb_agg(DISTINCT elem)
  INTO v_merged_lessons
  FROM (
    SELECT jsonb_array_elements_text(v_old_lessons) AS elem
    UNION
    SELECT jsonb_array_elements_text(v_new_lessons)
  ) t;
  v_merged_lessons := COALESCE(v_merged_lessons, '[]'::jsonb);

  -- Badge: unione degli array (senza duplicati)
  v_old_badges := COALESCE(v_existing->'badges', '[]'::jsonb);
  v_new_badges := COALESCE(p_new_data->'badges', '[]'::jsonb);
  SELECT jsonb_agg(DISTINCT elem)
  INTO v_merged_badges
  FROM (
    SELECT jsonb_array_elements_text(v_old_badges) AS elem
    UNION
    SELECT jsonb_array_elements_text(v_new_badges)
  ) t;
  v_merged_badges := COALESCE(v_merged_badges, '[]'::jsonb);

  -- Costruisci il JSONB finale: parti dai dati nuovi e sovrascrivi i campi calcolati
  v_merged := p_new_data
    || jsonb_build_object(
        'xp',               v_merged_xp,
        'completedLessons', v_merged_lessons,
        'badges',           v_merged_badges,
        -- level: il più alto
        'level', GREATEST(
          COALESCE((v_existing->>'level')::int, 1),
          COALESCE((p_new_data->>'level')::int, 1)
        ),
        -- streak: il più alto (conservativo)
        'streak', GREATEST(
          COALESCE((v_existing->>'streak')::int, 0),
          COALESCE((p_new_data->>'streak')::int, 0)
        )
       );

  -- Aggiorna il record
  UPDATE public.users
  SET
    progress_data = v_merged,
    last_version  = p_version,
    platform      = p_platform,
    device_info   = p_device_info,
    updated_at    = NOW()
  WHERE lower(username) = lower(p_username);

  RETURN v_merged;
END;
$$;

-- Permetti alla anon key di chiamare questa funzione
GRANT EXECUTE ON FUNCTION public.merge_progress TO anon;


-- ── 5. Row Level Security (RLS) ───────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_public" ON public.users;
CREATE POLICY "users_select_public"
  ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_insert_public" ON public.users;
CREATE POLICY "users_insert_public"
  ON public.users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "users_update_public" ON public.users;
CREATE POLICY "users_update_public"
  ON public.users FOR UPDATE USING (true);


-- ── 6. Vista pubblica per la leaderboard ──────────────────────────────────────
CREATE OR REPLACE VIEW public.users_public AS
  SELECT
    id,
    username,
    last_version,
    platform,
    (progress_data->>'xp')::int                                AS xp,
    (progress_data->>'level')::int                             AS level,
    (progress_data->>'streak')::int                            AS streak,
    jsonb_array_length(progress_data->'completedLessons')      AS lessons_done,
    jsonb_array_length(progress_data->'badges')                AS badges_count,
    created_at,
    updated_at
  FROM public.users
  ORDER BY (progress_data->>'xp')::int DESC;


-- ── 7. Dati di test (opzionale — decommentare per popolare) ───────────────────
/*
INSERT INTO public.users (username, last_version, platform, device_info, progress_data)
VALUES
  ('PiBOH', '1.1.2c-3', 'Web (Vercel)', 'Chrome – Windows 11',
   '{"completedLessons":["py-1","py-2","py-3"],"xp":75,"level":1,"streak":3,
     "badges":["first-step","explorer"],"courseProgress":{"python":3},
     "startedCourses":["python"]}'),
  ('TestAndroid', '1.1.2c-3', 'Android APK', 'Samsung Galaxy S21',
   '{"completedLessons":["py-1"],"xp":25,"level":1,"streak":1,
     "badges":["first-step"],"courseProgress":{"python":1},
     "startedCourses":["python"]}')
ON CONFLICT (username) DO NOTHING;
*/


-- ─────────────────────────────────────────────────────────────────────────────
-- STRUTTURA JSON progress_data (riferimento):
-- {
--   "completedLessons": ["py-1", "py-2", ...],
--   "xp":             150,
--   "level":          2,
--   "streak":         5,
--   "badges":         ["first-step", "coder"],
--   "courseProgress": { "python": 3, "javascript": 1 },
--   "startedCourses": ["python", "javascript"]
-- }
-- ─────────────────────────────────────────────────────────────────────────────
