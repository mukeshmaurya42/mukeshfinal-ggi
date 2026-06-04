
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id);

-- roles
create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "roles self select" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- content history
create table public.content_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null,
  title text,
  prompt_input jsonb not null default '{}'::jsonb,
  generated_content text not null,
  language text not null default 'English',
  seo_score int,
  marketing_score int,
  readability_score int,
  word_count int,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.content_history to authenticated;
grant all on public.content_history to service_role;
alter table public.content_history enable row level security;
create policy "content self select" on public.content_history for select to authenticated using (auth.uid() = user_id);
create policy "content admin select" on public.content_history for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "content self insert" on public.content_history for insert to authenticated with check (auth.uid() = user_id);
create policy "content self update" on public.content_history for update to authenticated using (auth.uid() = user_id);
create policy "content self delete" on public.content_history for delete to authenticated using (auth.uid() = user_id);
create index content_history_user_idx on public.content_history(user_id, created_at desc);

-- auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_roles(user_id, role) values (new.id, 'user')
  on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
