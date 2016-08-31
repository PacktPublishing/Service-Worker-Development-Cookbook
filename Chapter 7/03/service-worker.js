'use strict';

var cacheName= 'fetch-json';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return fetch('files.json').then(function(response) {
          return response.json();
        }).then(function(files) {
          console.log('Installing files from JSON file: ', files);
          return cache.addAll(files);
        });
      })
      .then(function() {
        console.log(
          'All resources cached'
        );

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
