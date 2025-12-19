// Servicio de Timer
export class Timer {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.element = null;
    }

    start(elementId = 'timer') {
        this.element = document.getElementById(elementId);
        this.startTime = Date.now() - this.elapsedTime;
        
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 100);
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        return this.elapsedTime;
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.startTime = null;
        this.updateDisplay();
    }

    getElapsedTime() {
        return this.elapsedTime;
    }

    updateDisplay() {
        if (!this.element) return;

        const totalSegundos = Math.floor(this.elapsedTime / 1000);
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        
        this.element.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    formatTime(ms) {
        const totalSegundos = Math.floor(ms / 1000);
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}
