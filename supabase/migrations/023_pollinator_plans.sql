-- Pollinator action planner submissions

create table if not exists pollinator_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  location_type text not null,
  region text,
  sun_exposure text not null,
  soil_moisture text not null,
  available_area_sqft int,
  maintenance_level text not null,
  bloom_focus text,
  recommendations jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists pollinator_plans_user_idx on pollinator_plans (user_id);
create index if not exists pollinator_plans_created_idx on pollinator_plans (created_at desc);

alter table pollinator_plans enable row level security;

create policy "Users view their pollinator plans"
  on pollinator_plans
  for select
  using (auth.uid() = user_id);

create policy "Users insert pollinator plans"
  on pollinator_plans
  for insert
  with check (auth.uid() = user_id);




