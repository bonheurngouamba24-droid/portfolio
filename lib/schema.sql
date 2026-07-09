-- ============================================================
-- SCHEMA SUPABASE — Portfolio Gloire Bonheur (Dual Universe)
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- Enum : les deux facettes du portfolio
create type universe as enum ('industrial', 'finance');

-- ------------------------------------------------------------
-- TABLE : profile (une seule ligne — tes infos globales)
-- ------------------------------------------------------------
create table profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Gloire Bonheur',
  headline text not null,               -- ex: "Ingénieur Génie Industriel & Quant Trader"
  bio_industrial text,                  -- pitch côté A
  bio_finance text,                     -- pitch côté B
  location text default 'Casablanca, Maroc',
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  cv_url text,                          -- lien vers le PDF du CV
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- TABLE : experiences (stages, projets académiques encadrés)
-- ------------------------------------------------------------
create table experiences (
  id uuid primary key default gen_random_uuid(),
  universe universe not null,
  title text not null,                  -- ex: "Stagiaire en Optimisation SEO & Flux Digitaux"
  organization text not null,           -- ex: "Maroc Organic"
  location text,
  start_date date not null,
  end_date date,                        -- null = en cours
  is_current boolean default false,
  summary text,                         -- résumé court affiché en carte
  bullet_points text[],                 -- liste à puces des réalisations
  display_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- TABLE : projects (les projets techniques / quant mis en avant)
-- ------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  universe universe not null,
  slug text unique not null,            -- ex: "maintenance-predictive-nasa-bearing"
  title text not null,
  subtitle text,
  description text not null,
  cover_image_url text,
  tech_stack text[],                    -- ex: ['Python', 'Pandas', 'Scikit-learn']
  metrics jsonb,                        -- ex: {"accuracy": "98%", "precision": "96%", "sensitivity": "99%"}
  external_url text,                    -- repo GitHub / démo
  featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- TABLE : skills
-- ------------------------------------------------------------
create table skills (
  id uuid primary key default gen_random_uuid(),
  universe universe not null,
  category text not null,               -- ex: "Data & Analyse", "Automatismes", "Risk Management"
  name text not null,
  proficiency int check (proficiency between 1 and 5) default 3,
  display_order int default 0
);

-- ------------------------------------------------------------
-- TABLE : education
-- ------------------------------------------------------------
create table education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  specialization text,
  start_date date,
  end_date date,
  display_order int default 0
);

-- Row Level Security : lecture publique, écriture réservée à l'admin authentifié
alter table profile enable row level security;
alter table experiences enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table education enable row level security;

create policy "public read profile" on profile for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read education" on education for select using (true);

-- L'écriture (insert/update/delete) reste réservée au rôle "service_role"
-- utilisé uniquement depuis le Dashboard Supabase / Studio, jamais côté client.
