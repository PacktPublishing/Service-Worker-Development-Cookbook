'use strict';
var count = 1;

self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.showNotification('SW Push Notification', {
      body: 'Notification ' + count++,
      tag: 'swc'
    })
  );
});
