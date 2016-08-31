'use strict';

var cacheName = 'cache-network-race';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll([
          'index.html',
          'style.css',
          'index.js'
        ]);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    resolveAny([
      caches.match(event.request),
      fetch(event.request)
    ])
  );
});

function resolveAny(promises) {
  return new Promise(function(resolve, reject) {
    promises = promises.map(function(promise) {
      return Promise.resolve(promise);
    });

    promises.forEach(function(promise) {
      promise.then(resolve);
    });
    
    promises.reduce(function(a, b) {
      return a.catch(function() {
        return b;
      });
    }).catch(function() {
      return reject(Error("All have failed"));
    });
  });
}
