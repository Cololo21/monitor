// modules/auth/tokenModal.js
import { saveToken, getValidToken } from './auth.js';
import { EventBus } from '../../core/events.js'; // <-- Recuperamos tu bus de eventos core

export const tokenModalComponent = {
  /**
   * Genera la estructura HTML del modal inyectando el token actual si existe
   * @returns {string} Fragmento HTML alineado con assets/css/modal.css
   */
  render() {
    const currentToken = getValidToken() || '';
    
    return `
      <div class="modal-overlay" id="auth-modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">🔐 ACCESO REQUERIDO (API TOKEN)</div>
            <button class="modal-close" id="close-token-modal-btn" aria-label="Cerrar">&times;</button>
          </div>
          <div class="modal-body">
            <p>Introduce el token de seguridad de la API de BitCrack para habilitar el control remoto y la asignación de rangos del Keyspace.</p>
            <div class="form-group" style="margin-top: 12px;">
              <input 
                type="password" 
                id="token-secret-input" 
                class="slice-input" 
                placeholder="0x0000...0000" 
                value="${currentToken}"
                autocomplete="off"
                style="width: 100%; text-align: center; letter-spacing: 2px; background: var(--bg); color: var(--text); border: 1px solid var(--border); padding: 6px; border-radius: 3px;"
              >
            </div>
            <div id="modal-auth-error" style="color: var(--red); font-size: 0.8rem; margin-top: 8px; text-align: center; display: none;">
              ⚠️ Token inválido o sin privilegios de escritura.
            </div>
          </div>
          <div class="modal-actions" style="display:flex; gap:10px; justify-content:flex-end;">
            <button class="btn" id="modal-cancel-btn" style="background:transparent; border:1px solid var(--border); width: 35%;">Cancelar</button>
            <button class="btn" id="save-token-action-btn" style="width: 65%;">GUARDAR</button>
          </div>
        </div>
      </div>
    `.trim();
  },

  /**
   * Monta e inicializa el ciclo de vida del modal en pantalla
   * @param {HTMLElement} mountPoint - Punto de anclaje en el DOM (ej. document.body)
   * @param {Function} callback - Función opcional a ejecutar tras una autenticación exitosa
   */
  open(mountPoint, callback = null) {
    if (document.getElementById('auth-modal-overlay')) return;

    // 1. Inyección síncrona en memoria RAM
    mountPoint.insertAdjacentHTML('beforeend', this.render());

    const overlay = document.getElementById('auth-modal-overlay');
    const closeBtn = document.getElementById('close-token-modal-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const saveBtn = document.getElementById('save-token-action-btn');
    const input = document.getElementById('token-secret-input');
    const errorMsg = document.getElementById('modal-auth-error');

    // 2. Activación elástica del CSS mediante la clase nativa .show
    requestAnimationFrame(() => {
      overlay.classList.add('show');
    });

    // Función interna para desmontar el nodo tras la transición visual de salida
    const closeModal = () => {
      overlay.classList.remove('show');
      overlay.addEventListener('transitionend', () => {
        overlay.remove();
      }, { once: true });
    };

    // Listeners de cierre (Aspa superior, botón cancelar y clic en zona exterior)
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Procesamiento y Handshake con la API de BitCrack
    saveBtn.addEventListener('click', async () => {
      const tokenValue = input.value.trim();
      
      if (!tokenValue) {
        errorMsg.textContent = '⚠️ El campo del token no puede estar vacío.';
        errorMsg.style.display = 'block';
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'VERIFICANDO...';
      errorMsg.style.display = 'none';

      // Disparar validación real en auth.js
      const success = await saveToken(tokenValue);

      if (success) {
        // Disparamos tu notificación global original
        EventBus.emit('toast', { msg: 'Token verificado y guardado correctamente', color: 'var(--green)' });
        
        closeModal();
        if (callback) callback();
      } else {
        saveBtn.disabled = false;
        saveBtn.textContent = 'GUARDAR';
        errorMsg.textContent = '⚠️ Token rechazado por la API del clúster.';
        errorMsg.style.display = 'block';
        input.focus();
        input.select();
      }
    });

    // Atajos de consola por hardware (Enter y Escape)
    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveBtn.click();
      if (e.key === 'Escape') closeModal();
    });
  }
};