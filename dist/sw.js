self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('ycycut').then(cache => cache.addAll([
      '/',
      '/icon.png',
      '/manifest.json',
      '/index.html',
    ])),
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (result) {
      const request = event.request;
      const url = request.url;
      if (url.indexOf('tcb.qcloud.la') !== -1 || url.indexOf('cdn.jsdelivr.net') !== -1) {
        return result || fetch(request).then(response => {
          return caches.open('ycycut').then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        });
      } else {
        return fetch(request).then(response => {
          return caches.open('ycycut').then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        }).catch(
          () => {
            return result
          }
        );
      }
    }));
});
