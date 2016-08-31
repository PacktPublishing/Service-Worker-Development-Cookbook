function onInstall(evt) {
  evt.waitUntil(self.skipWaiting());
}

function onActivate(evt) {
  evt.waitUntil(self.clients.claim());
}

function onFetch(evt) {
  var abstractRes = evt.request.url,
    actualRes = getActualRes(abstractRes);

  evt.respondWith(fetch(actualRes || abstractRes));
}

function getActualRes(abstractRes) {
  var actualRes,
    keys = Object.keys(mapping);

  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];

    if (abstractRes.endsWith(key)) {
      actualRes = mapping[key];
      break;
    }
  }

  return actualRes;
}
