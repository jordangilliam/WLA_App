-- Citizen Science Media + AI linkage
-- Creates observation_media table and links ai_identifications to captured assets

create table if not exists observation_media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  observation_id uuid references public.user_visits(id) on delete cascade,
  field_site_id uuid references public.field_sites(id) on delete set null,
  media_type text not null check (media_type in ('photo', 'audio', 'video')),
  storage_path text not null,
  preview_path text,
  captured_at timestamptz,
  latitude double precision,
  longitude double precision,
  status text not null default 'pending' check (status in ('pending', 'available', 'failed', 'removed')),
  source text not null default 'app',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists observation_media_observation_idx on observation_media (observation_id);
create index if not exists observation_media_user_idx on observation_media (user_id);
create index if not exists observation_media_field_site_idx on observation_media (field_site_id);
create index if not exists observation_media_type_idx on observation_media (media_type);
create index if not exists observation_media_status_idx on observation_media (status);

alter table observation_media enable row level security;

drop policy if exists "Users view own observation media" on observation_media;
create policy "Users view own observation media"
  on observation_media
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users manage own observation media" on observation_media;
create policy "Users manage own observation media"
  on observation_media
  for insert
  with check (auth.uid() = user_id);

create policy "Users update own observation media"
  on observation_media
  for update
  using (auth.uid() = user_id);

drop policy if exists "Educators view observation media" on observation_media;
create policy "Educators view observation media"
  on observation_media
  for select
  using (
    exists (
      select 1 from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

drop policy if exists "Educators moderate observation media" on observation_media;
create policy "Educators moderate observation media"
  on observation_media
  for update
  using (
    exists (
      select 1 from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

-- Link AI identifications to specific media assets
alter table ai_identifications
  add column if not exists media_id uuid references public.observation_media(id) on delete set null;

create index if not exists ai_identifications_media_idx on ai_identifications (media_id);


