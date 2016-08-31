var version = 1;
var cacheName = 'static-' + version;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                'http://fonts.ft.com/serif',
                'http://fonts.ft.com/sans-serif'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {

  if (/index/.test(event.request.url) || /style-2/.test(event.request.url)) {
    event.respondWith(caches.match(event.request));
  }
});
