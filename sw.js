const CACHE_NAME = 'presensi-v1';
// Daftar file yang ingin kita simpan agar bisa dibuka tanpa internet
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/dexie/dist/dexie.js' // Kita ikut simpan library Dexie juga
];

// 1. Tahap Install: HP akan mendownload semua file di atas
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Mengamankan aset ke dalam cache lokal...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Tahap Fetch: Jika offline, ambil file dari cache lokal HP, bukan dari internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Jika filenya ada di memori HP, pakai itu. Jika tidak, baru cari ke internet.
      return cachedResponse || fetch(event.request);
    })
  );
});