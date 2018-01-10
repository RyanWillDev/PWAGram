self.addEventListener('install', event => {
 event.waitUntil(
   // Precache the app shell
   caches.open('static')
    .then(cache => {
      cache.addAll([
        '/',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image-lg.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedAsset => {
        if (cachedAsset) return cachedAsset;
        else return fetch(event.request);
      })
  );
});
