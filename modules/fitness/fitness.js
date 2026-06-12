// modules/fitness/fitness.js
import { fitnessCardComponent } from './fitnessCard.js';

export const fitnessComponent = {
  /**
   * Renderiza el contenedor principal del panel de Fitness (Best Match)
   * @param {Object} data - Estado global de la aplicación (contiene data.fitness)
   * @returns {string} Fragmento HTML optimizado para el renderEngine
   */
  render(data) {
    const f = data.fitness || {};
    
    // Si el clúster no ha reportado ninguna solución válida o está inicializándose
    if (!f.best_candidate) {
      return `
        <div class="card-header-actions">
          <div class="card-title">🎯 Highest Fitness Match</div>
        </div>
        <div style="color: var(--text2); padding: 24px; text-align: center; font-size: 0.9rem; border: 1px dashed var(--border); border-radius: 4px; margin-top: 10px;">
          📡 Buscando colisiones en el Keyspace... Esperando métricas de aptitud.
        </div>
      `.trim();
    }

    return `
      <div class="card-header-actions">
        <div class="card-title">🎯 Highest Fitness Match</div>
        <div class="fitness-meta" style="font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: var(--green); background: rgba(0, 255, 136, 0.1); padding: 2px 6px; border-radius: 3px; border: 1px solid rgba(0, 255, 136, 0.2);">
          FITNESS: ${f.score ? f.score.toFixed(6) : '0.000000'}
        </div>
      </div>
      
      <div class="fitness-content-wrapper" style="margin-top: 12px;">
        ${fitnessCardComponent.render(f.best_candidate)}
      </div>
    `.trim();
  },

  /**
   * Vincula interacciones si el panel de fitness requiere botones (ej. exportar la llave candidata)
   * @param {Object} state - Estado global de la aplicación
   */
  bindEvents(state) {
    const copyBtn = document.getElementById('copy-candidate-btn');
    if (copyBtn && state.fitness?.best_candidate) {
      copyBtn.onclick = () => {
        const key = state.fitness.best_candidate.priv_key_range || '';
        navigator.clipboard.writeText(key);
        
        // Feedback visual rápido estilo cyberpunk
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'COPIADO ✓';
        copyBtn.style.color = 'var(--green)';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.color = '';
        }, 1500);
      };
    }
  }
};