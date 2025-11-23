-- Mission Locations Bridge
-- Connects story missions to field sites for location-based gameplay

create table if not exists mission_locations (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references story_missions(id) on delete cascade,
  stage_id uuid references story_mission_stages(id) on delete set null,
  field_site_id uuid references field_sites(id) on delete set null,
  
  -- Custom location (if not using field_site)
  custom_name text,
  custom_latitude double precision,
  custom_longitude double precision,
  custom_address text,
  
  -- Location type and requirements
  location_type text not null default 'checkpoint' check (location_type in ('checkpoint', 'challenge', 'clue', 'reward', 'qr_code', 'ar_marker')),
  required_action text check (required_action in ('check_in', 'photo', 'observation', 'qr_scan', 'ar_view', 'data_collection')),
  
  -- Geofence settings
  geofence_radius_meters int default 50,
  
  -- Clue/QR code data
  qr_code_data text, -- QR code content (can be encrypted)
  clue_text text, -- Text clue revealed at location
  clue_image_url text, -- Image clue
  ar_marker_url text, -- AR marker image URL
  
  -- Progressive revelation
  unlock_condition jsonb, -- Conditions to unlock this location (e.g., {"previous_stage_completed": true})
  reveal_order int default 0, -- Order in which clues are revealed
  
  -- Metadata
  metadata jsonb default '{}'::jsonb,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Ensure either field_site_id or custom location is set
  constraint location_check check (
    (field_site_id is not null) or 
    (custom_latitude is not null and custom_longitude is not null)
  )
);

create index if not exists mission_locations_mission_idx on mission_locations (mission_id);
create index if not exists mission_locations_stage_idx on mission_locations (stage_id);
create index if not exists mission_locations_field_site_idx on mission_locations (field_site_id);
create index if not exists mission_locations_type_idx on mission_locations (location_type);

-- Mission location visits (track when users reach locations)
create table if not exists mission_location_visits (
  id uuid primary key default gen_random_uuid(),
  mission_location_id uuid not null references mission_locations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  visited_at timestamptz not null default now(),
  action_taken text, -- 'check_in', 'qr_scan', 'ar_view', etc.
  evidence_media_id uuid references observation_media(id) on delete set null,
  notes text,
  metadata jsonb default '{}'::jsonb,
  unique (mission_location_id, user_id, visited_at)
);

create index if not exists mission_location_visits_user_idx on mission_location_visits (user_id, mission_location_id);
create index if not exists mission_location_visits_location_idx on mission_location_visits (mission_location_id);

-- RLS policies
alter table mission_locations enable row level security;
alter table mission_location_visits enable row level security;

create policy "Mission locations are public" on mission_locations
  for select using (true);

create policy "Users view their location visits" on mission_location_visits
  for select using (auth.uid() = user_id);

create policy "Users create their location visits" on mission_location_visits
  for insert with check (auth.uid() = user_id);

-- Update trigger
create trigger trg_mission_locations_updated_at
  before update on mission_locations
  for each row execute function touch_story_missions();



