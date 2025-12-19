// Gestión de modales
export class Modales {
    constructor() {
        this.modalLetra = document.getElementById('modal-letra');
        this.setupModalLetra();
    }

    setupModalLetra() {
        const btnSiguiente = document.getElementById('btn-siguiente-nivel');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                this.cerrarModalLetra();
            });
        }
    }

    mostrarLetraDesbloqueada(letra, nivel, totalNiveles, callback) {
        const letraElement = document.getElementById('letra-desbloqueada');
        const mensajeElement = document.getElementById('mensaje-letra');
        
        letraElement.textContent = letra;
        mensajeElement.textContent = `Has desbloqueado la letra ${nivel} de ${totalNiveles}`;
        
        this.modalLetra.classList.add('activo');
        
        // Guardar callback para el botón siguiente
        this.onSiguienteCallback = callback;
    }

    cerrarModalLetra() {
        this.modalLetra.classList.remove('activo');
        
        if (this.onSiguienteCallback) {
            this.onSiguienteCallback();
            this.onSiguienteCallback = null;
        }
    }

    mostrarMensaje(titulo, mensaje, callback) {
        // Reutilizar el modal de letra para mensajes generales
        const letraElement = document.getElementById('letra-desbloqueada');
        const mensajeElement = document.getElementById('mensaje-letra');
        const tituloElement = this.modalLetra.querySelector('h2');
        
        tituloElement.textContent = titulo;
        letraElement.textContent = '';
        mensajeElement.textContent = mensaje;
        
        this.modalLetra.classList.add('activo');
        this.onSiguienteCallback = callback;
    }
}
