create table if not exists soundscape_recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  observation_id uuid references public.user_visits(id) on delete set null,
  field_site_id uuid references public.field_sites(id) on delete set null,
  duration_seconds numeric,
  sample_rate integer,
  audio_data text,
  status text not null default 'stored' check (status in ('stored', 'pending_export', 'exported', 'failed')),
  export_attempts integer not null default 0,
  exported_at timestamptz,
  purdue_request_id text,
  created_at timestamptz not null default now(),
  metadata jsonb
);

create index if not exists soundscape_recordings_user_idx on soundscape_recordings (user_id);
create index if not exists soundscape_recordings_status_idx on soundscape_recordings (status);

alter table soundscape_recordings enable row level security;

drop policy if exists "Students view own soundscapes" on soundscape_recordings;
create policy "Students view own soundscapes"
  on soundscape_recordings
  for select
  using (auth.uid() = user_id);

drop policy if exists "Students insert soundscapes" on soundscape_recordings;
create policy "Students insert soundscapes"
  on soundscape_recordings
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Educators view all soundscapes" on soundscape_recordings;
create policy "Educators view all soundscapes"
  on soundscape_recordings
  for select
  using (
    exists (
      select 1 from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

