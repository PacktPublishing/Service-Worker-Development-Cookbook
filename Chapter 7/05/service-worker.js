'use strict';

var cacheName= 'cache';
var currentCaches = {
  prefetch: 'prefetch-' + cacheName
};

self.addEventListener('install', function(event) {
  var prefetchedURLs = [
    'prefetched.txt',
    'prefetched.html',
    'apple-logo.png'
  ];
  event.waitUntil(
    caches.open(currentCaches.prefetch).then(function(cache) {
      var cachePromises = prefetchedURLs.map(function(prefetchedURLs) {
        var url = new URL(prefetchedURLs, location.href);

        url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

        var request = new Request(url, {mode: 'no-cors'});

        return fetch(request).then(function(res) {
          if (res.status >= 400) {
            throw new Error('FAIL: request for ' + prefetchedURLs +
              ' failed, status ' + res.statusText);
          }
          console.log('CACHING: Caching');
          return cache.put(prefetchedURLs, res);
        }).catch(function(err) {
          console.error('CACHING: Not caching ' + prefetchedURLs + ' due to ' + err);
        });
      });

      return Promise.all(cachePromises).then(function() {
        console.log('PREFETCH: complete.');
      });
    }).catch(function(error) {
      console.error('PREFETCH: failed:', error);
    })
  );
});

self.addEventListener('fetch', function(evt) {
  console.log('FETCH: Handling fetch event for ', evt.request.url);

  evt.respondWith(
    caches.match(evt.request).then(function(res) {
      if (res) {
        console.log('RESPONSE: found in cache:', res);

        return res;
      }

      console.log('RESPONSE: not found in cache. Fetching from network.');

      return fetch(evt.request).then(function(res) {
        console.log('RESPONSE: from network:', res);

        return res;
      }).catch(function(error) {
        console.error('FAIL: fetching :', error);

        throw error;
      });
    })
  );
});

self.addEventListener('activate', function(evt) {
  var expectedCacheNames = Object.keys(currentCaches).map(function(key) {
    return currentCaches[key];
  });

  evt.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('DELETE: out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
