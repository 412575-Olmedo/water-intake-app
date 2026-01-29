# 🚀 Implementar Sistema de Salas - Water Intake App

## ⚠️ IMPORTANTE: Resolver el problema de "se borra al recargar"

El problema de que los datos se borran al recargar era porque NO se estaban guardando en la base de datos correctamente. Con esta implementación, **TODO se guarda en Supabase** y nunca se pierde.

## Paso 1: Ejecutar migración en Supabase ⚡

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Haz clic en **SQL Editor** en el menú lateral
3. Haz clic en **New Query**
4. Copia y pega TODO el contenido del archivo `scripts/004_setup_rooms_safe.sql`
5. Haz clic en **RUN** (botón verde abajo a la derecha)
6. Verifica que veas 3 resultados de verificación con "true" ✅

## Paso 2: Desplegar la app actualizada

Si ya tienes la app en Vercel:

```bash
git add .
git commit -m "feat: Sistema de salas y persistencia real"
git push
```

Vercel desplegará automáticamente.

## Paso 3: Usar el sistema de salas 👥

### Opción A: Crear una sala (primera persona)

1. Abre la app: https://tu-app.vercel.app
2. Verás un banner amarillo: "No estás en ninguna sala"
3. Haz clic en **"Configura una sala"** o en el botón **"Sala"** del header
4. Haz clic en **"Crear Sala"**
5. Se generará un código de 6 caracteres (ej: `ABC123`)
6. Haz clic en el ícono de **copiar** 📋
7. Envía el código a tu pareja por WhatsApp/Telegram/etc

### Opción B: Unirse a una sala (segunda persona)

1. Abre la app
2. Haz clic en **"Configura una sala"**
3. En la sección **"Unirse a una Sala"**
4. Ingresa el código que te compartió tu pareja
5. Haz clic en **"Unirse a Sala"**
6. ¡Listo! Ahora verán sus vasos en tiempo real 🎉

## Paso 4: Agregar vasos 💧

1. Haz clic en el botón **"+ Vaso"**
2. Los datos se guardan INMEDIATAMENTE en Supabase
3. Tu pareja verá el cambio en tiempo real
4. Si recargas la página, **los datos PERSISTEN** ✅

## ¿Qué se arregló?

- ✅ Los vasos ahora se guardan en la base de datos (Supabase)
- ✅ Al recargar, los datos NO se pierden
- ✅ Sistema de salas para ver solo a tu pareja
- ✅ Sincronización en tiempo real
- ✅ Cada sala tiene un código único de 6 caracteres

## Características del sistema de salas

- 🔐 Cada sala tiene un código único (ej: `XYZ789`)
- 👥 Solo ves los datos de personas en tu misma sala
- 🔄 Cambios en tiempo real (no necesitas recargar)
- 📱 Responsive - funciona en móvil y desktop
- 🚪 Puedes salir y unirte a otras salas cuando quieras

## Solución de problemas

### "No veo los vasos de mi pareja"
- Verifica que ambos estén en la MISMA sala (mismo código)
- Verifica que tu pareja haya agregado vasos HOY
- Recarga la página

### "Se borra al recargar"
- Esto NO debería pasar más. Si pasa:
  1. Abre la consola del navegador (F12)
  2. Ve a la pestaña "Network"
  3. Agrega un vaso
  4. Busca una petición a Supabase
  5. Si NO ves ninguna petición, hay un problema de configuración

### "No se crean las salas"
- Verifica que ejecutaste el SQL en Supabase (Paso 1)
- Revisa que las variables de entorno estén configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Próximos pasos (opcional)

- [ ] Agregar historial de días anteriores
- [ ] Agregar gráficas de progreso semanal
- [ ] Notificaciones push cuando tu pareja agrega un vaso
- [ ] Metas personalizadas por usuario
- [ ] Modo oscuro mejorado
