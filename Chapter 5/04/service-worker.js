'use strict';

var cacheName= 'redirect-request';

self.addEventListener('activate', function() {
  clients.claim();
});

self.addEventListener('fetch', function(evt) {
  console.log(evt.request);
  evt.respondWith(
    fetch(evt.request).catch(function() {
      return new Response("FETCH: failed");
    })
  );
});
