# Configuración de Supabase para Name Reveal

## Script SQL Completo

Ejecuta este script en el SQL Editor de Supabase:

```sql
-- ============================================
-- TABLAS
-- ============================================

-- Tabla de configuración
CREATE TABLE IF NOT EXISTS config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de jugadores
CREATE TABLE IF NOT EXISTS jugadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    nivel_actual INTEGER DEFAULT 1,
    tiempo_total INTEGER DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso de niveles
CREATE TABLE IF NOT EXISTS progreso_niveles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    nivel INTEGER NOT NULL,
    duracion_ms INTEGER NOT NULL,
    letra TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_progreso_jugador ON progreso_niveles(jugador_id);
CREATE INDEX IF NOT EXISTS idx_jugadores_nivel ON jugadores(nivel_actual);
CREATE INDEX IF NOT EXISTS idx_config_clave ON config(clave);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar el nombre del bebé (cámbialo por el nombre que desees)
-- Puede tener entre 5 y 10 letras (7 es ideal)
INSERT INTO config (clave, valor) 
VALUES ('nombre_bebe', 'AMELIA')
ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_niveles ENABLE ROW LEVEL SECURITY;

-- Políticas para config (solo lectura pública)
CREATE POLICY "Permitir lectura pública de config"
    ON config FOR SELECT
    USING (true);

-- Políticas para jugadores
CREATE POLICY "Permitir insertar jugadores"
    ON jugadores FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir leer jugadores"
    ON jugadores FOR SELECT
    USING (true);

CREATE POLICY "Permitir actualizar jugadores"
    ON jugadores FOR UPDATE
    USING (true);

-- Políticas para progreso_niveles
CREATE POLICY "Permitir insertar progreso"
    ON progreso_niveles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir leer progreso"
    ON progreso_niveles FOR SELECT
    USING (true);

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para actualizar timestamp de actualización
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente el timestamp
DROP TRIGGER IF EXISTS trigger_actualizar_timestamp ON jugadores;
CREATE TRIGGER trigger_actualizar_timestamp
    BEFORE UPDATE ON jugadores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Ver todos los jugadores con su progreso
-- SELECT 
--     j.nombre,
--     j.nivel_actual,
--     j.tiempo_total,
--     COUNT(p.id) as niveles_completados
-- FROM jugadores j
-- LEFT JOIN progreso_niveles p ON j.id = p.jugador_id
-- GROUP BY j.id, j.nombre, j.nivel_actual, j.tiempo_total
-- ORDER BY j.tiempo_total ASC;

-- Ver el ranking de jugadores
-- SELECT 
--     nombre,
--     tiempo_total / 1000.0 as tiempo_segundos,
--     nivel_actual
-- FROM jugadores
-- WHERE nivel_actual > 8
-- ORDER BY tiempo_total ASC
-- LIMIT 10;
```

## Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa los datos:
   - **Name**: name-reveal (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la más cercana a tu ubicación
   - **Pricing Plan**: Free (suficiente para este proyecto)

### 2. Ejecutar el Script SQL

1. En el panel izquierdo, ve a **SQL Editor**
2. Click en **New Query**
3. Copia y pega todo el script SQL de arriba
4. Click en **Run** (o Ctrl/Cmd + Enter)
5. Deberías ver el mensaje "Success. No rows returned"

### 3. Obtener Credenciales

1. Ve a **Settings** (⚙️ en el menú izquierdo)
2. Click en **API**
3. Copia los siguientes valores:
   - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

### 4. Configurar la Aplicación

Abre `src/services/supabase.js` y reemplaza:

```javascript
this.supabaseUrl = 'https://xxxxxxxxxxxxx.supabase.co';
this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5. Personalizar el Nombre del Bebé

**Opción A: Desde la interfaz de Supabase**
1. Ve a **Table Editor**
2. Selecciona la tabla `config`
3. Edita la fila con clave `nombre_bebe`
4. Cambia el valor a tu nombre deseado (8 letras)

**Opción B: Desde SQL Editor**
```sql
UPDATE config 
SET valor = 'ISABELLA' 
WHERE clave = 'nombre_bebe';
```

**Nota sobre la longitud del nombre:**
- Rango recomendado: 5-10 letras
- Óptimo: 7 letras (1 minijuego por letra + nivel final)
- El sistema se adapta automáticamente a cualquier longitud
- Si tiene más de 7 letras, los minijuegos se repiten ciclando

## Verificación

Para verificar que todo está funcionando:

1. Ve a **Table Editor**
2. Deberías ver tres tablas:
   - `config` (con 1 fila: nombre_bebe)
   - `jugadores` (vacía)
   - `progreso_niveles` (vacía)

## Monitoreo

### Ver Jugadores Activos

```sql
SELECT 
    nombre,
    nivel_actual,
    ROUND(tiempo_total / 1000.0, 2) as tiempo_seg,
    creado_en
FROM jugadores
ORDER BY creado_en DESC;
```

### Ver Progreso Detallado

```sql
SELECT 
    j.nombre,
    p.nivel,
    p.letra,
    ROUND(p.duracion_ms / 1000.0, 2) as duracion_seg
FROM progreso_niveles p
JOIN jugadores j ON p.jugador_id = j.id
ORDER BY j.nombre, p.nivel;
```

### Limpiar Datos de Prueba

```sql
-- ⚠️ CUIDADO: Esto borrará TODOS los jugadores y su progreso
DELETE FROM jugadores;
```

## Límites del Plan Gratuito

- **Almacenamiento**: 500 MB
- **Transferencia**: 5 GB/mes
- **Filas**: Ilimitadas

Para este proyecto, el plan gratuito es más que suficiente.

## Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script SQL completo
- Verifica que estás en el proyecto correcto

### Error: "JWT expired"
- Las credenciales (anon key) no expiran, pero verifica que las copiaste completamente

### No se guardan datos
- Verifica que las políticas RLS estén configuradas
- Revisa la consola del navegador para ver errores específicos

### Modo Demo Activo
- Si ves "⚠️ Supabase no configurado" en la consola, las credenciales no están correctas
- La app funcionará con localStorage en su lugar
