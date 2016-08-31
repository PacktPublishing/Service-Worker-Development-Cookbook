'use strict';

self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.showNotification('SW Push Notification', {
      body: 'Notification received!',
    })
  );
});
