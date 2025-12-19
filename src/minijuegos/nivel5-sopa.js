// Nivel 5: Sopa de Letras (Optimizada para móvil)
export class Nivel5Sopa {
    constructor(contenedor, onComplete) {
        this.contenedor = contenedor;
        this.onComplete = onComplete;
        this.startTime = Date.now();
        this.palabra = '';
        this.grid = [];
        this.seleccion = [];
        this.palabraEncontrada = false;
        this.init();
    }

    init() {
        // Palabra fija: FAMILIA
        this.palabra = 'FAMILIA';
        
        this.crearGrid();
        this.renderizar();
        this.setupEventListeners();
    }

    crearGrid() {
        const size = 10; // Grid 10x10 para tener espacio
        
        // Llenar completamente el grid con letras aleatorias
        this.grid = Array(size).fill(null).map(() => 
            Array(size).fill(null).map(() => 
                String.fromCharCode(65 + Math.floor(Math.random() * 26))
            )
        );

        // Colocar palabra FAMILIA (horizontal o vertical)
        const direccion = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * (direccion === 'horizontal' ? size : size - this.palabra.length));
        const col = Math.floor(Math.random() * (direccion === 'vertical' ? size : size - this.palabra.length));

        this.posicionesPalabra = [];
        for (let i = 0; i < this.palabra.length; i++) {
            if (direccion === 'horizontal') {
                this.grid[row][col + i] = this.palabra[i];
                this.posicionesPalabra.push({ row, col: col + i });
            } else {
                this.grid[row + i][col] = this.palabra[i];
                this.posicionesPalabra.push({ row: row + i, col });
            }
        }
    }

    renderizar() {
        this.contenedor.innerHTML = `
            <div class="sopa-container">
                <div class="sopa-info">
                    <p class="sopa-instruccion">Encuentra la palabra: <strong>${this.palabra}</strong></p>
                    <p class="sopa-ayuda">Desliza el dedo sobre las letras</p>
                </div>
                
                <div class="sopa-grid" id="sopa-grid">
                    ${this.grid.map((row, i) => 
                        row.map((letra, j) => 
                            `<div class="sopa-celda" data-row="${i}" data-col="${j}">${letra}</div>`
                        ).join('')
                    ).join('')}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const grid = document.getElementById('sopa-grid');
        let touching = false;

        const iniciarSeleccion = (e) => {
            e.preventDefault();
            touching = true;
            this.seleccion = [];
            this.limpiarSeleccion();
            
            const celda = e.target.closest('.sopa-celda');
            if (celda) {
                this.agregarACelda(celda);
            }
        };

        const continuarSeleccion = (e) => {
            if (!touching) return;
            e.preventDefault();
            
            const touch = e.touches?.[0] || e;
            const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
            const celda = elemento?.closest('.sopa-celda');
            
            if (celda && !celda.classList.contains('seleccionada')) {
                this.agregarACelda(celda);
            }
        };

        const finalizarSeleccion = (e) => {
            e.preventDefault();
            if (!touching) return;
            touching = false;
            this.verificarPalabra();
        };

        // Touch events
        grid.addEventListener('touchstart', iniciarSeleccion, { passive: false });
        grid.addEventListener('touchmove', continuarSeleccion, { passive: false });
        grid.addEventListener('touchend', finalizarSeleccion, { passive: false });
        
        // Mouse events (para PC)
        grid.addEventListener('mousedown', iniciarSeleccion);
        grid.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) continuarSeleccion(e);
        });
        grid.addEventListener('mouseup', finalizarSeleccion);
        grid.addEventListener('mouseleave', finalizarSeleccion);
    }

    agregarACelda(celda) {
        const row = parseInt(celda.dataset.row);
        const col = parseInt(celda.dataset.col);
        
        // Evitar duplicados
        if (this.seleccion.some(s => s.row === row && s.col === col)) return;
        
        this.seleccion.push({ row, col, celda });
        celda.classList.add('seleccionada');
    }

    limpiarSeleccion() {
        document.querySelectorAll('.sopa-celda.seleccionada').forEach(c => {
            c.classList.remove('seleccionada', 'correcta');
        });
    }

    verificarPalabra() {
        if (this.seleccion.length !== this.palabra.length) {
            this.limpiarSeleccion();
            return;
        }

        // Verificar si coincide con la palabra
        const letrasSeleccionadas = this.seleccion.map(s => 
            this.grid[s.row][s.col]
        ).join('');

        if (letrasSeleccionadas === this.palabra) {
            this.palabraEncontrada = true;
            this.seleccion.forEach(s => s.celda.classList.add('correcta'));
            
            setTimeout(() => {
                const duration = Date.now() - this.startTime;
                this.onComplete(duration);
            }, 500);
        } else {
            this.limpiarSeleccion();
        }
    }

    destroy() {
        this.contenedor.innerHTML = '';
    }
}
