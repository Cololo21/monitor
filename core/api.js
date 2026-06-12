// core/api.js
import { utils } from './utils.js'; // Por si necesitas helpers adicionales

export const API = {
  getToken() {
    return localStorage.getItem('bitcrack_token') || '';
  },

  getHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async post(url) {
    if (!this.getToken()) {
      window.dispatchEvent(new CustomEvent('auth-required'));
      return null;
    }
    try {
      const response = await fetch(url, { method: 'POST', headers: this.getHeaders() });
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth-invalid'));
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en POST ${url}:`, error);
      window.dispatchEvent(new CustomEvent('api-error', { detail: 'Error de conexión' }));
      return null;
    }
  },

  async fetchState() {
    const response = await fetch('/api/state');
    return await response.json();
  }
};