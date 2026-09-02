const CACHE_NAME = 'mr-alquileres-cache-v34';
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

// Evento 'install': se dispara cuando el Service Worker se instala
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Fuerza a que el nuevo SW se active inmediatamente
});

// Evento 'activate': Limpia los cachés antiguos
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
    })
  );
  self.clients.claim();
});

// Evento 'fetch': Network First para documentos y scripts, Cache First para estáticos
self.addEventListener('fetch', event => {
  const request = event.request;

  // Solo interceptar peticiones GET
  if (request.method !== 'GET') return;

  // Network First para HTML y scripts JS principales para evitar caché obsoleta
  if (request.mode === 'navigate' || request.destination === 'document' || request.destination === 'script' || request.url.endsWith('.html') || request.url.includes('script.js')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache First para imágenes y recursos estáticos
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
  );
});