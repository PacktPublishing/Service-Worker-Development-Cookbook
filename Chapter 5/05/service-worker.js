'use strict';

self.addEventListener('fetch', function(evt) {
  var request = evt.request;

  console.log(
    "FETCH: ",
    evt.request.url,
    "HEADERS: ",
    new Set(request.headers)
  );

  evt.respondWith(fetch(request));
});
