// sw.js - Service Worker para BitCrack Monitor (Versión Offline Local)

const CACHE_NAME = 'bitcrack-monitor-v1';

// 1. Lista exhaustiva de assets estáticos locales para la caché persistente
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  
  // Hojas de estilo locales de Arquitectura Base
  '/assets/css/fonts.css',
  '/assets/css/variables.css',
  '/assets/css/base.css',
  '/assets/css/cards.css',
  '/assets/css/buttons.css',
  '/assets/css/forms.css',
  '/assets/css/modal.css',
  '/assets/css/dashboard.css',
  
  // Hojas de estilo locales de Componentes Modulares
  '/modules/gpu/gpu.css',
  '/modules/heatmap/heatmap.css',
  '/modules/scheduler/scheduler.css',
  '/modules/fitness/fitness.css',
  '/modules/logs/logs.css',
  '/modules/auth/auth.css',

  // Archivos binarios de fuentes locales (Carga 100% Offline)
  '/assets/fonts/share-tech-mono-v15-latin-regular.woff2',
  '/assets/fonts/orbitron-v25-latin-regular.woff2',
  '/assets/fonts/orbitron-v25-latin-700.woff2',
  '/assets/fonts/orbitron-v25-latin-900.woff2'
];

// ── EVENTO INSTALACIÓN: Almacena los recursos estáticos en el almacenamiento local ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Registrando recursos locales y fuentes offline');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// ── EVENTO ACTIVACIÓN: Limpieza de versiones obsoletas en memoria ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── EVENTO FETCH: Estrategia de Red-Primero con Caída en Caché (Network First) ──
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ⚠️ EXCLUSIÓN CRÍTICA: Los endpoints de datos de la API jamás deben pasar por la caché
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Comportamiento para archivos estáticos de la interfaz
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guardar copia fresca en caché si la respuesta de red es exitosa
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // En caso de caída de red o servidor offline, sirve el asset local guardado
        return caches.match(event.request);
      })
  );
});