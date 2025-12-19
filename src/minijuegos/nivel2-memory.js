// Nivel 2: Memory Match
export class Nivel2Memory {
    constructor(contenedor, onComplete) {
        this.contenedor = contenedor;
        this.onComplete = onComplete;
        this.numPares = 8;
        this.cartas = [];
        this.cartasVolteadas = [];
        this.paresEncontrados = 0;
        this.bloqueado = false;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        this.contenedor.innerHTML = `
            <div class="memory-container">
                <div id="memory-grid" class="memory-grid"></div>
            </div>
        `;

        this.createCards();
        this.render();
    }

    createCards() {
        // Emojis para las cartas
        const emojis = ['🍼', '👶', '🧸', '🎈', '⭐', '🌙', '❤️', '🎁'];
        
        // Crear pares
        const pares = [];
        for (let i = 0; i < this.numPares; i++) {
            pares.push({ id: i, emoji: emojis[i], encontrado: false });
            pares.push({ id: i, emoji: emojis[i], encontrado: false });
        }

        // Mezclar
        this.cartas = this.shuffle(pares);
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    render() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';

        this.cartas.forEach((carta, index) => {
            const cartaElement = document.createElement('div');
            cartaElement.className = 'memory-card';
            cartaElement.dataset.index = index;

            if (carta.volteada || carta.encontrado) {
                cartaElement.classList.add('volteada');
                cartaElement.textContent = carta.emoji;
            } else {
                cartaElement.textContent = '?';
            }

            if (carta.encontrado) {
                cartaElement.classList.add('encontrado');
            }

            cartaElement.addEventListener('click', () => this.voltearCarta(index));
            grid.appendChild(cartaElement);
        });
    }

    voltearCarta(index) {
        if (this.bloqueado) return;
        if (this.cartas[index].volteada || this.cartas[index].encontrado) return;
        if (this.cartasVolteadas.length >= 2) return;

        this.cartas[index].volteada = true;
        this.cartasVolteadas.push(index);
        this.render();

        if (this.cartasVolteadas.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        this.bloqueado = true;
        const [index1, index2] = this.cartasVolteadas;
        const carta1 = this.cartas[index1];
        const carta2 = this.cartas[index2];

        if (carta1.id === carta2.id) {
            // ¡Pareja encontrada!
            setTimeout(() => {
                carta1.encontrado = true;
                carta2.encontrado = true;
                this.paresEncontrados++;
                this.cartasVolteadas = [];
                this.bloqueado = false;
                this.render();

                if (this.paresEncontrados === this.numPares) {
                    this.win();
                }
            }, 500);
        } else {
            // No coinciden
            setTimeout(() => {
                carta1.volteada = false;
                carta2.volteada = false;
                this.cartasVolteadas = [];
                this.bloqueado = false;
                this.render();
            }, 1000);
        }
    }

    win() {
        const duration = Date.now() - this.startTime;
        setTimeout(() => {
            this.onComplete(duration);
        }, 500);
    }

    destroy() {
        this.contenedor.innerHTML = '';
    }
}
