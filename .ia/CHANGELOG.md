# Changelog - Proyecto LUKEN

## Versión 2.0 - Simplificación y Optimización Móvil (19 Dic 2025)

### 🔥 Cambios Mayores

- ✅ **Eliminada integración con Supabase** - Ahora solo usa localStorage
- ✅ **Nombre cambiado a LUKEN** - 5 letras, 5 niveles
- ✅ **Optimizado para móvil** - Solo juegos táctiles
- ✅ **Reducido a 5 juegos** - Memoria, Trivia, Simón Dice, Objetivos, Ordenar

### 📱 Juegos Optimizados

**Eliminados** (no óptimos para móvil):
- ❌ Diferencias (difícil de hacer zoom en móvil)
- ❌ Sopa de letras (pequeña en pantallas móviles)
- ❌ Laberinto (control complicado con touch)
- ❌ Puzzle deslizante (muy pequeño)

**Mantenidos** (perfectos para táctil):
- ✅ Memoria - Tocar cartas
- ✅ Trivia - Tocar respuestas
- ✅ Simón Dice - Tocar botones de colores (con animación arreglada)
- ✅ Objetivos - Tocar círculos
- ✅ Ordenar letras - Drag & drop táctil

### 🛠️ Correcciones Técnicas

- Simón Dice: Animación visual ahora funciona correctamente
  - Cambiado de clases CSS a estilos inline directos
  - Aumentado tiempo de iluminación a 1.2s
  - Auto-inicio después de 1.5s
  - Brightness aumentado a 3x, scale 1.3x, borde blanco 5px

### 📦 Estructura Simplificada

```
src/
├── minijuegos/
│   ├── nivel1-simon.js      # L
│   ├── nivel2-memory.js     # U
│   ├── nivel4-objetivos.js  # K
│   ├── nivel7-trivia.js     # E
│   └── nivel8-ordenar.js    # N (final)
└── services/
    └── supabase.js          # Simplificado, solo localStorage
```

### 🚀 Para Usar

1. `python3 -m http.server 8000`
2. Abrir `http://localhost:8000`
3. Jugar en móvil o PC
4. El progreso se guarda automáticamente

### 🔧 Para Reiniciar Progreso

En la consola del navegador (F12):
```javascript
localStorage.clear();
location.reload();
```

---

## Versión 1.0 - Inicial (30 Nov 2025)

- Proyecto completo con 8 minijuegos
- Integración con Supabase
- Modo desarrollo/producción
- Sistema dinámico de niveles
