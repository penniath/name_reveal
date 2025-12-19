// Importaciones
import { SupabaseService } from './services/supabase.js';
import { Timer } from './services/timer.js';
import { Router } from './router.js';
import { Modales } from './ui/modales.js';

class App {
    constructor() {
        this.supabase = new SupabaseService();
        this.timer = new Timer();
        this.router = null;
        this.modales = new Modales();
        this.jugadorActual = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkSession();
    }

    setupEventListeners() {
        // Botón reiniciar
        const btnReiniciar = document.getElementById('btn-reiniciar');
        btnReiniciar?.addEventListener('click', () => this.reiniciarJuego());
    }

    async comenzarJuego() {
        try {
            // Crear jugador automáticamente sin pedir nombre
            const jugador = await this.supabase.crearJugador('Jugador');
            this.jugadorActual = jugador;

            // Guardar en localStorage
            localStorage.setItem('jugadorId', jugador.id);

            // Iniciar router y primer nivel
            this.router = new Router(this.supabase, this.timer, this.modales, jugador);
            await this.router.cargarNivel(1);

            // Mostrar pantalla de nivel directamente
            this.mostrarPantalla('pantalla-nivel');
        } catch (error) {
            console.error('Error al comenzar el juego:', error);
            alert('Hubo un error al iniciar. Por favor, recarga la página.');
        }
    }

    async checkSession() {
        // Verificar si hay una sesión guardada
        const jugadorId = localStorage.getItem('jugadorId');
        if (jugadorId) {
            try {
                const jugador = await this.supabase.obtenerJugador(jugadorId);
                if (jugador) {
                    this.jugadorActual = jugador;
                    
                    const nombreBebe = await this.supabase.obtenerNombreBebe();
                    const totalNiveles = nombreBebe.length;
                    
                    // Si ya completó el juego
                    if (jugador.nivel_actual > totalNiveles) {
                        await this.mostrarResultados();
                    } else {
                        // Continuar donde se quedó
                        this.router = new Router(this.supabase, this.timer, this.modales, jugador);
                        await this.router.cargarNivel(jugador.nivel_actual);
                        this.mostrarPantalla('pantalla-nivel');
                    }
                    return;
                }
            } catch (error) {
                console.error('Error al verificar sesión:', error);
                localStorage.removeItem('jugadorId');
            }
        }
        
        // Si no hay sesión, comenzar juego automáticamente
        await this.comenzarJuego();
    }

    mostrarPantalla(pantallaId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.pantalla').forEach(p => {
            p.classList.remove('activa');
        });

        // Mostrar la pantalla solicitada
        const pantalla = document.getElementById(pantallaId);
        if (pantalla) {
            pantalla.classList.add('activa');
        }
    }

    async mostrarResultados() {
        if (!this.jugadorActual) return;

        // Obtener nombre del bebé
        const nombreBebe = await this.supabase.obtenerNombreBebe();
        
        // Mostrar nombre revelado
        const nombreRevelado = document.getElementById('nombre-revelado');
        nombreRevelado.textContent = nombreBebe;

        // Mostrar estadísticas
        const tiempoTotal = document.getElementById('tiempo-total');
        tiempoTotal.textContent = this.formatearTiempo(this.jugadorActual.tiempo_total || 0);

        this.mostrarPantalla('pantalla-resultados');
    }

    formatearTiempo(ms) {
        const totalSegundos = Math.floor(ms / 1000);
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    reiniciarJuego() {
        localStorage.clear();
        this.jugadorActual = null;
        this.router = null;
        this.timer.stop();
        
        // Recargar la página para empezar de nuevo
        location.reload();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
