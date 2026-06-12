// modules/gpu/gpuCard.js
import { assignSlice, assignNext, togglePause } from './gpuActions.js';
import { drawSparkline } from './gpuCharts.js';

export const gpuCardComponent = {
  /**
   * Genera el template HTML interpolando los datos exactos del clúster
   * @param {Object} g - Estado de la GPU (state.gpus[i])
   * @param {number} i - Índice identificador de la GPU
   */
  render(g, i) {
    const slice = g.slice !== null ? g.slice : '—';
    const slicePct = g.slice !== null ? g.slice_pct.toFixed(4) + '%' : '—';
    const m = g.metrics || {};
    const isRetry = g.status && g.status.startsWith('RETRY');
    const isAlert = isRetry && g.retry_mins >= 5;
    
    // Clases dinámicas para alertas y estados críticos del hardware
    const cardClass = g.paused ? 'paused' : isAlert ? 'alert' : '';
    const tempClass = m.temp >= 85 ? 'hot' : m.temp >= 70 ? 'warm' : '';
    
    const badgeClass = g.paused ? 'paused' : g.status?.startsWith('ERROR') ? 'error' : g.status?.startsWith('RETRY') ? 'retry' : g.slice === null || g.status === 'IDLE' ? 'idle' : '';
    const badgeLabel = g.paused ? 'PAUSED' : g.status?.startsWith('ERROR') ? 'ERROR' : g.status?.startsWith('RETRY') ? 'RETRY' : g.slice === null || g.status === 'IDLE' ? 'IDLE' : 'RUNNING';

    return `
    <div class="gpu-card ${cardClass}" id="gpu-card-${i}">
      <div class="gpu-header">
        <span class="gpu-id">GPU [${i}]</span>
        <span class="gpu-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      
      ${isRetry && g.retry_mins !== null ? `
        <div class="retry-alert show">
          ⚠️ RETRY: ${g.retry_mins} min${isAlert ? ' — POSIBLE HARDWARE DOWN' : ''}
        </div>
      ` : ''}
      
      <div class="metrics-row">
        <div class="metric">
          <div class="metric-val ${tempClass}">${m.temp || 0}°C</div>
          <div class="metric-lbl">TEMP</div>
        </div>
        <div class="metric">
          <div class="metric-val">${m.util || 0}%</div>
          <div class="metric-lbl">GPU USE</div>
        </div>
        <div class="metric">
          <div class="metric-val">${m.mem || 0}MB</div>
          <div class="metric-lbl">VRAM</div>
        </div>
        <div class="metric">
          <div class="metric-val">${Math.round(m.power || 0)}W</div>
          <div class="metric-lbl">POWER</div>
        </div>
      </div>
      
      <div class="chart-container">
        <canvas class="mini-chart" id="chart-${i}"></canvas>
      </div>
      
      <div class="prog-label">
        <span>Slice <b style="color:var(--yellow);">${slice}</b> (${slicePct})</span>
        <span class="font-mono" style="color:var(--green); font-weight:bold;">${g.speed.toFixed(2)} MK/s</span>
      </div>
      <div class="prog-wrap" style="margin-bottom:12px">
        <div class="prog-fill" style="width:${Math.min(100, g.progress || 0)}%"></div>
      </div>
      
      <div class="ctrl-row">
        <input class="slice-input" id="slice-in-${i}" type="number" placeholder="Slice #">
        <button class="btn" data-action="assign" data-gpu="${i}">ASIGNAR</button>
        <button class="btn yellow" data-action="next" data-gpu="${i}">SIGUIENTE</button>
        <button class="btn cyan" data-action="pause" data-gpu="${i}" data-paused="${g.paused}">
          ${g.paused ? '▶ REANUDAR' : '⏸ PAUSAR'}
        </button>
      </div>
    </div>`.trim();
  },

  /**
   * Vincula los listeners de eventos buscando los atributos de datos del DOM
   * @param {HTMLElement} container - Contenedor raíz donde se inyectaron las tarjetas (.gpu-grid)
   */
  bindEvents(container) {
    container.querySelectorAll('[data-action]').forEach(button => {
      // Clonamos para evitar acumulación de listeners duplicados tras repintados
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', (e) => {
        const gpuId = parseInt(newButton.dataset.gpu);
        const action = newButton.dataset.action;

        if (action === 'assign') {
          const val = container.querySelector(`#slice-in-${gpuId}`).value;
          if (val) assignSlice(gpuId, parseInt(val));
        } else if (action === 'next') {
          assignNext(gpuId);
        } else if (action === 'pause') {
          const isPaused = newButton.dataset.paused === 'true';
          togglePause(gpuId, isPaused);
        }
      });
    });
  },

  /**
   * Inicializa o actualiza la gráfica Sparkline tras inyectar el HTML
   * Debe llamarse desde el renderEngine central después del render()
   */
  initChart(i, historyData) {
    const canvas = document.getElementById(`chart-${i}`);
    if (canvas && historyData) {
      drawSparkline(canvas, historyData);
    }
  }
};