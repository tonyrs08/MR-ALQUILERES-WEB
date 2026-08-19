const CACHE_NAME = 'mr-alquileres-cache-v27';
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

// Evento 'fetch': intercepta las solicitudes de red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no está en caché, va a la red
        return fetch(event.request);
      })
  );
});