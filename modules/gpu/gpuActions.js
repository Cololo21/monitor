// modules/gpu/gpuActions.js
import { API } from '../../core/api.js';

export async function assignSlice(gpuId, value) {
  if (!value) return;
  const data = await API.post(`/api/assign/${gpuId}/${value}`);
  if (data?.ok) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { msg: `✓ GPU ${gpuId} → Slice ${value}`, type: 'success' } }));
  }
}

export async function assignNext(gpuId) {
  const data = await API.post(`/api/assign/${gpuId}/next`);
  if (data?.ok) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { msg: `✓ GPU ${gpuId} → Slice ${data.slice}`, type: 'success' } }));
  }
}

export async function togglePause(gpuId, isPaused) {
  const endpoint = isPaused ? `/api/resume/${gpuId}` : `/api/pause/${gpuId}`;
  const data = await API.post(endpoint);
  if (data?.ok) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { msg: isPaused ? `▶ GPU ${gpuId} reanudada` : `⏸ GPU ${gpuId} pausada`, type: 'info' } }));
  }
}

// ... Implementar de forma idéntica markDone y markPending ...