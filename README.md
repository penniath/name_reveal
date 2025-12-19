# 🎮 Juego de Revelación - LUKEN

Aplicación web interactiva con 5 minijuegos optimizados para móvil que revelan progresivamente el nombre del bebé letra por letra.

## ✨ Características

- **5 minijuegos táctiles**: Memoria, Trivia, Simón Dice, Objetivos y nivel final
- **Optimizado para móvil**: Diseñado específicamente para pantallas táctiles
- **Sin configuración**: Funciona directamente sin necesidad de backend
- **Progreso automático**: Guarda el avance en localStorage del navegador
- **Responsive**: Se adapta perfectamente a cualquier tamaño de pantalla

## 🎯 Minijuegos

1. **Memoria** - Encuentra todas las parejas de cartas → Revela la **L**
2. **Trivia** - Responde preguntas sobre la familia → Revela la **U**
3. **Simón Dice** - Memoriza y repite secuencias de colores → Revela la **K**
4. **Objetivos** - Toca los círculos antes de que desaparezcan → Revela la **E**
5. **¡Ordena!** - Ordena las letras L-U-K-E-N para formar el nombre → Revela la **N**

## 🚀 Instalación

### Opción 1: Servidor local con Python

```bash
# En la carpeta del proyecto
python3 -m http.server 8000

# Abre http://localhost:8000 en tu navegador
```

### Opción 2: Con npm

```bash
npm install
npm run dev

# Abre http://localhost:8000
```

### Opción 3: GitHub Pages

Sube el proyecto a GitHub y activa GitHub Pages desde la rama `main`. El workflow incluido se encargará del deployment automático.

## ⚙️ Configuración

### Cambiar el nombre

Edita el archivo `src/services/supabase.js` línea 4:

```javascript
this.nombreBebe = 'TUNOMBRE'; // Cambia LUKEN por el nombre que quieras
```

**Importante**: 
- Usa entre 4-8 letras para mejor experiencia
- El nombre debe estar en MAYÚSCULAS
- Si cambias el número de letras, el juego se ajusta automáticamente

### Personalizar juegos

Los juegos están en la carpeta `src/minijuegos/`. Puedes modificar:
- Nivel de dificultad
- Colores y estilos
- Preguntas de trivia (en `nivel7-trivia.js`)
- Secuencias de Simón Dice (en `nivel1-simon.js`)

## 📱 Uso en móviles

La aplicación está completamente optimizada para móviles:

- ✅ **Touch events**: Todos los juegos responden al tacto
- ✅ **No requiere zoom**: Botones y áreas táctiles grandes
- ✅ **Orientación flexible**: Funciona en vertical y horizontal
- ✅ **Sin instalación**: Solo abre el link en el navegador

## 📂 Estructura del Proyecto

```
name_reveal/
├── index.html              # Página principal
├── src/
│   ├── app.js             # Inicialización de la aplicación
│   ├── router.js          # Gestión de niveles
│   ├── minijuegos/        # Los 5 minijuegos
│   │   ├── nivel1-simon.js
│   │   ├── nivel2-memory.js
│   │   ├── nivel4-objetivos.js
│   │   ├── nivel7-trivia.js
│   │   └── nivel8-ordenar.js
│   ├── services/
│   │   ├── supabase.js    # Gestión de datos (localStorage)
│   │   └── timer.js       # Cronómetro
│   ├── ui/
│   │   └── modales.js     # Modales de revelación
│   └── styles/
│       └── main.css       # Estilos completos
├── package.json
└── README.md
```

## 🎨 Personalización de Estilos

Edita `src/styles/main.css` para cambiar colores, fuentes y animaciones.

Variables CSS principales:
```css
:root {
    --color-primary: #3498db;
    --color-secondary: #2ecc71;
    --color-background: #ecf0f1;
    --color-text: #2c3e50;
}
```

## 🐛 Solución de Problemas

### Los juegos no cargan
- Verifica que estés usando un servidor HTTP (no abras el archivo directamente)
- Revisa la consola del navegador (F12) para ver errores

### El progreso no se guarda
- Asegúrate de que el navegador permita localStorage
- No uses modo incógnito/privado

### Los botones no responden en móvil
- Recarga la página (puede ser un problema de caché)
- Asegúrate de que JavaScript esté habilitado

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de modificarlo y adaptarlo a tus necesidades.

## 🤝 Contribuciones

¿Tienes ideas para nuevos minijuegos o mejoras? ¡Las contribuciones son bienvenidas!

---

**Desarrollado con ❤️ para revelar el nombre de LUKEN**
