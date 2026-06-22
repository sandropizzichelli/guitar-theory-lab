create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'teacher', 'institution')),
  subscription_status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tool_id text not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  notes text,
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_items_user_id_idx on public.saved_items(user_id);
create index if not exists saved_items_tool_id_idx on public.saved_items(tool_id);
create index if not exists saved_items_created_at_idx on public.saved_items(created_at desc);

alter table public.profiles enable row level security;
alter table public.saved_items enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read their own saved items"
on public.saved_items for select
using (auth.uid() = user_id);

create policy "Users can insert their own saved items"
on public.saved_items for insert
with check (auth.uid() = user_id);

create policy "Users can update their own saved items"
on public.saved_items for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own saved items"
on public.saved_items for delete
using (auth.uid() = user_id);
