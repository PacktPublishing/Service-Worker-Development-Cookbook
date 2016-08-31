'use strict';

importScripts('./vendor/zip.js');
importScripts('./vendor/ArrayBufferReader.js');
importScripts('./vendor/deflate.js');
importScripts('./vendor/inflate.js');
importScripts('./helper.js');
importScripts('./cacheProvider.js');

var zipURL = './archive.zip',
  cachePromise,
  contentTypes = {
    css : 'text/css',
    js : 'application/javascript',
    png : 'image/png',
    jpg : 'image/jpeg',
    jpeg: 'image/jpeg',
    html: 'text/html',
    htm : 'text/html'
  };

zip.useWebWorkers = false;

self.oninstall = function(event) {
  event.waitUntil(
    fetch(zipURL)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(getZipFileReader)
      .then(cacheFileContents)
      .then(self.skipWaiting.bind(self))
  );
};

self.onactivate = function(evt) {
  evt.waitUntil(self.clients.claim());
};

self.onfetch = function(evt) {
  evt.respondWith(openCache().then(function(cache) {
    var request = evt.request;

    return cache.match(request).then(function(res) {
      return res || fetch(request);
    });
  }));
};
