var version = 1;
var currentCache = {
  offline: 'offline-cache' + version
};

var offlineUrl = 'offline.html';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
        'offline.svg',
        offlineUrl
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' ||
    (event.request.method === 'GET' &&
    event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(createCacheBustedRequest(event.request.url)).catch(function(error) {
        // Return the offline page
        console.log('Fetch failed. Returning offline page instead.', error);
        return caches.match(offlineUrl);
      })
    );
  } else {
    // Respond with everything else if we can
    event.respondWith(caches.match(event.request)
        .then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

function createCacheBustedRequest(url) {
  var request = new Request(url,
    {cache: 'reload'}
  );
  // See https://fetch.spec.whatwg.org/#concept-request-mode
  // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
  // if the cache: 'reload' option had any effect.
  if ('cache' in request) {
    return request;
  }

  // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
  var cacheBustingUrl = new URL(url, self.location.href);
  cacheBustingUrl.search += (cacheBustingUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(cacheBustingUrl);
}
