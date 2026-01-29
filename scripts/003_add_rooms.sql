-- Add room_code to profiles for pairing users
alter table public.profiles add column if not exists room_code text;

-- Create index for faster room lookups
create index if not exists profiles_room_code_idx on public.profiles(room_code);

-- Update water_logs policy to only see logs from users in the same room
drop policy if exists "water_logs_select_all" on public.water_logs;
create policy "water_logs_select_same_room" on public.water_logs 
  for select using (
    user_id in (
      select p.id from public.profiles p 
      where p.room_code = (
        select room_code from public.profiles where id = auth.uid()
      )
      and p.room_code is not null
    )
  );

-- Update profiles policy to only see profiles from same room
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_same_room" on public.profiles 
  for select using (
    room_code = (select room_code from public.profiles where id = auth.uid())
    or id = auth.uid()
  );
