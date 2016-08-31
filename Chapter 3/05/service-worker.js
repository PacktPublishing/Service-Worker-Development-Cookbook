'use strict';

var cacheName= 'stale-while-revalidate';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll([
          'adobe-logo.png',
          'style.css',
          'index.html',
          'index.js',
          'style.css'
        ]);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('stale-while-revalidate')
      .then(function(cache) {
        return cache.match(event.request)
          .then(function(response) {
            var promise;

            if (response) {
              console.log('Fetching from the cache: ', event.request.url);
            } else {
              console.log('Fetching from server: ', event.request.url);
            }

            promise = fetch(event.request)
              .then(function(networkResponse) {
                var cloned = networkResponse.clone();
                cache.put(event.request, cloned);
                console.log('Fetching from the cache: ', event.request.url);
                return networkResponse;
              }
            )
            console.log('Fetching from server: ', event.request.url);
            return response || promise;
          }
        )
      }
    )
  );
});

self.addEventListener('activate', function(event) {
   console.log('Activating the service worker!');
   event.waitUntil(self.clients.claim());
});
