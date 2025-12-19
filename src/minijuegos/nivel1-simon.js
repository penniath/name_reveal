// Nivel 1: Simón Dice (Mini-Simon)
export class Nivel1Simon {
    constructor(contenedor, onComplete) {
        this.contenedor = contenedor;
        this.onComplete = onComplete;
        this.secuencia = [];
        this.secuenciaJugador = [];
        this.nivel = 1;
        this.maxNivel = 3; // 3 rondas para completar
        this.reproduciendo = false;
        this.esperandoInput = false;
        this.startTime = Date.now();
        this.colores = ['rojo', 'verde', 'azul', 'amarillo'];
        this.init();
    }

    init() {
        console.log('🎮 Inicializando Simon Says...');
        this.contenedor.innerHTML = `
            <div class="simon-container">
                <div class="simon-info">
                    <p class="simon-nivel">Nivel: <span id="simon-nivel">1</span>/${this.maxNivel}</p>
                    <p class="simon-mensaje" id="simon-mensaje">Pulsa "Comenzar" para empezar</p>
                </div>
                
                <div class="simon-board">
                    <div class="simon-btn simon-rojo" data-color="rojo"></div>
                    <div class="simon-btn simon-verde" data-color="verde"></div>
                    <div class="simon-btn simon-azul" data-color="azul"></div>
                    <div class="simon-btn simon-amarillo" data-color="amarillo"></div>
                </div>

                <div class="simon-controles">
                    <button id="btn-comenzar" class="btn-primary">Comenzar</button>
                </div>
            </div>
        `;

        // Esperar un momento para que el DOM se renderice
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    setupEventListeners() {
        console.log('📋 Configurando event listeners...');
        const btnComenzar = document.getElementById('btn-comenzar');
        console.log('Botón comenzar:', btnComenzar);
        
        if (!btnComenzar) {
            console.error('❌ Botón comenzar no encontrado');
            return;
        }

        console.log('✅ Botón comenzar encontrado, agregando listener');
        
        const iniciar = (e) => {
            e?.preventDefault();
            e?.stopPropagation();
            console.log('🎯 ¡COMENZAR CLICKED!');
            btnComenzar.style.display = 'none';
            this.iniciarJuego();
        };
        
        // Múltiples formas de capturar el click para asegurar compatibilidad
        btnComenzar.addEventListener('click', iniciar, true);
        btnComenzar.addEventListener('touchend', iniciar, true);
        btnComenzar.style.cursor = 'pointer';
        btnComenzar.style.pointerEvents = 'auto';
        btnComenzar.style.position = 'relative';
        btnComenzar.style.zIndex = '1000';
        
        // Auto-inicio para asegurar que funcione (puedes hacer click antes si quieres)
        setTimeout(() => {
            console.log('🤖 Auto-iniciando juego...');
            iniciar();
        }, 1500);

        // Event listeners para los botones de colores
        const botones = document.querySelectorAll('.simon-btn');
        console.log('Botones encontrados:', botones.length);
        
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.esperandoInput && !this.reproduciendo) {
                    const color = e.target.dataset.color;
                    console.log('Click en color:', color);
                    this.manejarClick(color);
                }
            });

            // Prevenir selección de texto
            btn.addEventListener('mousedown', (e) => e.preventDefault());
        });
    }

    iniciarJuego() {
        console.log('🎲 INICIAR JUEGO');
        this.secuencia = [];
        this.nivel = 1;
        this.siguienteRonda();
    }

    siguienteRonda() {
        console.log('Siguiente ronda, nivel:', this.nivel); // Debug
        this.secuenciaJugador = [];
        this.esperandoInput = false;
        
        // Agregar nuevo color a la secuencia
        const nuevoColor = this.colores[Math.floor(Math.random() * this.colores.length)];
        this.secuencia.push(nuevoColor);
        console.log('Secuencia actual:', this.secuencia); // Debug

        // Actualizar UI
        const nivelElement = document.getElementById('simon-nivel');
        if (nivelElement) {
            nivelElement.textContent = this.nivel;
        }
        this.mostrarMensaje(`Nivel ${this.nivel} - Observa...`);

        // Reproducir secuencia después de un breve delay
        setTimeout(() => {
            this.reproducirSecuencia();
        }, 1000);
    }

    async reproducirSecuencia() {
        console.log('Reproducir secuencia:', this.secuencia); // Debug
        this.reproduciendo = true;
        // NO deshabilitar botones durante reproducción para que se vea la animación

        for (let i = 0; i < this.secuencia.length; i++) {
            console.log('Iluminando:', this.secuencia[i]); // Debug
            await this.esperar(500); // Espera entre botones
            await this.iluminarBoton(this.secuencia[i]);
            await this.esperar(300); // Espera después de iluminar
        }

        console.log('Secuencia completada'); // Debug
        this.reproduciendo = false;
        this.esperandoInput = true;
        this.mostrarMensaje('¡Tu turno!');
    }

    async iluminarBoton(color) {
        console.log('=== ILUMINAR BOTÓN ===', color);
        const btn = document.querySelector(`[data-color="${color}"]`);
        if (!btn) {
            console.error('❌ Botón no encontrado:', color);
            return;
        }

        console.log('✅ Botón encontrado');
        console.log('Clases antes:', btn.className);
        console.log('Estilo computado antes:', window.getComputedStyle(btn).filter);
        
        // Forzar iluminación con estilo directo
        const estilosOriginales = {
            filter: btn.style.filter,
            transform: btn.style.transform,
            boxShadow: btn.style.boxShadow,
            background: btn.style.background,
            border: btn.style.border
        };
        
        // Aplicar estilos directamente (esto DEBE verse)
        btn.style.filter = 'brightness(3) saturate(2)';
        btn.style.transform = 'scale(1.3)';
        btn.style.border = '5px solid white';
        btn.style.zIndex = '999';
        
        const coloresLuminosos = {
            rojo: '#ff3333',
            verde: '#33ff33',
            azul: '#3399ff',
            amarillo: '#ffff33'
        };
        btn.style.background = coloresLuminosos[color];
        btn.style.boxShadow = `0 0 100px 40px ${coloresLuminosos[color]}`;
        
        console.log('🔆 ILUMINADO - Estilo aplicado:', btn.style.filter);
        this.reproducirSonido(color);
        
        await this.esperar(1200); // 1.2 segundos bien visible
        
        // Restaurar estilos originales
        btn.style.filter = estilosOriginales.filter;
        btn.style.transform = estilosOriginales.transform;
        btn.style.boxShadow = estilosOriginales.boxShadow;
        btn.style.background = estilosOriginales.background;
        btn.style.border = estilosOriginales.border;
        btn.style.zIndex = '';
        
        console.log('🔅 Apagado');
    }

    manejarClick(color) {
        this.secuenciaJugador.push(color);
        
        // Iluminar brevemente cuando el jugador hace clic
        const btn = document.querySelector(`[data-color="${color}"]`);
        if (btn) {
            btn.classList.add('activo');
            this.reproducirSonido(color);
            setTimeout(() => btn.classList.remove('activo'), 200);
        }

        // Verificar si el color es correcto
        const indiceActual = this.secuenciaJugador.length - 1;
        
        if (this.secuencia[indiceActual] !== color) {
            // Error
            this.gameOver();
            return;
        }

        // Si completó la secuencia correctamente
        if (this.secuenciaJugador.length === this.secuencia.length) {
            this.esperandoInput = false;
            
            if (this.nivel >= this.maxNivel) {
                // ¡Victoria!
                setTimeout(() => this.win(), 500);
            } else {
                // Siguiente nivel
                this.nivel++;
                setTimeout(() => this.siguienteRonda(), 1000);
            }
        }
    }

    gameOver() {
        this.esperandoInput = false;
        this.deshabilitarBotones();
        this.mostrarMensaje('❌ ¡Error! Intenta de nuevo');

        setTimeout(() => {
            document.getElementById('btn-comenzar').style.display = 'block';
            this.mostrarMensaje('Pulsa comenzar para intentarlo de nuevo');
        }, 1500);
    }

    win() {
        this.esperandoInput = false;
        this.deshabilitarBotones();
        this.mostrarMensaje('🎉 ¡Perfecto!');
        
        const duration = Date.now() - this.startTime;
        setTimeout(() => {
            this.onComplete(duration);
        }, 1000);
    }

    mostrarMensaje(texto) {
        const mensaje = document.getElementById('simon-mensaje');
        if (mensaje) {
            mensaje.textContent = texto;
        }
    }

    deshabilitarBotones() {
        const botones = document.querySelectorAll('.simon-btn');
        botones.forEach(btn => btn.classList.add('deshabilitado'));
    }

    habilitarBotones() {
        const botones = document.querySelectorAll('.simon-btn');
        botones.forEach(btn => btn.classList.remove('deshabilitado'));
    }

    reproducirSonido(color) {
        // Crear un tono simple usando Web Audio API
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const frecuencias = {
            rojo: 261.63,    // Do
            verde: 329.63,   // Mi
            azul: 392.00,    // Sol
            amarillo: 523.25 // Do (octava superior)
        };

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frecuencias[color];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.contenedor.innerHTML = '';
    }
}
