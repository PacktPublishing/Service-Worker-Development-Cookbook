'use strict';

importScripts('analytics.js');

var version = 1,
  currentCaches = {
    'offline-google-analytics': 'offline-google-analytics-v' + version
  },
  db,
  idbInstance,
  idbVersion = 1,
  throttle = 10000000,
  idbStore = 'urls';

var db = openIDBDatabase('offline-google-analytics', idbVersion);
db.onerror = function(err) {
  console.error('%c ✗ ERROR: IndexedDB - %s', 'color: #ff0000', err);
};

db.onupgradeneeded = function() {
  this.result.createObjectStore(idbStore, {keyPath: 'url'});
};

db.onsuccess = function() {
  idbInstance = this.result;
  replayGoogleAnalyticsRequests(idbInstance, idbStore, throttle);
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
            console.log('DELETE: Out of date cache:', cacheName);
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
    caches.open(currentCaches['offline-google-analytics']).then(function(cache) {
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

          if (res.status < 400) {
            cache.put(event.request, res.clone());
          } else if (res.status >= 500) {
            checkForAnalyticsRequest(event.request.url);
          }

          return res;
        }).catch(function(err) {
          checkForAnalyticsRequest(event.request.url);

          throw err;
        });
      }).catch(function(err) {
        throw err;
      });
    })
  );
});

function openIDBDatabase(name, version) {
  return indexedDB.open(name, version);
}

function getIDBObjectStore(idbInstance, idbStore, mode) {
  return idbInstance.transaction(idbStore, mode).objectStore(idbStore);
}
