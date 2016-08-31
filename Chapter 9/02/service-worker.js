'use strict';

var DELAY = 5000;

function wait(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

self.addEventListener('install', function(evt) {
  console.log('INSTALL: In progress ..');
  evt.waitUntil(
    wait(DELAY).then(function() {
      console.log('INSTALL: Complete');
    })
  );
});

self.addEventListener('activate', function(evt) {
  console.log('ACTIVATION:  In progress ..');
  evt.waitUntil(
    wait(DELAY).then(function() {
      console.log('ACTIVATION: Complete');
    })
  );
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(new Response('Service workers says Hello!'));
});
