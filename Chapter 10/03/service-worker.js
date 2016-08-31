'use strict';

var version = 1;
var currentCache = {
  offline: 'offline-cache' + version
};

var offlineUrl = 'offline.html';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
        offlineUrl
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request,
    isRequestMethodGET = request.method === 'GET';

  if (request.mode === 'navigate' || isRequestMethodGET) {
    event.respondWith(
      fetch(createRequestWithCacheBusting(request.url)).catch(function(error) {
        console.log('OFFLINE: Returning offline page.', error);
        return caches.match(offlineUrl);
      })
    );
  } else {
    event.respondWith(caches.match(request)
        .then(function (response) {
        return response || fetch(request);
      })
    );
  }
});

function createRequestWithCacheBusting(url) {
  var request,
    cacheBustingUrl;

  request = new Request(url,
    {cache: 'reload'}
  );

  if ('cache' in request) {
    return request;
  }

  cacheBustingUrl = new URL(url, self.location.href);
  cacheBustingUrl.search += (cacheBustingUrl.search ? '&' : '') + 'cachebust=' + Date.now();

  return new Request(cacheBustingUrl);
}
