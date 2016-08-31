'use strict';

var scope = {
  scope: './'
};

var endpoint;
var baseURL = 'https://localhost:3012/';
var subscriptionBtn = document.querySelector('#subscription-button');

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

function getSubscription() {
  return navigator.serviceWorker.ready
    .then(function(registration) {
      return registration.pushManager.getSubscription();
    });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function() {
      console.log('service worker registered');
      subscriptionBtn.removeAttribute('disabled');
    });
  getSubscription()
    .then(function(subscription) {
      if (subscription) {
        console.log('Already subscribed', subscription.endpoint);
        setUnsubscribeButton();
      } else {
        setSubscribeButton();
      }
    }
  );
}

document.querySelector('#subscription-button').onclick = function() {
  fetch(baseURL + 'sendNotification?endpoint=' + endpoint, {
      method: 'post',
  });
};

function subscribe() {
  navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  }).then(function(subscription) {
    console.log('Subscribed', subscription.endpoint);
    return fetch(baseURL + 'register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });
  }).then(setUnsubscribeButton);
}

function unsubscribe() {
  getSubscription().then(function(subscription) {
    return subscription.unsubscribe()
      .then(function() {
        console.log('Unsubscribed', subscription.endpoint);
        return fetch(baseURL + 'unregister', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      });
  }).then(setSubscribeButton);
}

function setSubscribeButton() {
  subscriptionBtn.onclick = subscribe;
  subscriptionBtn.textContent = 'Subscribe!';
}

function setUnsubscribeButton() {
  subscriptionBtn.onclick = unsubscribe;
  subscriptionBtn.textContent = 'Unsubscribe!';
}
