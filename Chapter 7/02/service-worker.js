'use strict';

var cacheName= 'fetch-event-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll([
          'adobe-logo.png',
          'style.css',
          'index.html',
          'index.js',
          'style.css'
        ]);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(res) {
      if (res) {
        console.log('Fetching from cache:', res);

        return res;
      }
      console.log('No response from cache. Fetching from network...');

      return fetch(event.request).then(function(res) {
        console.log('Response from network:', res);

        return res;
      }).catch(function(error) {
        console.error('ERROR: Fetching failed:', error);

        throw error;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
   console.log('Activating the service worker!');
   event.waitUntil(self.clients.claim());
});
