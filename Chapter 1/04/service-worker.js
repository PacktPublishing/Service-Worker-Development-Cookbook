function timeout(delay) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(new Response('', {
                status: 408,
                statusText: 'Request timed out.'
            }));
        }, delay);
    });
}

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});

self.addEventListener('fetch', function(event) {
  if (/\.js$/.test(event.request.url)) {
    event.respondWith(Promise.race([timeout(400), fetch(event.request.url)]));
  } else {
    event.respondWith(fetch(event.request));
  }
});
