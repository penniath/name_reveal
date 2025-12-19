// Nivel 8: Ordenar Letras (Nivel Final)
export class Nivel8Ordenar {
    constructor(contenedor, onComplete, supabase, jugadorId) {
        this.contenedor = contenedor;
        this.onComplete = onComplete;
        this.supabase = supabase;
        this.jugadorId = jugadorId;
        this.startTime = Date.now();
        this.letrasDesbloqueadas = [];
        this.letrasOrdenadas = [];
        this.nombreCorrecto = '';
        this.draggedElement = null;
        this.init();
    }

    async init() {
        // Obtener letras desbloqueadas
        this.letrasDesbloqueadas = await this.supabase.obtenerLetrasDesbloqueadas(this.jugadorId);
        this.nombreCorrecto = await this.supabase.obtenerNombreBebe();

        // Mezclar letras
        const letrasMezcladas = this.shuffle([...this.letrasDesbloqueadas]);

        this.contenedor.innerHTML = `
            <div class="ordenar-container">
                <p class="instrucciones-ordenar">Arrastra las letras para formar el nombre del bebé</p>
                
                <div class="letras-disponibles" id="letras-disponibles">
                    ${letrasMezcladas.map((letra, index) => `
                        <div class="letra-draggable" draggable="true" data-letra="${letra}" data-index="${index}">
                            ${letra}
                        </div>
                    `).join('')}
                </div>

                <div class="zona-ordenar" id="zona-ordenar">
                    ${this.letrasDesbloqueadas.map((_, index) => `
                        <div class="slot-letra" data-slot="${index}"></div>
                    `).join('')}
                </div>

                <div class="botones-ordenar">
                    <button class="btn-primary" id="btn-verificar">Verificar</button>
                    <button class="btn-secondary" id="btn-limpiar">Limpiar</button>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
        this.setupButtons();
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    setupDragAndDrop() {
        const letras = document.querySelectorAll('.letra-draggable');
        const slots = document.querySelectorAll('.slot-letra');

        letras.forEach(letra => {
            letra.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
            });

            letra.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            // Touch events para móvil
            letra.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            letra.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            letra.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                if (this.draggedElement) {
                    // Si el slot ya tiene una letra, devolverla
                    if (slot.children.length > 0) {
                        const letraAnterior = slot.children[0];
                        document.getElementById('letras-disponibles').appendChild(letraAnterior);
                    }

                    // Colocar la nueva letra
                    slot.appendChild(this.draggedElement);
                    this.draggedElement = null;
                }
            });
        });

        // Zona de letras disponibles para devolver
        const zonaDisponibles = document.getElementById('letras-disponibles');
        zonaDisponibles.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        zonaDisponibles.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement && this.draggedElement.parentElement.classList.contains('slot-letra')) {
                zonaDisponibles.appendChild(this.draggedElement);
                this.draggedElement = null;
            }
        });
    }

    handleTouchStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
    }

    handleTouchMove(e) {
        e.preventDefault();
    }

    handleTouchEnd(e) {
        e.target.classList.remove('dragging');
        
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('slot-letra')) {
            if (element.children.length > 0) {
                const letraAnterior = element.children[0];
                document.getElementById('letras-disponibles').appendChild(letraAnterior);
            }
            element.appendChild(this.draggedElement);
        }
        
        this.draggedElement = null;
    }

    setupButtons() {
        document.getElementById('btn-verificar').addEventListener('click', () => this.verificar());
        document.getElementById('btn-limpiar').addEventListener('click', () => this.limpiar());
    }

    verificar() {
        const slots = document.querySelectorAll('.slot-letra');
        let nombreFormado = '';

        slots.forEach(slot => {
            if (slot.children.length > 0) {
                nombreFormado += slot.children[0].dataset.letra;
            }
        });

        if (nombreFormado.length !== this.nombreCorrecto.length) {
            this.mostrarMensaje('Debes colocar todas las letras', 'error');
            return;
        }

        if (nombreFormado === this.nombreCorrecto) {
            this.win();
        } else {
            this.mostrarMensaje('No es correcto. Intenta de nuevo', 'error');
            
            // Animar error
            slots.forEach(slot => {
                slot.classList.add('error-shake');
                setTimeout(() => slot.classList.remove('error-shake'), 500);
            });
        }
    }

    limpiar() {
        const slots = document.querySelectorAll('.slot-letra');
        const zonaDisponibles = document.getElementById('letras-disponibles');

        slots.forEach(slot => {
            if (slot.children.length > 0) {
                zonaDisponibles.appendChild(slot.children[0]);
            }
        });
    }

    mostrarMensaje(texto, tipo) {
        // Remover mensaje anterior si existe
        const mensajeAnterior = this.contenedor.querySelector('.mensaje-verificacion');
        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }

        const mensaje = document.createElement('div');
        mensaje.className = `mensaje-verificacion ${tipo}`;
        mensaje.textContent = texto;
        
        const container = this.contenedor.querySelector('.ordenar-container');
        container.insertBefore(mensaje, container.querySelector('.botones-ordenar'));

        setTimeout(() => mensaje.remove(), 3000);
    }

    win() {
        const duration = Date.now() - this.startTime;
        
        const slots = document.querySelectorAll('.slot-letra');
        slots.forEach((slot, index) => {
            setTimeout(() => {
                slot.classList.add('correcto');
            }, index * 100);
        });

        setTimeout(() => {
            this.onComplete(duration);
        }, 1000);
    }

    destroy() {
        this.contenedor.innerHTML = '';
    }
}
