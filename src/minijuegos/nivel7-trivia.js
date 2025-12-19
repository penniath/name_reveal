// Nivel 7: Trivia Familiar
export class Nivel7Trivia {
    constructor(contenedor, onComplete) {
        this.contenedor = contenedor;
        this.onComplete = onComplete;
        this.startTime = Date.now();
        this.preguntaActual = 0;
        this.respuestasCorrectas = 0;
        
        this.preguntas = [
            {
                pregunta: '¿Cuántos meses dura un embarazo aproximadamente?',
                opciones: ['7 meses', '9 meses', '10 meses', '11 meses'],
                respuestaCorrecta: 1
            },
            {
                pregunta: '¿A qué edad aproximadamente los bebés empiezan a gatear?',
                opciones: ['3-4 meses', '6-10 meses', '12-15 meses', '18 meses'],
                respuestaCorrecta: 1
            },
            {
                pregunta: '¿Cuál es el primer sentido que desarrolla un bebé?',
                opciones: ['Vista', 'Oído', 'Tacto', 'Olfato'],
                respuestaCorrecta: 2
            },
            {
                pregunta: '¿Cuántas horas duerme aproximadamente un recién nacido al día?',
                opciones: ['8-10 horas', '12-14 horas', '16-18 horas', '20-22 horas'],
                respuestaCorrecta: 2
            },
            {
                pregunta: '¿Qué significa el llanto de un bebé?',
                opciones: ['Solo tiene hambre', 'Puede significar muchas cosas', 'Está enfadado', 'Quiere jugar'],
                respuestaCorrecta: 1
            }
        ];
        
        this.init();
    }

    init() {
        this.mostrarPregunta();
    }

    mostrarPregunta() {
        const pregunta = this.preguntas[this.preguntaActual];
        const totalPreguntas = this.preguntas.length;
        
        // Shuffle de las opciones
        const opcionesShuffled = this.shuffleOpciones(pregunta);
        
        this.contenedor.innerHTML = `
            <div class="trivia-container">
                <div class="progreso-trivia">
                    <p>Pregunta ${this.preguntaActual + 1} de ${totalPreguntas}</p>
                    <div class="barra-progreso">
                        <div class="barra-progreso-fill" style="width: ${((this.preguntaActual + 1) / totalPreguntas) * 100}%"></div>
                    </div>
                </div>
                
                <h3 class="pregunta-trivia">${pregunta.pregunta}</h3>
                
                <div class="opciones-trivia" id="opciones-trivia">
                    ${opcionesShuffled.map((item) => `
                        <button class="opcion-btn" data-index="${item.originalIndex}">
                            ${item.texto}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Agregar event listeners a las opciones
        const opciones = document.querySelectorAll('.opcion-btn');
        opciones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.verificarRespuesta(index, e.target);
            });
        });
    }

    shuffleOpciones(pregunta) {
        // Crear array con índices y textos
        const opcionesConIndices = pregunta.opciones.map((texto, index) => ({
            texto,
            originalIndex: index
        }));

        // Shuffle usando Fisher-Yates
        for (let i = opcionesConIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opcionesConIndices[i], opcionesConIndices[j]] = [opcionesConIndices[j], opcionesConIndices[i]];
        }

        return opcionesConIndices;
    }

    verificarRespuesta(index, botonElement) {
        const pregunta = this.preguntas[this.preguntaActual];
        const esCorrecta = index === pregunta.respuestaCorrecta;

        // Deshabilitar todos los botones
        const opciones = document.querySelectorAll('.opcion-btn');
        opciones.forEach(btn => btn.disabled = true);

        if (esCorrecta) {
            botonElement.classList.add('correcto');
            this.respuestasCorrectas++;
            
            setTimeout(() => {
                this.preguntaActual++;
                
                if (this.preguntaActual < this.preguntas.length) {
                    this.mostrarPregunta();
                } else {
                    // Todas las respuestas correctas
                    if (this.respuestasCorrectas === this.preguntas.length) {
                        this.win();
                    } else {
                        this.mostrarResultado();
                    }
                }
            }, 1000);
        } else {
            botonElement.classList.add('incorrecto');
            
            // Mostrar la respuesta correcta
            opciones[pregunta.respuestaCorrecta].classList.add('correcto');
            
            setTimeout(() => {
                this.mostrarResultado();
            }, 2000);
        }
    }

    mostrarResultado() {
        const totalPreguntas = this.preguntas.length;
        
        this.contenedor.innerHTML = `
            <div class="trivia-resultado">
                <h2>Resultado</h2>
                <p class="puntuacion-grande">${this.respuestasCorrectas} / ${totalPreguntas}</p>
                <p>Necesitas responder todas correctamente para continuar.</p>
                <button class="btn-primary" id="btn-reintentar">Intentar de Nuevo</button>
            </div>
        `;

        document.getElementById('btn-reintentar').addEventListener('click', () => {
            this.preguntaActual = 0;
            this.respuestasCorrectas = 0;
            this.startTime = Date.now();
            this.mostrarPregunta();
        });
    }

    win() {
        const duration = Date.now() - this.startTime;
        
        this.contenedor.innerHTML = `
            <div class="trivia-resultado">
                <h2>¡Perfecto! 🎉</h2>
                <p class="puntuacion-grande">${this.respuestasCorrectas} / ${this.preguntas.length}</p>
                <p>Has respondido todas correctamente.</p>
            </div>
        `;

        setTimeout(() => {
            this.onComplete(duration);
        }, 1500);
    }

    destroy() {
        this.contenedor.innerHTML = '';
    }
}
