-- Journal reflection enhancements

alter table user_visits
  add column if not exists reflection_prompts jsonb default '{}'::jsonb,
  add column if not exists mood text,
  add column if not exists tags text[] default '{}';

comment on column user_visits.reflection_prompts is 'Stores structured journaling prompt responses (conditions, habitat, phenology, action, feelings)';
comment on column user_visits.mood is 'Student-selected mood for the observation';
comment on column user_visits.tags is 'Free-form journaling tags for filtering and exports';



