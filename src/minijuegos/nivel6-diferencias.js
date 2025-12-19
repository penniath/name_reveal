// Nivel 6: Encuentra las Diferencias (Optimizado para móvil)
export class Nivel6Diferencias {
    constructor(contenedor, onComplete) {
        this.contenedor = contenedor;
        this.onComplete = onComplete;
        this.startTime = Date.now();
        this.diferenciasEncontradas = 0;
        this.totalDiferencias = 3; // Solo 3 para que sea rápido
        this.init();
    }

    init() {
        this.crearEscena();
        this.renderizar();
        this.setupEventListeners();
    }

    crearEscena() {
        // Generar posiciones aleatorias para las diferencias
        this.diferencias = [];
        const posiciones = [
            { top: '20%', left: '30%' },
            { top: '50%', left: '60%' },
            { top: '70%', left: '25%' },
            { top: '35%', left: '70%' },
            { top: '80%', left: '50%' }
        ];

        // Seleccionar 3 posiciones aleatorias
        const seleccionadas = posiciones
            .sort(() => Math.random() - 0.5)
            .slice(0, this.totalDiferencias);

        seleccionadas.forEach((pos, i) => {
            this.diferencias.push({ id: i, ...pos, encontrada: false });
        });
    }

    renderizar() {
        this.contenedor.innerHTML = `
            <div class="diferencias-container">
                <div class="diferencias-info">
                    <p>Encuentra las <strong>${this.totalDiferencias}</strong> diferencias</p>
                    <p class="diferencias-contador">
                        <span id="dif-encontradas">0</span> / ${this.totalDiferencias}
                    </p>
                </div>
                
                <div class="diferencias-imagenes">
                    <div class="diferencias-imagen diferencias-imagen-1">
                        <div class="diferencias-fondo"></div>
                        ${this.generarElementos(false)}
                    </div>
                    
                    <div class="diferencias-imagen diferencias-imagen-2">
                        <div class="diferencias-fondo"></div>
                        ${this.generarElementos(true)}
                    </div>
                </div>
            </div>
        `;
    }

    generarElementos(conDiferencias) {
        let html = '';
        
        // Elementos base (iguales en ambas imágenes)
        html += '<div class="dif-elemento dif-circulo" style="top: 15%; left: 15%; background: #3498db;"></div>';
        html += '<div class="dif-elemento dif-cuadrado" style="top: 60%; left: 75%; background: #e74c3c;"></div>';
        html += '<div class="dif-elemento dif-triangulo" style="top: 85%; left: 80%; background: #f39c12;"></div>';
        
        // Agregar diferencias solo en la segunda imagen
        if (conDiferencias) {
            this.diferencias.forEach(dif => {
                html += `
                    <div class="dif-elemento dif-diferencia" 
                         data-dif="${dif.id}"
                         style="top: ${dif.top}; left: ${dif.left}; background: #2ecc71;">
                    </div>
                `;
            });
        }
        
        return html;
    }

    setupEventListeners() {
        const diferenciasElementos = document.querySelectorAll('.dif-diferencia');
        
        diferenciasElementos.forEach(elem => {
            elem.addEventListener('click', (e) => this.clickDiferencia(e));
            elem.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.clickDiferencia(e);
            });
        });
    }

    clickDiferencia(e) {
        const elem = e.target;
        const difId = parseInt(elem.dataset.dif);
        const diferencia = this.diferencias[difId];
        
        if (diferencia && !diferencia.encontrada) {
            diferencia.encontrada = true;
            this.diferenciasEncontradas++;
            
            elem.classList.add('encontrada');
            
            // Actualizar contador
            document.getElementById('dif-encontradas').textContent = this.diferenciasEncontradas;
            
            // Verificar si completó
            if (this.diferenciasEncontradas === this.totalDiferencias) {
                setTimeout(() => {
                    const duration = Date.now() - this.startTime;
                    this.onComplete(duration);
                }, 500);
            }
        }
    }

    destroy() {
        this.contenedor.innerHTML = '';
    }
}
