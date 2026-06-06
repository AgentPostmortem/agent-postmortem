alter table public.posts
  add column if not exists source_url text,
  add column if not exists source_title text,
  add column if not exists source_published_at timestamptz,
  add column if not exists verified_facts text[] not null default '{}',
  add column if not exists unknowns text[] not null default '{}',
  add column if not exists lessons text[] not null default '{}';

create unique index if not exists posts_source_url_unique
  on public.posts (source_url)
  where source_url is not null;
