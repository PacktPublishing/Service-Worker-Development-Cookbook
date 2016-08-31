'use strict';

if (typeof self.skipWaiting === 'function') {
  console.log('self.skipWaiting()');
  self.addEventListener('install', function(evt) {
    evt.waitUntil(self.skipWaiting());
  });
} else {
  console.log('self.skipWaiting() is unsupported.');
}

if (self.clients && (typeof self.clients.claim === 'function')) {
  console.log('self.clients.claim()');
  self.addEventListener('activate', function(evt) {
    evt.waitUntil(self.clients.claim());
  });
} else {
  console.log('self.clients.claim() is unsupported.');
}
