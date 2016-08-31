'use strict';

importScripts('handlebars.js');

var cacheName= 'template-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll([
          'index.html',
          'style.css',
          'service-worker.js',
          'people.json'
        ]);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('index.html').then(function(res) {
        if(res) {
          return res.text();
        }
      }),
      caches.match('people.json').then(function(res) {
        return res.json();
      })
    ]).then(function(resps) {
      var template = resps[0],
        data = resps[1],
        renderTemplate = Handlebars.compile(template);

      return new Response(renderTemplate(data), {
        headers: {
          'Content-Type': 'text/html'
        }
      });
    })
  );
});
