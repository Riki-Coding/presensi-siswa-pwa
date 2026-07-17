const CACHE_NAME = 'aic-presence-v2';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'https://unpkg.com/dexie/dist/dexie.js'
];

// Tahap Install: Amankan semua aset penting ke dalam Cache storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('AIC SW: Caching core assets successfully.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Tahap Aktivasi: Bersihkan cache versi lama jika ada pembaruan kode
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('AIC SW: Clearing old cache storage.');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Strategi Intersepsi: Utamakan ambil data dari cache agar instan & mendukung offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
