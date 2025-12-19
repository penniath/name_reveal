// Router - Gestiona la navegación entre niveles
import { Nivel1Simon } from './minijuegos/nivel1-simon.js';
import { Nivel2Memory } from './minijuegos/nivel2-memory.js';
import { Nivel5Sopa } from './minijuegos/nivel5-sopa.js';
import { Nivel6Diferencias } from './minijuegos/nivel6-diferencias.js';
import { Nivel7Trivia } from './minijuegos/nivel7-trivia.js';
import { Nivel8Ordenar } from './minijuegos/nivel8-ordenar.js';

export class Router {
    constructor(supabase, timer, modales, jugador) {
        this.supabase = supabase;
        this.timer = timer;
        this.modales = modales;
        this.jugador = jugador;
        this.nivelActual = null;
        this.nombreBebe = null;
        this.tiempoTotalInicio = Date.now();
        this.ordenJuegos = null; // Orden aleatorio de juegos
        this.ordenLetras = null; // Orden aleatorio de letras
    }

    async cargarNivel(numeroNivel) {
        // Obtener nombre del bebé si no lo tenemos
        if (!this.nombreBebe) {
            this.nombreBebe = await this.supabase.obtenerNombreBebe();
            
            // Crear orden aleatorio de juegos (índices 0-4)
            this.ordenJuegos = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
            
            // Crear orden aleatorio de letras
            this.ordenLetras = this.nombreBebe.split('').sort(() => Math.random() - 0.5);
            
            console.log('🎲 Orden de juegos:', this.ordenJuegos);
            console.log('🔤 Orden de letras:', this.ordenLetras);
        }

        const totalNiveles = this.nombreBebe.length + 1; // 5 letras + 1 nivel final = 6 niveles
        
        // Verificar si ya completó todos los niveles
        if (numeroNivel > totalNiveles) {
            await this.finalizarJuego();
            return;
        }

        // Actualizar UI del header
        this.actualizarHeader(numeroNivel, totalNiveles);

        // Limpiar nivel anterior
        if (this.nivelActual && this.nivelActual.destroy) {
            this.nivelActual.destroy();
        }

        // Resetear timer
        this.timer.reset();
        this.timer.start();

        // Cargar el minijuego correspondiente
        const contenedor = document.getElementById('contenedor-minijuego');
        contenedor.innerHTML = '';

        // Si es el último nivel (6 = ordenar), usar todas las letras obtenidas
        if (numeroNivel === totalNiveles) {
            this.nivelActual = new Nivel8Ordenar(contenedor, 
                (duracion) => this.onNivelCompletado(numeroNivel, null, duracion), 
                this.supabase, this.jugador.id);
            this.actualizarInstrucciones('¡Nivel Final!', 'Ordena las letras para formar el nombre');
        } else {
            // Niveles 1-5: usar juegos en orden aleatorio y dar letras en orden aleatorio
            const indiceJuego = this.ordenJuegos[numeroNivel - 1];
            const letra = this.ordenLetras[numeroNivel - 1];
            const onComplete = (duracion) => this.onNivelCompletado(numeroNivel, letra, duracion);

            // 5 juegos disponibles
            const juegosDisponibles = [
                { clase: Nivel2Memory, titulo: 'Memoria', desc: 'Encuentra todas las parejas de cartas' },
                { clase: Nivel7Trivia, titulo: 'Trivia', desc: 'Responde correctamente las preguntas' },
                { clase: Nivel1Simon, titulo: 'Simón Dice', desc: 'Memoriza y repite la secuencia' },
                { clase: Nivel5Sopa, titulo: 'Sopa de Letras', desc: 'Encuentra la palabra FAMILIA' },
                { clase: Nivel6Diferencias, titulo: 'Diferencias', desc: 'Encuentra todas las diferencias' }
            ];

            const juego = juegosDisponibles[indiceJuego];
            this.nivelActual = new juego.clase(contenedor, onComplete);
            this.actualizarInstrucciones(juego.titulo, juego.desc);
        }
    }

    actualizarHeader(nivel, total) {
        const textoNivel = document.getElementById('nivel-actual-texto');
        const barraProgreso = document.getElementById('barra-progreso-fill');
        
        textoNivel.textContent = `Nivel ${nivel} de ${total}`;
        const porcentaje = (nivel / total) * 100;
        barraProgreso.style.width = `${porcentaje}%`;
    }

    actualizarInstrucciones(titulo, descripcion) {
        const tituloElement = document.getElementById('titulo-nivel');
        const descripcionElement = document.getElementById('descripcion-nivel');
        
        tituloElement.textContent = titulo;
        descripcionElement.textContent = descripcion;
    }

    async onNivelCompletado(numeroNivel, letra, duracion) {
        // Detener timer
        this.timer.stop();

        const totalNiveles = this.nombreBebe.length + 1; // 6 niveles

        try {
            // Guardar progreso en Supabase
            await this.supabase.guardarProgresoNivel(
                this.jugador.id,
                numeroNivel,
                duracion,
                letra
            );

            // Calcular tiempo total acumulado
            const tiempoTotal = Date.now() - this.tiempoTotalInicio;

            // Actualizar nivel del jugador
            const siguienteNivel = numeroNivel + 1;
            await this.supabase.actualizarNivel(
                this.jugador.id,
                siguienteNivel,
                tiempoTotal
            );

            // Actualizar jugador local
            this.jugador.nivel_actual = siguienteNivel;
            this.jugador.tiempo_total = tiempoTotal;

            // Si es el último nivel (ordenar), ir directo a resultados
            if (numeroNivel === totalNiveles) {
                await this.finalizarJuego();
            } else {
                // Mostrar modal de letra desbloqueada
                this.modales.mostrarLetraDesbloqueada(
                    letra,
                    numeroNivel,
                    totalNiveles - 1, // Mostrar X de 5, no de 6
                    () => this.cargarNivel(siguienteNivel)
                );
            }

        } catch (error) {
            console.error('Error al completar nivel:', error);
            alert('Hubo un error al guardar tu progreso. Intenta de nuevo.');
        }
    }

    async finalizarJuego() {
        // Detener timer
        this.timer.stop();

        // Mostrar pantalla de resultados
        const nombreRevelado = document.getElementById('nombre-revelado');
        nombreRevelado.textContent = this.nombreBebe;

        const tiempoTotal = document.getElementById('tiempo-total');
        tiempoTotal.textContent = this.timer.formatTime(this.jugador.tiempo_total);

        const nombreJugadorFinal = document.getElementById('nombre-jugador-final');
        nombreJugadorFinal.textContent = this.jugador.nombre;

        // Cambiar a pantalla de resultados
        document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
        document.getElementById('pantalla-resultados').classList.add('activa');
    }
}
