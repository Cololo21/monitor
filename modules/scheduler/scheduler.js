// modules/scheduler/scheduler.js
import { sigmaBarComponent } from './sigmaBar.js';
import { eliteListComponent } from './eliteList.js'; // <-- El contenedor intermedio de rango medio

export const schedulerComponent = {
  /**
   * Orquestador de nivel superior para la tarjeta del planificador adaptativo CMA-ES
   * @param {Object} data - Estado global de la aplicaci¨®n (contiene data.scheduler)
   */
  render(data) {
    const s = data.scheduler || {};
    
    // Si el backend reporta que el algoritmo evolutivo est¨¢ apagado
    if (!s.cmaes) {
      return `<div style="color:var(--text2); padding: 15px; text-align: center;">CMA-ES Desactivado</div>`;
    }

    return `
      <div class="card-title">?? Adaptive Scheduler (CMA-ES)</div>
      <div class="scheduler-meta" style="display: flex; gap: 12px; font-size: 0.85rem; margin-bottom: 8px; color: var(--text2);">
        <div>Generaci¨®n: <b style="color: var(--text);">${s.generation || 0}</b></div>
        <div>Poblaci¨®n activa: <b style="color: var(--text);">${s.pop_size || 0}</b></div>
      </div>
      
      ${sigmaBarComponent.render(s)}

      <div class="elite-title" style="font-size: 0.8rem; color: var(--text); text-transform: uppercase; margin: 12px 0 6px 0; letter-spacing: 0.5px;">
        ? Top Fitness (Elite Solutions)
      </div>
      
      <div class="elite-list">
        ${eliteListComponent.render(s.elite)}
      </div>
    `;
  }
};