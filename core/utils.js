// core/utils.js

export const utils = {
  audioCtx: null,

  // Inicialización segura para saltarse las restricciones de reproducción de audio de los navegadores
  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  async playFoundSound() {
    this.initAudio();
    try {
      const response = await fetch('assets/sounds/found.wav');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);
      source.start(0);
    } catch (e) {
      console.warn("No se pudo reproducir el sonido de alerta (interacción requerida):", e);
    }
  },

  triggerFoundOverlay(address, key) {
    const overlay = document.getElementById('found-overlay');
    if (overlay) {
      overlay.classList.add('active');
      this.playFoundSound();
    }
  }
};