-- Create profiles table for user display names
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Profiles policies - users can see all profiles (for partner tracking)
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Create water_logs table
create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  glasses int not null default 0,
  date date not null default current_date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table public.water_logs enable row level security;

-- Water logs policies - all authenticated users can see all logs (for partner sync)
create policy "water_logs_select_all" on public.water_logs for select using (true);
create policy "water_logs_insert_own" on public.water_logs for insert with check (auth.uid() = user_id);
create policy "water_logs_update_own" on public.water_logs for update using (auth.uid() = user_id);
create policy "water_logs_delete_own" on public.water_logs for delete using (auth.uid() = user_id);

-- Enable realtime for water_logs
alter publication supabase_realtime add table water_logs;
alter publication supabase_realtime add table profiles;
