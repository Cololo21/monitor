// modules/heatmap/heatmap.js
import { heatmapRenderer } from './renderer.js';

export const heatmapComponent = {
  render() {
    return `
      <div class="card-title">🗺️ Keyspace Heatmap</div>
      <canvas id="heatmap-canvas" width="640" height="200" style="width:100%; height:auto; background:var(--bg2); border:1px solid var(--border); border-radius:4px;"></canvas>
    `;
  },
  
  update(canvas, data) {
    if (canvas && data) {
      heatmapRenderer.draw(canvas, data.heatmap);
    }
  }
};