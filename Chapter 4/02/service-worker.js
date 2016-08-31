'use strict';

var version = 1,
  currentCaches= { readThrough : 'version-' + version },
  NOT_FOUND = -1,
  ERROR_RESPONSE = 400;

self.addEventListener('activate', function(event) {
  var expectingCacheNames = Object.keys(currentCaches).map(function(key) {
    return currentCaches[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectingCacheNames.indexOf(cacheName) === NOT_FOUND) {
            console.log(
              '%c DELETE: Out of date cache: %s',
              'color: #ff0000',
              cacheName
            );
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request,
    requestUrl = request.url;

  console.log(
    '%c ⚡ EVENT: %c Handling fetch event for %s',
    'color: #F57F20',
    'color: #000',
    requestUrl
  );

  event.respondWith(
    caches.open(currentCaches['readThrough']).then(function(cache) {
      return cache.match(request).then(function(response) {
        if (response) {
          console.log(
            '%c ✓ RESPONSE: %c Found in cache: %s',
            'color: #5EBD00',
            'color: #000000',
            response
          );

          return response;
        }
        console.log(
          '%c ✗ RESPONSE: %c For %s not found in cache. ' +
          'fetching from network...',
          'color: #F05266',
          'color: #000',
          requestUrl
        );

        return fetch(request.clone()).then(function(response) {
          console.log(
            '%c RESPONSE: %c For %s from network is: %O',
            'color: #F05266',
            'color: #000',
            requestUrl,
            response
          );

          if (response.status < ERROR_RESPONSE) {
            cache.put(request, response.clone());
          }

          return response;
        });
      }).catch(function(err) {
        console.error('FAIL:  Read-through cache:', err);
        throw error;
      });
    })
  );
});
