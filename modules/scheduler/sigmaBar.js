// modules/scheduler/sigmaBar.js

/**
 * Componente atómico para renderizar la barra de progreso adaptativa de Sigma (Mutación)
 * @param {Object} schedulerState - Fragmento del estado que contiene los datos del scheduler (sigma, max_sigma)
 * @returns {string} Código HTML estructurado con estilos en línea dinámicos
 */
export const sigmaBarComponent = {
  render(schedulerState) {
    const sigma = schedulerState.sigma || 0;
    const maxSigma = schedulerState.max_sigma || 1;

    // Calculamos de forma segura el porcentaje de mutación evolutiva (CMA-ES)
    const sigmaPct = Math.min(100, Math.max(0, (sigma / maxSigma) * 100));

    return `
      <div class="sigma-section" style="margin-top: 12px; margin-bottom: 12px;">
        <div class="sigma-labels" style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text2); margin-bottom: 4px;">
          <span>Mutación (Sigma: <b style="color: var(--text); font-family: 'Share Tech Mono', monospace;">${sigma.toFixed(5)}</b>)</span>
          <span>Max: <b style="color: var(--text2); font-family: 'Share Tech Mono', monospace;">${maxSigma.toFixed(2)}</b></span>
        </div>
        <div class="prog-wrap" style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); height: 6px; border-radius: 3px; overflow: hidden; position: relative;">
          <div class="prog-fill" 
               style="width: ${sigmaPct}%; 
                      height: 100%; 
                      background: var(--cyan); 
                      box-shadow: 0 0 8px var(--cyan); 
                      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
          </div>
        </div>
      </div>
    `.trim();
  }
};