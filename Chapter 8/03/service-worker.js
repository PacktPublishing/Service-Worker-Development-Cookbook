'use strict';

self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.showNotification('SW Rich Push Notification', {
      body: 'Richer than richest',
      icon: 'amazon-logo.png',
      vibrate: [300, 100, 300]
    })
  );
});
