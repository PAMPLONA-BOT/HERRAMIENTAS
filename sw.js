// sw.js CORREGIDO PARA TU REPOSITORIO 'HERRAMIENTAS'

// ¡¡IMPORTANTE!! El nombre de tu repositorio ya está aquí.
const REPO_NAME = '/HERRAMIENTAS'; 
// Incrementamos la versión para forzar la actualización del Service Worker y la caché.
const CACHE_NAME = 'panel-herramientas-cache-v2';

// Lista de archivos con la ruta correcta para tu sitio en GitHub Pages.
const FILES_TO_CACHE = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/welcome.html`,
  `${REPO_NAME}/gps.html`,
  `${REPO_NAME}/gestor_revisiones_unificado.html`,
  `${REPO_NAME}/historico_analizador_tiempos.html`,
  `${REPO_NAME}/finalizador_analisis.html`,
  `${REPO_NAME}/lecturas-json.html`,
  `${REPO_NAME}/maestro3.0.html`,
  `${REPO_NAME}/sirius_total_funcionable.html`,
  `${REPO_NAME}/USUARIOS JSON.html`,
  `${REPO_NAME}/SSCAR CLIENTES.xlsx`,
  `${REPO_NAME}/plantilla_revisiones.xlsx`
];

// Evento 'install': Se dispara cuando el Service Worker se instala.
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Instalando v2...');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Guardando archivos en caché:', FILES_TO_CACHE);
      // Usamos {cache: 'reload'} para asegurarnos de obtener los archivos más nuevos de la red.
      const requests = FILES_TO_CACHE.map(url => new Request(url, {cache: 'reload'}));
      return cache.addAll(requests);
    }).catch(error => {
      console.error('[ServiceWorker] Fallo al guardar en caché durante la instalación. Revisa que todas las rutas en FILES_TO_CACHE sean correctas.', error);
    })
  );
  self.skipWaiting();
});

// Evento 'activate': Se dispara cuando el Service Worker se activa. Limpia cachés antiguas.
self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activado v2.');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Borrando caché antigua:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// Evento 'fetch': Intercepta las peticiones y las sirve desde la caché si es posible.
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      // Si el recurso está en la caché, lo devolvemos. Si no, lo pedimos a la red.
      if (response) {
        console.log('[ServiceWorker] Sirviendo desde caché:', evt.request.url);
        return response;
      }
      console.log('[ServiceWorker] Pidiendo a la red:', evt.request.url);
      return fetch(evt.request);
    })
  );
});
