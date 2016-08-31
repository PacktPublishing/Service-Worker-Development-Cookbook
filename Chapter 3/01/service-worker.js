'use strict';

var cacheName= 'dependencies-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll([
          'adobe-logo.png',
          'apple-logo.png',
          'google-logo.png',
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
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('Fetching from the cache: ', event.request.url);
          return response;
        } else {
          console.log('Fetching from server: ', event.request.url);
        }
       return fetch(event.request);
     }
   )
 );
});

self.addEventListener('activate', function(event) {
   console.log('Activating the service worker!');
   event.waitUntil(self.clients.claim());
});
