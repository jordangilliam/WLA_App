-- Story Driven Missions schema

create table if not exists story_missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  synopsis text,
  storyline_id text,
  hero_image_url text,
  difficulty text default 'medium',
  subject_tags text[] default '{}',
  recommended_grades text[] default '{}',
  start_at timestamptz not null default now(),
  end_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists story_mission_stages (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references story_missions(id) on delete cascade,
  order_index int not null default 0,
  title text not null,
  summary text,
  learning_objective text,
  target_metric challenge_metric default 'observations',
  target_value int default 1,
  content jsonb default '{}'::jsonb,
  reward jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mission_id, order_index)
);

create table if not exists story_mission_progress (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references story_missions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  current_stage int not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mission_id, user_id)
);

create table if not exists story_mission_stage_progress (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references story_missions(id) on delete cascade,
  stage_id uuid not null references story_mission_stages(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','in_progress','completed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (stage_id, user_id)
);

create index if not exists story_missions_active_idx on story_missions (is_active, start_at);
create index if not exists story_mission_stages_mission_idx on story_mission_stages (mission_id);
create index if not exists story_mission_progress_user_idx on story_mission_progress (user_id, mission_id);
create index if not exists story_mission_stage_progress_user_idx on story_mission_stage_progress (user_id, stage_id);

alter table story_missions enable row level security;
alter table story_mission_stages enable row level security;
alter table story_mission_progress enable row level security;
alter table story_mission_stage_progress enable row level security;

create policy "Story missions are public" on story_missions
  for select using (true);

create policy "Story mission stages are public" on story_mission_stages
  for select using (true);

create policy "Users view their mission progress" on story_mission_progress
  for select using (auth.uid() = user_id);

create policy "Users manage own mission progress" on story_mission_progress
  for insert with check (auth.uid() = user_id);

create policy "Users update own mission progress" on story_mission_progress
  for update using (auth.uid() = user_id);

create policy "Users view own stage progress" on story_mission_stage_progress
  for select using (auth.uid() = user_id);

create policy "Users insert own stage progress" on story_mission_stage_progress
  for insert with check (auth.uid() = user_id);

create policy "Users update own stage progress" on story_mission_stage_progress
  for update using (auth.uid() = user_id);

create or replace function touch_story_missions()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_story_missions_updated_at
  before update on story_missions
  for each row execute function touch_story_missions();

create trigger trg_story_mission_stages_updated_at
  before update on story_mission_stages
  for each row execute function touch_story_missions();

create trigger trg_story_mission_progress_updated_at
  before update on story_mission_progress
  for each row execute function touch_story_missions();

create trigger trg_story_mission_stage_progress_updated_at
  before update on story_mission_stage_progress
  for each row execute function touch_story_missions();




