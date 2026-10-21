const CACHE_NAME = 'f1-pwa-v2';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// ดึงข้อมูลใหม่ล่าสุดจากเว็บก่อนเสมอ (Network First) จะได้ไม่ติดปัญหาโค้ดเก่าค้าง
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
