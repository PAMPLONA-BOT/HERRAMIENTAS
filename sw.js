// sw.js

// Nombre y versión de la caché. Cámbialo si actualizas los archivos para forzar la actualización.
const CACHE_NAME = 'panel-herramientas-cache-v1';

// Lista de todos los archivos que componen tu aplicación y que deben funcionar offline.
const FILES_TO_CACHE = [
  '/', // Representa la ruta raíz, usualmente sirve index.html
  'index.html',
  'welcome.html',
  'gps.html',
  'gestor_revisiones_unificado.html',
  'historico_analizador_tiempos.html',
  'finalizador_analisis.html',
  'lecturas-json.html',
  'sirius_total_funcionable.html',
  'plantilla_revisiones.xlsx' // ¡Importante incluir también los recursos como este XLSX!
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
// Aquí es donde guardamos todos nuestros archivos en la caché.
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Instalando...');
  // waitUntil espera a que la promesa se resuelva antes de terminar la instalación.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Guardando archivos de la aplicación en caché');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Evento 'activate': Se dispara después de la instalación.
// Es un buen lugar para limpiar cachés viejas que ya no se usan.
self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activado y listo para tomar control.');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                // Si la clave de caché no es la actual, la borramos.
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Borrando caché antigua', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// Evento 'fetch': Se dispara cada vez que la aplicación pide un recurso (una página, un archivo, etc.).
// Aquí interceptamos la petición y decidimos qué hacer.
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Interceptando fetch para:', evt.request.url);
  evt.respondWith(
    // Primero, buscamos el recurso en la caché.
    caches.match(evt.request).then((response) => {
      // Si está en la caché, lo devolvemos (¡magia offline!).
      // Si no, intentamos obtenerlo de la red.
      return response || fetch(evt.request);
    })
  );
});
