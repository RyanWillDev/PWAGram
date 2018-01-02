self.addEventListener('install', event => {
  console.log('Installing the service worker', event);
});

self.addEventListener('activate', event => {
  console.log('Service worker is active', event);
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('fetching', event);
  event.respondWith(fetch(event.request));
});
