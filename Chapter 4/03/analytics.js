'use strict';

var RW = 'readwrite';

function checkForAnalyticsRequest(requestUrl) {
  var url = new URL(requestUrl),
    regex = /^(w{3}|ssl)\.google-analytics.com$/;

  if (url.hostname.match(regex) && url.pathname === '/collect') {
    console.log('INDEXEDDB: Store request(Google analytics) for replaying later.');
    saveGoogleAnalyticsRequest(requestUrl);
  }
}

function saveGoogleAnalyticsRequest(requestUrl) {
  getIDBObjectStore(idbInstance, idbStore, RW).add({
    url: requestUrl,
    timestamp: Date.now()
  });
}

function replayGoogleAnalyticsRequests(idbInstance, idbStore, throttle) {
  var savedGoogleAnalyticsRequests = [];

  getIDBObjectStore(idbInstance, idbStore).openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
      savedGoogleAnalyticsRequests.push(cursor.value);
      cursor.continue();
    } else {
      console.log('REPLAY: Starting %d Google Analytics requests',
        savedGoogleAnalyticsRequests.length);

      savedGoogleAnalyticsRequests.forEach(function(savedRequest) {
        var queueTime = Date.now() - savedRequest.timestamp;
        if (queueTime > throttle) {
          getIDBObjectStore(idbInstance, idbStore, RW).delete(savedRequest.url);
          console.log('REQUEST: Queued for %dms ' +
            'STOPPED: Replay attempt', queueTime);
        } else {
          var requestUrl = savedRequest.url + '&qt=' + queueTime;

          console.log('%c ♫ REPLAY: %s %s', 'color: #1C99D8', 'in progress...', requestUrl);

          fetch(requestUrl).then(function(response) {
            if (response.status < 400) {
              getIDBObjectStore(idbInstance, idbStore, RW).delete(savedRequest.url);
              console.log('%c ♫ REPLAY: %s', 'color: #1C99D8', 'success');
            } else {
              console.error('♫ REPLAY: fail -', response);
            }
          }).catch(function(err) {
            console.error('♫ REPLAY: fail - ', err);
          });
        }
      });
    }
  };
}
