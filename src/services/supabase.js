// Servicio de almacenamiento local (sin Supabase)
export class SupabaseService {
    constructor() {
        this.nombreBebe = 'LUKEN';
        this.initialized = false;
        console.log('🎮 Juego inicializado - Nombre: ' + this.nombreBebe);
    }

    async init() {
        if (this.initialized) return;
        this.initialized = true;
    }

    // Obtener datos del localStorage
    getData() {
        const data = localStorage.getItem('gameData');
        return data ? JSON.parse(data) : {
            jugadores: [],
            config: { nombre_bebe: this.nombreBebe },
            progreso: []
        };
    }

    // Guardar datos en localStorage
    setData(data) {
        localStorage.setItem('gameData', JSON.stringify(data));
    }

    // Crear jugador
    async crearJugador(nombre) {
        await this.init();

        const nuevoJugador = {
            id: this.generateId(),
            nombre: nombre,
            nivel_actual: 1,
            tiempo_total: 0,
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString()
        };

        const data = this.getData();
        data.jugadores.push(nuevoJugador);
        this.setData(data);
        return nuevoJugador;
    }

    // Obtener jugador
    async obtenerJugador(id) {
        await this.init();
        const data = this.getData();
        return data.jugadores.find(j => j.id === id);
    }

    // Actualizar nivel del jugador
    async actualizarNivel(jugadorId, nuevoNivel, tiempoTotal) {
        await this.init();
        const gameData = this.getData();
        const jugador = gameData.jugadores.find(j => j.id === jugadorId);
        if (jugador) {
            jugador.nivel_actual = nuevoNivel;
            jugador.tiempo_total = tiempoTotal;
            jugador.actualizado_en = new Date().toISOString();
            this.setData(gameData);
        }
        return jugador;
    }

    // Guardar progreso de nivel
    async guardarProgresoNivel(jugadorId, nivel, duracionMs, letra) {
        await this.init();

        const progreso = {
            id: this.generateId(),
            jugador_id: jugadorId,
            nivel: nivel,
            duracion_ms: duracionMs,
            letra: letra
        };

        const data = this.getData();
        data.progreso.push(progreso);
        this.setData(data);
        return progreso;
    }

    // Obtener nombre del bebé
    async obtenerNombreBebe() {
        await this.init();
        return this.nombreBebe;
    }

    // Obtener todas las letras desbloqueadas
    async obtenerLetrasDesbloqueadas(jugadorId) {
        await this.init();
        const data = this.getData();
        return data.progreso
            .filter(p => p.jugador_id === jugadorId)
            .sort((a, b) => a.nivel - b.nivel)
            .map(p => p.letra);
    }

    // Generar ID único
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
