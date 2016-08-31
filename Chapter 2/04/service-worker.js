var version = 1;
var cacheName = 'static-' + version;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                'index.html',
                'webfont-serif.woff'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request));
});
