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

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (resp) {
      const url = event.request.url;
      if (url.indexOf('api.ycycut.com') !== -1) {
        return fetch(event.request);
      } else {
        return resp || fetch(event.request).then(function (response) {
          return caches.open('ycycut_v1').then(function (cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      }
    }));
});
