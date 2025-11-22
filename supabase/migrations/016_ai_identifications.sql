-- AI Identification review queue
create table if not exists ai_identifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  observation_id uuid references public.user_visits(id) on delete set null,
  field_site_id uuid references public.field_sites(id) on delete set null,
  provider text not null,
  mode text not null check (mode in ('species', 'bird', 'macro')),
  label text,
  confidence numeric,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'auto')),
  result jsonb,
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  review_notes text
);

create index if not exists ai_identifications_user_idx on ai_identifications (user_id);
create index if not exists ai_identifications_status_idx on ai_identifications (status);

alter table ai_identifications enable row level security;

drop policy if exists "Students view own AI identifications" on ai_identifications;
create policy "Students view own AI identifications"
  on ai_identifications
  for select
  using (auth.uid() = user_id);

-- Educators/admins can review everything
drop policy if exists "Educators view AI identifications" on ai_identifications;
create policy "Educators view AI identifications"
  on ai_identifications
  for select
  using (
    exists (
      select 1 from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

-- Educators/admins can update review status
drop policy if exists "Educators review AI identifications" on ai_identifications;
create policy "Educators review AI identifications"
  on ai_identifications
  for update
  using (
    exists (
      select 1 from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

