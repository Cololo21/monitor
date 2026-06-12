// core/websocket.js
import { API } from './api.js';
import { updateState } from './state.js';
import { gpuCardComponent } from '../modules/gpu/gpuCard.js';

let pollingInterval = null;

export function startPolling() {
  if (pollingInterval) clearInterval(pollingInterval);
  
  const dot = document.getElementById('dot');
  const label = document.getElementById('conn-label');
  
  if (dot) dot.className = 'conn-dot live';
  if (label) label.textContent = 'LIVE (polling)';
  
  pollingInterval = setInterval(async () => {
    try {
      const data = await API.fetchState();
      
      // 1. Actualizar el estado global
      updateState(data);
      
      // 2. Orquestar re-renders selectivos en lugar de limpiar todo el árbol DOM
      renderGpuGrid(data.gpus);
      renderGlobalMetrics(data);
      
    } catch (e) {
      console.error("Error en polling de datos:", e);
      if (dot) dot.className = 'conn-dot';
      if (label) label.textContent = 'ERROR...';
    }
  }, 2000);
}

function renderGpuGrid(gpus) {
  const container = document.getElementById('gpu-grid');
  if (!container || !gpus) return;

  // Renderizar la lista de tarjetas usando el componente modular
  container.innerHTML = gpus.map((gpu, index) => gpuCardComponent.render(gpu, index)).join('');
  
  // Vincular eventos interactivos a los nuevos nodos inyectados
  gpuCardComponent.bindEvents(container);
}

function renderGlobalMetrics(data) {
  // Manipulación fina de textos reactivos de la cabecera / estado global
  const addrEl = document.getElementById('address');
  if (addrEl) addrEl.textContent = data.address || '—';
  // ... añadir selectores finos para velocidad, porcentaje de keyspace, etc.
}