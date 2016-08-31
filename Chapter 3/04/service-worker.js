'use strict';

var cacheVersion = 1;
var currentCaches = {
  prefetch: 'window-cache-v' + cacheVersion
};

self.addEventListener('install', function(event) {
  var prefetchUrls = [
    './prefetched.html',
  ];

  console.log('EVENT: install. Prefetching resource:',
    prefetchUrls);

  event.waitUntil(
    caches.open(currentCaches.prefetch).then(function(cache) {
      return cache.addAll(prefetchUrls.map(function(prefetchUrl) {
        return new Request(prefetchUrl, {mode: 'no-cors'});
      })).then(function() {
        console.log('SUCCESS: All resources fetched and cached.');
      });
    }).catch(function(error) {
      console.error('FAIL: Prefetch:', error);
    })
  );
});

self.addEventListener('activate', function(event) {
  var expectedCacheNames = Object.keys(currentCaches).map(function(key) {
    return currentCaches[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('DELETE: Out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
