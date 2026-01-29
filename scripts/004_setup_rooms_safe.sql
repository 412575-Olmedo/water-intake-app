-- Verificar y ejecutar migraciones para sistema de salas
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Agregar columna room_code si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'room_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN room_code text;
  END IF;
END $$;

-- 2. Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS profiles_room_code_idx ON public.profiles(room_code);

-- 3. Actualizar políticas de seguridad para water_logs
DROP POLICY IF EXISTS "water_logs_select_all" ON public.water_logs;
DROP POLICY IF EXISTS "water_logs_select_same_room" ON public.water_logs;

CREATE POLICY "water_logs_select_same_room" ON public.water_logs 
  FOR SELECT USING (
    user_id IN (
      SELECT p.id FROM public.profiles p 
      WHERE p.room_code = (
        SELECT room_code FROM public.profiles WHERE id = auth.uid()
      )
      AND p.room_code IS NOT NULL
    )
    OR user_id = auth.uid()
  );

-- 4. Actualizar políticas de seguridad para profiles
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_same_room" ON public.profiles;

CREATE POLICY "profiles_select_same_room" ON public.profiles 
  FOR SELECT USING (
    room_code = (SELECT room_code FROM public.profiles WHERE id = auth.uid())
    OR id = auth.uid()
    OR room_code IS NULL
  );

-- 5. Agregar política para actualizar room_code
DROP POLICY IF EXISTS "profiles_update_own_room" ON public.profiles;

CREATE POLICY "profiles_update_own_room" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Verificar que todo esté correcto
SELECT 
  'Columna room_code existe' as check_name,
  EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'room_code'
  ) as result
UNION ALL
SELECT 
  'Índice existe',
  EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND indexname = 'profiles_room_code_idx'
  )
UNION ALL
SELECT 
  'Políticas configuradas',
  COUNT(*) >= 2
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'water_logs')
AND policyname LIKE '%room%';
