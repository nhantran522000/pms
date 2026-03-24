const CACHE_NAME = 'pms-v1';
const STATIC_CACHE = 'pms-static-v1';
const API_CACHE = 'pms-api-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== API_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch event - cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for static assets
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            return caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          })
        );
      })
    );
    return;
  }

  // Network-first for API calls
  if (url.pathname.startsWith('/api/v1/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            return caches.open(API_CACHE).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Default: network-first for HTML pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        return caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(request))
  );
});
