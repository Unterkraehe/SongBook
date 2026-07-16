/* Songbook service worker — offline app shell, cached fonts */
const VERSION = 'songbook-v2';
const CORE = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // app navigation: serve the cached shell, refresh it in the background
  if (e.request.mode === 'navigate'){
    e.respondWith(
      caches.match('./index.html').then(cached => {
        const fresh = fetch(e.request).then(resp => {
          if (resp && resp.ok) caches.open(VERSION).then(c => c.put('./index.html', resp.clone()));
          return resp;
        }).catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  // same-origin assets + Google Fonts: cache-first with background refresh
  const cacheable = url.origin === location.origin
    || url.hostname === 'fonts.googleapis.com'
    || url.hostname === 'fonts.gstatic.com';
  if (!cacheable) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(resp => {
        if (resp && (resp.ok || resp.type === 'opaque'))
          caches.open(VERSION).then(c => c.put(e.request, resp.clone()));
        return resp;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
