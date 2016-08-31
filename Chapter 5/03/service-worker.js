var baseURL = 'https://localhost:3011';

self.oninstall = function(evt) {
  evt.waitUntil(self.skipWaiting());
};

self.onactivate = function(evt) {
  evt.waitUntil(self.clients.claim());
};

self.onfetch = function(evt) {
  var req = evt.request;

  if (isResource(req)) {
    evt.respondWith(fetchContentFromBestServer(req));
  } else {
    evt.respondWith(fetch(req));
  }
};

function isResource(req) {
  return req.url.match(/\/images\/.*$/) && req.method === 'GET';
}

function fetchContentFromBestServer(req) {
  var session = req.url.match(/\?session=([^&]*)/)[1];
  return getContentServerLoads(session)
    .then(selectContentServer)
    .then(function(serverUrl) {
      var resourcePath = req.url.match(/\/images\/[^?]*/)[0],
        serverReq = new Request(serverUrl + resourcePath);

      return fetch(serverReq);
    });
}

function getContentServerLoads(session) {
  return fetch(baseURL + '/server-loads?session=' + session).then(function(res) {
    return res.json();
  });
}

function selectContentServer(serverLoads) {
  var min = Math.min.apply(Math, serverLoads),
    serverIndex = serverLoads.indexOf(min);

  return './server-' + (serverIndex + 1);
}
