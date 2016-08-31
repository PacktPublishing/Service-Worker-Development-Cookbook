var cacheName = 'notifications';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return Promise.all([
        cache.put(new Request('invisible'), new Response('0', {
          headers: {
            'content-type': 'application/json'
          }
        })),
        cache.put(new Request('visible'), new Response('0', {
          headers: {
            'content-type': 'application/json'
          }
        })),
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim);
});

function updateNumber(type) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(type).then(function(response) {
      return response.json().then(function(notificationNum) {
        var newNotificationNum = notificationNum + 1;

        return cache.put(
          new Request(type),
          new Response(JSON.stringify(newNotificationNum), {
            headers: {
              'content-type': 'application/json',
            },
          })
        ).then(function() {
          return newNotificationNum;
        });
      });
    });
  });
}

self.addEventListener('push', function(event) {

  var visible = event.data ? event.data.json() : false;

  if (visible) {
    event.waitUntil(updateNumber('visible').then(function(num) {
      return self.registration.showNotification('SW', {
        body: 'Received ' + num + ' visible notifications',
      });
    }));
  } else {
    event.waitUntil(updateNumber('invisible'));
  }
});
