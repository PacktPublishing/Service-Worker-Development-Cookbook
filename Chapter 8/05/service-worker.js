'use strict';

self.addEventListener('push', function(event) {
  event.waitUntil(
    self.clients.matchAll().then(function(clients) {

      var focused = clients.some(function(client) {
        return client.focused;
      });

      var notificationMessage;

      if (focused) {
        notificationMessage = 'Same Page';
      } else if (clients.length > 0) {
        notificationMessage = 'Diffrerent Page, ' +
                              'click here to gain focus';
      } else {
        notificationMessage = 'Page Closed, ' +
                              'click here to re-open it!';
      }

      return self.registration.showNotification('ServiceWorker Cookbook', {
        body: notificationMessage,
      });
    })
  );
});
