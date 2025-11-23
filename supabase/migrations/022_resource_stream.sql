-- Resource updates feed for Penn State Extension and conservation alerts

create type resource_category as enum ('article', 'workshop', 'alert', 'grant', 'toolkit');

create table if not exists resource_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  category resource_category not null default 'article',
  tags text[] default '{}',
  source_name text,
  source_url text,
  featured boolean default false,
  published_at timestamptz not null default now(),
  added_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resource_updates_category_idx on resource_updates (category);
create index if not exists resource_updates_published_idx on resource_updates (published_at desc);
create index if not exists resource_updates_tags_idx on resource_updates using gin (tags);

alter table resource_updates enable row level security;

create policy "Resource updates are readable by anyone"
  on resource_updates
  for select
  using (true);

create policy "Educators can insert resource updates"
  on resource_updates
  for insert
  with check (
    exists (
      select 1
      from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

create policy "Educators can update resource updates"
  on resource_updates
  for update
  using (
    exists (
      select 1
      from users
      where id = auth.uid()
      and role in ('educator', 'teacher', 'admin', 'partner')
    )
  );

create or replace function touch_resource_updates()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_resource_updates_updated_at
  before update on resource_updates
  for each row execute function touch_resource_updates();




