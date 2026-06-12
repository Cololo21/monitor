// modules/scheduler/eliteList.js
import { eliteItemComponent } from './eliteItem.js';

/**
 * Componente intermedio para gestionar la colección del Top Fitness (Elite Solutions)
 * @param {Array} eliteItems - Array de objetos con las mejores soluciones del clúster
 * @returns {string} Fragmento HTML de la lista completa con sus filas inyectadas
 */
export const eliteListComponent = {
  render(eliteItems) {
    const list = eliteItems || [];

    // Si la población activa está inicializándose y el array viene vacío
    if (list.length === 0) {
      return `
        <div class="elite-empty" style="color: var(--text2); font-size: 0.85rem; padding: 12px; text-align: center; border: 1px dashed var(--border); border-radius: 3px;">
          ⚡ Sincronizando con el clúster... Esperando soluciones élite.
        </div>
      `.trim();
    }

    // Iteramos sobre las soluciones reales y disparamos el renderizado atómico por índice
    return `
      <div class="elite-list-container" style="display: flex; flex-direction: column; gap: 6px;">
        ${list
          .slice(0, 5) // Nos aseguramos estrictamente de no desbordar el Top 5 visual
          .map((item, index) => eliteItemComponent.render(item, index))
          .join('')}
      </div>
    `.trim();
  }
};