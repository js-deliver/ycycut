self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('ycycut_v1').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/icon.jpg',
      '/manifest.json',
    ])),
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open('ycycut_v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
