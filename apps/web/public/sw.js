const CACHE_NAME = 'shebloom-cache-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // caching root and some assets
      return cache.addAll(['/']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network first, falling back to cache
self.addEventListener('fetch', (e) => {
  // Only handle HTTP/HTTPS, avoid wss:// schemes for sockets
  if (!e.request.url.startsWith('http')) return;
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
