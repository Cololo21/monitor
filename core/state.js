// core/state.js

// Estado reactivo interno
const state = {
  address: '—',
  total_speed: 0,
  global_pct: 0,
  completed_slices: 0,
  uptime: 0,
  eta_seconds: 0,
  gpus: [],
  heatmap: [],
  blocks: [],
  logs: []
};

// Almacén de callbacks de componentes suscritos
const listeners = [];

export const getState = () => ({ ...state });

export const updateState = (newState) => {
  Object.assign(state, newState);
  // Notificar a todos los módulos que el estado ha cambiado
  listeners.forEach(callback => callback(state));
};

export const subscribe = (callback) => {
  listeners.push(callback);
  // Devolver función para desuscribirse (limpieza de memoria)
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};