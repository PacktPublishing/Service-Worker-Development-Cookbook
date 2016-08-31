'use strict';

var scope = {
  scope: './'
};

var endpoint;
var key;
var authSecret;
var baseURL = 'https://localhost:3012/';

navigator.serviceWorker.register('service-worker.js')
.then(function(registration) {
  return registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription;
    }

    return registration.pushManager.subscribe({ userVisibleOnly: true });
  });
}).then(function(subscription) {
  var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
  key = rawKey ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
        '';
  var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
  authSecret = rawAuthSecret ?
               btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
               '';

  endpoint = subscription.endpoint;

  fetch(baseURL + 'register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      key: key,
      authSecret: authSecret
    }),
  });
});

function printStatus(status) {
  document.querySelector('#status').innerHTML = status;
}

document.querySelector('#resetButton').addEventListener('click',
  function() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.unregister();
      window.location.reload();
    });
  }
);

function askForNotifications(visible) {
  var notificationNum = document.getElementById('notification-count').value;

  fetch(baseURL + 'sendNotification', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: endpoint,
      key: key,
      visible: visible,
      num: notificationNum,
    }),
  });
}

document.querySelector('#visible').onclick = function() {
  askForNotifications(true);
};

document.querySelector('#invisible').onclick = function() {
  askForNotifications(false);
};

document.querySelector('#clear').onclick = function() {
  window.caches.open('notifications').then(function(cache) {
    Promise.all([
      cache.put(new Request('invisible'), new Response('0', {
        headers: {
          'content-type': 'application/json'
        }
      })),
      cache.put(new Request('visible'), new Response('0', {
        headers: {
          'content-type': 'application/json'
        }
      })),
    ]).then(function() {
      updateNotificationNumbers();
    });
  });
};

function updateNotificationNumbers() {
  window.caches.open('notifications').then(function(cache) {
    ['visible', 'invisible'].forEach(function(type) {
      cache.match(type).then(function(res) {
        if(res) {
          res.text().then(function(text) {
            document.getElementById('sent-' + type).textContent = text;
          });
        }
      });
    });
  });
}

window.onload = function() {
  updateNotificationNumbers();
  setInterval(updateNotificationNumbers, 1000);
};
