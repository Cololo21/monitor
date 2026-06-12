// core/events.js
export const EventBus = {
  emit(event, detail) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },
  on(event, callback) {
    window.addEventListener(event, (e) => callback(e.detail));
  },
  off(event, callback) {
    window.removeEventListener(event, (e) => callback(e.detail));
  }
};

// Inicializador del sistema de Toasts (Notificaciones) en el DOM
export function initToastSystem() {
  const notifContainer = document.getElementById('notif');
  if (!notifContainer) return;

  EventBus.on('toast', ({ msg, color }) => {
    const el = document.createElement('div');
    el.className = 'toast-msg';
    el.style.borderLeft = `3px solid ${color || 'var(--green)'}`;
    el.style.boxShadow = `0 0 10px ${color || 'var(--green)'}40`;
    el.textContent = msg;
    
    notifContainer.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, 3000);
  });
}