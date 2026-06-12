// modules/gpu/gpuCharts.js

// Almacén en memoria para mantener el histórico de velocidad de cada GPU
const chartsHistory = {};

export function drawSparkline(canvasId, currentSpeed) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Inicializar histórico para esta GPU si no existe
  if (!chartsHistory[canvasId]) {
    chartsHistory[canvasId] = Array(30).fill(0); // 30 puntos fijos
  }

  // Desplazar histórico y añadir nueva velocidad
  chartsHistory[canvasId].shift();
  chartsHistory[canvasId].push(currentSpeed);

  const history = chartsHistory[canvasId];
  const maxVal = Math.max(...history, 1);

  // Renderizar gráfico estilo radar / ciberpunk
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  const step = width / (history.length - 1);
  history.forEach((val, index) => {
    const x = index * step;
    const y = height - (val / maxVal) * (height - 4) - 2;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Crear degradado bajo la línea
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fillStyle = 'rgba(0, 255, 136, 0.05)';
  ctx.fill();
}