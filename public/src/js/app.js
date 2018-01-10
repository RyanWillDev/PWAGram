var deferredPrompt;

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
  .then(res => {
    console.log('SW registered!');
  });
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  return false;
});
