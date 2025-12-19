Aquí lo tienes **íntegramente en Markdown**, sin explicaciones adicionales:

---

# 🎮 Propuesta de Minijuegos (8 niveles)

1. **Puzzle Deslizante (Sliding Puzzle)**
   Completar la imagen reordenando las piezas. Al resolverlo, aparece una letra.

2. **Juego de Memoria (Memory Match)**
   Encontrar todas las parejas de cartas. Tras completarlo, aparece la letra.

3. **Encuentra la Diferencia**
   Dos imágenes similares; encontrar las diferencias desbloquea la letra.

4. **Clic al Objetivo**
   Aparecen objetivos moviéndose por la pantalla; alcanzar una puntuación. Después se revela la letra.

5. **Sopa de Letras**
   Encontrar una palabra oculta relacionada con bebés/familia. Completado → letra revelada.

6. **Laberinto**
   Guiar un icono desde el inicio hasta el fin sin chocar paredes.

7. **Trivia Familiar**
   Responder 3–5 preguntas sencillas (quiz). Todas correctas → letra revelada.

8. **Ordena las Letras (Nivel Final)**
   Se muestran todas las letras obtenidas, mezcladas. El jugador debe ordenarlas correctamente para formar el nombre del bebé.

---

# 📘 Documentación Técnico-Funcional

## 1. Objetivo del Proyecto

Desarrollar una **web interactiva basada en 8 minijuegos**, cuyo propósito es revelar progresivamente las letras del nombre del bebé.
La web se publicará en **GitHub Pages** y usará **Supabase** para almacenar datos de configuración y progreso.

---

## 2. Requisitos Funcionales

### 2.1 Flujo General del Usuario

1. **Pantalla de bienvenida**

   * Formulario: nombre del jugador.
   * Botón *Comenzar*.
   * Se crea registro en Supabase:

     * nombreJugador
     * nivelActual = 1
     * tiempoTotal = 0
     * timestampInicio

2. **Pantalla de Nivel**

   * El jugador entra al minijuego correspondiente.
   * Al completar el nivel:

     * Mostrar letra desbloqueada.
     * Guardar duración en Supabase.
     * nivelActual += 1.

3. **Pantalla Final – Ordenar Letras**

   * Mostrar todas las letras obtenidas mezcladas.
   * Interfaz drag-and-drop para ordenar.
   * Validación contra nombre configurado.
   * Guardar tiempo total.

4. **Pantalla de Resultados**

   * Mostrar tiempo total.
   * Ranking opcional (orden por tiempo).

---

## 3. Requisitos Técnicos

### 3.1 Tecnologías

* **Frontend**: HTML/CSS/JS (o React/Svelte opcional).
* **Backend**: Supabase (DB + API).
* **Hosting**: GitHub Pages (estático).

### 3.2 Integración con Supabase

#### Tablas

```
config
------
id (uuid) PK
clave (text)
valor (text/json) ← nombre del bebé

jugadores
---------
id (uuid) PK
nombre (text)
nivel_actual (int4)
tiempo_total (int4)
creado_en (timestamp)
actualizado_en (timestamp)

progreso_niveles
----------------
id (uuid) PK
jugador_id (uuid FK)
nivel (int4)
duracion_ms (int4)
letra (text)
```

### 3.3 Configuración del Nombre

* Tabla `config`, clave `"nombre_bebe"`.
* El frontend obtiene el valor y lo divide en letras.
* Cada nivel corresponde a una letra del nombre.

Ejemplo:

```json
{
  "clave": "nombre_bebe",
  "valor": "AMELIA"
}
```

---

## 4. Especificación de Minijuegos

### 4.1 Estructura Técnica Común

* Contenedor: `#minijuego-nivel-X`
* Timer interno por nivel.
* Callback estándar:

```js
onLevelComplete(letter, durationMs)
```

Que:

* Muestra overlay de éxito.
* Guarda progreso en Supabase.
* Avanza al siguiente nivel.

---

### 4.2 Minijuego 1: Puzzle Deslizante

* Grid 3×3 o 4×4.
* Reordenar imagen hasta estar completa.

### 4.3 Minijuego 2: Memory Match

* 8–12 cartas.
* Formar parejas iguales.

### 4.4 Minijuego 3: Encuentra las Diferencias

* Dos imágenes en paralelo.
* Clics en zonas predefinidas de diferencias.

### 4.5 Minijuego 4: Clic al Objetivo

* Objetivos moviéndose en canvas.
* Requiere alcanzar cierta puntuación.

### 4.6 Minijuego 5: Sopa de Letras

* Matriz generada dinámicamente.
* Encontrar una palabra concreta.

### 4.7 Minijuego 6: Laberinto

* Canvas con laberinto precalculado.
* Mover un icono hasta la meta.

### 4.8 Minijuego 7: Trivia

* Preguntas de opción múltiple.
* Debe acertarse todo.

### 4.9 Minijuego 8: Ordenar las Letras

* Letras arrastrables.
* Validación con Supabase.

---

## 5. Requisitos No Funcionales

### 5.1 Usabilidad

* Interfaz clara para cualquier familiar.
* Cada minijuego presenta instrucciones breves.

### 5.2 Rendimiento

* Juegos optimizados para móvil y PC.
* Minijuegos en canvas: 60 FPS recomendados.

### 5.3 Seguridad

* RLS recomendado para escritura.
* Datos no sensibles.

### 5.4 Escalabilidad

* Nombre configurable.
* Posibilidad de agregar más niveles/juegos.

---

## 6. Arquitectura del Frontend

```
/src
  /minijuegos
    nivel1-puzzle.js
    nivel2-memory.js
    nivel3-diferencias.js
    nivel4-objetivos.js
    nivel5-sopa.js
    nivel6-laberinto.js
    nivel7-trivia.js
    nivel8-ordenar.js
  /services
    supabase.js
    timer.js
  /ui
    modales.js
    botones.js
  app.js
  router.js
```

* `router.js` gestiona el nivel actual según Supabase.
* `app.js` inicializa la sesión del jugador.
* Cada minijuego es un módulo independiente.

---

## 7. Flujo de Datos

```
Jugador → introduce nombre
      ↓
Supabase → crear registro (nivel 1)
      ↓
Frontend → cargar minijuego 1
      ↓
Completa nivel → guardar letra + tiempo
      ↓
nivel_actual++ → siguiente minijuego
```

Final:

```
nivel_actual = 9 → juego completo
Guardar tiempo total
Mostrar felicitaciones
```
