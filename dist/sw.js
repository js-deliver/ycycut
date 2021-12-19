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

function isInAllowedList(url) {
  const allowedList = [
    "tcb.qcloud.la", "cdn.jsdelivr.net", "qzapp.qlogo.cn", "sinaimg.cn"
  ]
  for (const item of allowedList) {
    if (url.indexOf(item)!==-1) {
      return true
    }
  }
  return false
}

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (result) {
      const request = event.request;
      const url = request.url;
      if (isInAllowedList(url)) {
        return result || fetch(request).then(response => {
          return caches.open('ycycut').then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        });
      } else {
        return fetch(request).then(response => {
          return caches.open('ycycut').then(cache => {
            try{
              cache.put(request, response.clone());
            }
            catch (e) {
              console.log(e);
            }
            return response;
          });
        }).catch(
          async () => {
            if (event.clientId) {
              const client = await clients.get(event.clientId);
              if (client) {
                client.postMessage({
                  msg: "OFFLINE",
                  url: event.request.url
                });
              }
            }
            return result
          }
        );
      }
    }));
});
