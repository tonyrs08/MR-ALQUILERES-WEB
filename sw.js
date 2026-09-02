const CACHE_NAME = 'mr-alquileres-cache-v35';
const urlsToCache = [
  '/',
  '/index.html',
  '/catalogo.html',
  '/style.css',
  '/script.js',
  '/img/logo.jpg',
  '/img/sillas-plasticas.jpg',
  '/img/sillas-plegables.jpg',
  '/img/mesas-cuadradas.jpg',
  '/img/mesas-rectangular.jpg',
  '/img/manteles.jpg',
  '/img/tolda-3x6.jpg',
  '/img/tolda-6x6metros.jpg',
  '/img/chafing dish.png',
  '/img/calentador sterno.png',
  '/img/galeria-1.jpg',
  '/img/galeria-2.jpg',
  '/img/galeria-3.jpg',
  '/img/galeria-4.jpg',
  '/img/galeria-5.jpg',
  '/img/galeria-6.jpg',
  '/img/galeria-7.jpg',
  '/img/galeria-8.jpg',
  '/img/galeria-9.jpg',
  '/img/galeria-10.jpg',
  '/img/galeria-11.jpg',
  '/img/galeria-12.jpg',
  '/img/galeria-13.jpg',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Evento 'install': Pre-caché inmediato de recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Evento 'activate': Limpieza de cachés anteriores y control inmediato
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento 'fetch': Estrategias inteligentes de caché para máxima velocidad
self.addEventListener('fetch', event => {
  const request = event.request;

  // Solo peticiones GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Navegación y páginas HTML: Network First con fallback a caché
  if (request.mode === 'navigate' || request.destination === 'document' || request.url.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then(cached => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // 2. CSS y JavaScript: Stale-While-Revalidate (Carga instantánea en 0ms y actualiza en segundo plano)
  if (request.destination === 'style' || request.destination === 'script' || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Imágenes y Fuentes: Cache First con almacenamiento dinámico
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(networkResponse => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => null);
    })
  );
});