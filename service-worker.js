const CACHE_NAME = 'makanzipro-gaming-v1';
const FILES_TO_CACHE = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png',
  './images/IMG_20261102_213201_136.jpg',
  './images/cars-psp-cover-v1.webp',
  './images/downhill-domination-ps2-cover.webp',
  './images/god-of-war-ghost-of-sparta-psp-cover.webp',
  './images/grand-theft-auto-vice-city-stories-psp-cover.webp',
  './images/lego-batman-the-video-game-psp-cover.webp',
  './images/resident-evil-4-ps2-cover.webp'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (new URL(event.request.url).origin === self.location.origin && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
