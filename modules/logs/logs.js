// modules/logs/logs.js
import { filterLogs } from './filters.js';
import { exportLogs } from './exporter.js';
import { logEntryComponent } from './logEntry.js';

let currentLogFilter = 'ALL';

export const logsComponent = {
  /**
   * Genera la estructura de la terminal y mapea los logs filtrados
   * @param {Object} state - Estado global de la aplicación (contiene state.logs)
   */
  render(state) {
    const filtered = filterLogs(state.logs || [], currentLogFilter);
    
    // Mapeamos los logs del estado real usando el subcomponente atómico en memoria
    const logsHtml = filtered.map(log => logEntryComponent.render(log)).join('');

    return `
      <div class="card-header-actions">
        <div class="card-title">📜 Event Log</div>
        <div class="log-controls">
          <select id="log-filter-select" class="slice-input" style="padding:2px 5px; background:var(--bg); color:var(--text); border:1px solid var(--border);">
            <option value="ALL" ${currentLogFilter === 'ALL' ? 'selected' : ''}>ALL</option>
            <option value="WARN" ${currentLogFilter === 'WARN' ? 'selected' : ''}>WARN</option>
            <option value="ERROR" ${currentLogFilter === 'ERROR' ? 'selected' : ''}>ERROR</option>
          </select>
        </div>
      </div>
      <div class="log-terminal" id="log-terminal-inner">
        ${logsHtml || '<div style="color:var(--text2); text-align:center; padding:20px;">Esperando eventos del sistema...</div>'}
      </div>
    `;
  },

  /**
   * Vincula los eventos del selector de filtro y el botón de exportación del header
   * @param {Object} state - Estado global para pasárselo al re-render
   */
  bindEvents(state) {
    const select = document.getElementById('log-filter-select');
    if (select) {
      select.addEventListener('change', (e) => {
        currentLogFilter = e.target.value;
        
        // Fuerza el re-renderizado reactivo del componente dentro de su tarjeta
        const container = document.getElementById('logs-card');
        if (container) {
          container.innerHTML = this.render(state);
          // Volvemos a vincular los eventos al reconstruir el HTML
          this.bindEvents(state);
          this.scrollToBottom();
        }
      });
    }

    // Escucha el botón de guardado (LOG) ubicado en el header de index.html
    const exportBtn = document.getElementById('export-log-btn');
    if (exportBtn) {
      exportBtn.onclick = () => exportLogs(state.logs || [], 'TXT');
    }

    // Ejecuta el auto-scroll al cargar nuevos datos
    this.scrollToBottom();
  },

  /**
   * Mantiene el scroll de la consola abajo para ver siempre el último evento
   */
  scrollToBottom() {
    const terminal = document.getElementById('log-terminal-inner');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }
};