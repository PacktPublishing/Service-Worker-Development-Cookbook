'use strict';

var cacheVersion = 1,
  currentCaches = {
  font: 'selective-caching-v' + cacheVersion
};

self.addEventListener('activate', function(event) {
  var cacheNamesExpected = Object.keys(currentCaches).map(function(key) {
    return currentCaches[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheNamesExpected.indexOf(cacheName) === -1) {
            console.log('DELETE: out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('%c ⚡ EVENT: %cHandling fetch event for %s','color: #F57F20',
  'color: #000',
  event.request.url);

  event.respondWith(
    caches.open(currentCaches.font).then(function(cache) {
      return cache.match(event.request).then(function(res) {
        if (res) {
          console.log(
            '%c ✓ RESPONSE: %cFound in cache: %s',
            'color: #5EBD00', 'color: #000000', res
          );
          return res;
        }

        console.log('%c ✗ RESPONSE: %cNot found for %s in cache. ' +
          'Attempt to fetch from network', 'color: #EB4A4B', 'color: #000000',
          event.request.url);

        return fetch(event.request.clone()).then(function(res) {
          console.log('%c ✓ RESPONSE: %cFor %s from network: %O',
            'color: #5EBD00', 'color: #000000',
            event.request.url, res);

          if (res.status < 400 &&
              res.headers.has('content-type') &&
              res.headers.get('content-type').match(/^font\//i)) {
            console.log('%c ✓ RESPONSE: %cCaching to %s ',
              'color: #5EBD00', 'color: #000000',
              event.request.url);
            cache.put(event.request, res.clone());
          } else {
            console.log('%c ✓ RESPONSE: %cNot caching to %s ',
              'color: #5EBD00', 'color: #000000',
              event.request.url);
          }

          return res;
        });
      }).catch(function(err) {
        throw error;
      });
    })
  );
});
