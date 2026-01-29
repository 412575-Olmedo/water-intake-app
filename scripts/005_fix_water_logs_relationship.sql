-- Fix the relationship between water_logs and profiles
-- This allows PostgREST to properly join the tables

-- 1. Drop the old foreign key to auth.users
ALTER TABLE public.water_logs 
  DROP CONSTRAINT IF EXISTS water_logs_user_id_fkey;

-- 2. Add a new foreign key to profiles table
-- Note: profiles.id already references auth.users.id, so this maintains data integrity
ALTER TABLE public.water_logs
  ADD CONSTRAINT water_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- 3. Verify the relationship exists
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'water_logs'
  AND kcu.column_name = 'user_id';
