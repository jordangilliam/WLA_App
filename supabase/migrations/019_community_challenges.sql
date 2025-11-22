-- Community Challenge Engine
-- Introduces shared challenges with class/org participation and event logging

create type challenge_scope as enum ('class', 'organization', 'global');
create type community_entity_type as enum ('class', 'organization', 'global');

create table if not exists community_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  storyline_id text,
  scope challenge_scope not null default 'class',
  target_metric challenge_metric not null,
  target_value int not null default 1,
  reward jsonb,
  start_at timestamptz not null default now(),
  end_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists community_challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references community_challenges(id) on delete cascade,
  entity_type community_entity_type not null,
  entity_id uuid,
  display_name text not null,
  goal_override int,
  progress int not null default 0,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (challenge_id, entity_type, entity_id)
);

create table if not exists community_challenge_events (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references community_challenges(id) on delete cascade,
  participant_id uuid not null references community_challenge_participants(id) on delete cascade,
  user_id uuid references public.users(id),
  event_type text not null,
  value int not null default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists community_challenges_active_idx on community_challenges (is_active, start_at);
create index if not exists community_participants_challenge_idx on community_challenge_participants (challenge_id);
create index if not exists community_events_challenge_idx on community_challenge_events (challenge_id);
create index if not exists community_events_participant_idx on community_challenge_events (participant_id);

alter table community_challenges enable row level security;
alter table community_challenge_participants enable row level security;
alter table community_challenge_events enable row level security;

create policy "Community challenges readable" on community_challenges
  for select using (true);

create policy "Community participants readable" on community_challenge_participants
  for select using (true);

create policy "Community events readable" on community_challenge_events
  for select using (true);

create or replace function set_community_challenge_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_update_community_challenges
  before update on community_challenges
  for each row execute function set_community_challenge_updated_at();

create trigger trg_update_community_participants
  before update on community_challenge_participants
  for each row execute function set_community_challenge_updated_at();

create or replace function increment_community_challenge_progress()
returns trigger as $$
begin
  update community_challenge_participants
  set
    progress = progress + new.value,
    last_event_at = coalesce(new.created_at, now()),
    updated_at = now()
  where id = new.participant_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_increment_community_progress
  after insert on community_challenge_events
  for each row execute function increment_community_challenge_progress();


