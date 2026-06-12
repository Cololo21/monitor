// modules/heatmap/renderer.js
export const heatmapRenderer = {
  draw(canvas, heatmapData) {
    if (!canvas || !heatmapData) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    // Tu lógica original de renderizado por celdas matemáticamente escaladas
    const cols = 64; 
    const rows = Math.ceil(heatmapData.length / cols);
    const cellW = width / cols;
    const cellH = height / rows;

    heatmapData.forEach((val, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      // Mapeo cromático original
      if (val === 1) ctx.fillStyle = '#00ff88';       // Completado
      else if (val === 2) ctx.fillStyle = '#ffcc00';  // Procesando
      else if (val === -1) ctx.fillStyle = '#ff3355'; // Error / Retry
      else ctx.fillStyle = '#0d1f1a';                 // Vacío

      ctx.fillRect(col * cellW, row * cellH, cellW - 1, cellH - 1);
    });
  }
};