// modules/auth/auth.js
import { tokenModalComponent } from './tokenModal.js';

const TOKEN_KEY = 'bitcrack_monitor_token';

/**
 * Inicializa los disparadores de autenticación del sistema y los botones del layout
 */
export function initAuth() {
  // Vincula el botón físico que tienes en el Header original
  const tokenBtn = document.getElementById('token-badge');
  if (tokenBtn) {
    tokenBtn.addEventListener('click', () => {
      // Lanzamos el evento por si otros módulos del core necesitan enterarse
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
    });
  }

  // Escuchamos el evento global para abrir el modal atómico e inyectarlo en el body
  window.addEventListener('open-auth-modal', () => {
    tokenModalComponent.open(document.body, () => {
      console.log('🔒 Acceso autorizado: Token guardado y verificado con éxito.');
      // Aquí puedes disparar un EventBus o actualización de interfaz si lo requieres
    });
  });
}

/**
 * Motor de gestión de credenciales y autorización para la API de BitCrack
 */
export const authManager = {
  
  /**
   * Recupera el token guardado en el navegador (Local Storage)
   * @returns {string|null} El token hexadecimal o null si no existe
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Almacena y valida el token ejecutando un handshake con la API
   * @param {string} token - Token proveído por el operador en el modal
   * @returns {Promise<boolean>} True si la API acepta el token, False si es rechazado
   */
  async saveToken(token) {
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.setItem(TOKEN_KEY, token);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('🔒 Errores en el handshake de autenticación:', err);
      return false; 
    }
  },

  /**
   * Destruye la sesión del operador (cierre de seguridad o revocación)
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload(); 
  },

  /**
   * Comprueba de forma síncrona si el operador tiene credenciales guardadas
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token && token.length >= 16;
  },

  /**
   * Inyecta automáticamente el token en los headers de cualquier petición saliente
   * @param {Object} customHeaders - Cabeceras específicas del comando
   * @returns {Object} Cabeceras unificadas con la firma Bearer
   */
  getAuthHeaders(customHeaders = {}) {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...customHeaders
    };
  }
};

// Exportaciones directas para mantener compatibilidad con las firmas de tokenModal.js
export const saveToken = (token) => authManager.saveToken(token);
export const getValidToken = () => authManager.getToken();