'use strict';

var scope = {
  scope: './'
};

var endpoint;
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
  endpoint = subscription.endpoint;

  fetch(baseURL + 'register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
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

document.querySelector('#send').onclick = function() {
  var delay = document.querySelector('#notification-delay').value;
  var ttl = document.querySelector('#notification-ttl').value;
  var payload = document.querySelector('#notification-payload').value;

  fetch(baseURL + 'sendNotification', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: endpoint,
        payload: payload,
        delay: delay,
        ttl: ttl
      })
    }
  );
};
