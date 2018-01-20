var CURRENT_STATIC_KEY = 'static-v1',
    CURRENT_DYNAMIC_KEY = 'dynamic-v1';

self.addEventListener('install', event => {
 event.waitUntil(
   // Precache the app shell
   caches.open(CURRENT_STATIC_KEY)
    .then(cache => {
      cache.addAll([
        '/',
        '/offline.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ]);
    })
  );
});

// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//   .then(cache => cache.keys()
//     .then(keys => {
//         if (keys.length <= maxItems) return;
//         cache.delete(keys[0])
//         .then(trimCache(cacheName, maxItems))
//     })
//   );
// }

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CURRENT_STATIC_KEY && key !== CURRENT_DYNAMIC_KEY) return caches.delete(key);
          })
        );
      })
  )
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
  var url = 'https://httpbin.org/get';

  event.respondWith(
    event.request.url.indexOf(url) > -1
    ? cacheThenNetwork(event)
    : cacheFirstWithNetworkFallback(event)
  );
});

function cacheThenNetwork(event) {
  return caches.open(CURRENT_DYNAMIC_KEY)
    .then(cache => {
      return fetch(event.request)
        .then(res => {
          // trimCache(CURRENT_DYNAMIC_KEY, 10);
          cache.put(event.request, res.clone());
          return res;
        });
    })
}

function cacheFirstWithNetworkFallback(event) {
  return caches.match(event.request)
    .then(cachedAsset => {
      if (cachedAsset) return cachedAsset;
      else {
        return fetch(event.request)
          .then(res => {
            return caches.open(CURRENT_DYNAMIC_KEY)
              .then(cache => {
                // trimCache(CURRENT_DYNAMIC_KEY, 10);
                cache.put(event.request.url, res.clone());
                return res;
              });
          })
          .catch(err => {
            return caches.open(CURRENT_STATIC_KEY)
              .then(cache => {
                if (event.request.headers.get('accept').includes('text/html')) return cache.match('/offline.html')
              });
          });
      }
    });
}
