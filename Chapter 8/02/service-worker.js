'use strict';

self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : 'Payload not provided';

  event.waitUntil(
    self.registration.showNotification('SW Push Notification with Payload', {
      body: payload
    })
  );
});
