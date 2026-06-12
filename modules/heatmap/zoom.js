// modules/heatmap/zoom.js

export const heatmapZoom = {
  init() {
    const zoomPanel = document.getElementById('zoom-panel');
    const heatmapCanvas = document.getElementById('heatmap-canvas');

    if (!heatmapCanvas || !zoomPanel) return;

    // Al hacer click sobre el canvas general del heatmap, se calcula el bloque
    heatmapCanvas.addEventListener('click', (e) => {
      const rect = heatmapCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calcular coordenadas basadas en la matriz de 64 columnas
      const cellW = rect.width / 64;
      const cellH = rect.height / Math.ceil(4096 / 64); // Ejemplo basado en tamaño de bloques
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      const blockId = row * 64 + col;

      this.openZoom(blockId);
    });
  },

  openZoom(blockId) {
    const panel = document.getElementById('zoom-panel');
    panel.classList.add('active');
    panel.innerHTML = `
      <div class="zoom-header">
        <span>🔎 DETALLE DEL BLOQUE #${blockId}</span>
        <button class="btn" id="close-zoom-btn">CERRAR</button>
      </div>
      <div class="zoom-grid" id="zoom-grid-cells">
        </div>
    `;

    document.getElementById('close-zoom-btn').addEventListener('click', () => {
      panel.classList.remove('active');
    });
  }
};