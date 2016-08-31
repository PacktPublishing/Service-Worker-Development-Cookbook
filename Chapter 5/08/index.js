'use strict';

var scope = {
  scope: './'
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    'service-worker.js',
    scope
  ).then( function(serviceWorker) {
    printStatus('successful');
  }).catch(function(error) {
    printStatus(error);
  });
} else {
  printStatus('unavailable');
}

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

function fetchServiceWorkerUpdate() {
  var img = document.getElementById('picture');
  img.src = 'picture.jpg?' + Date.now();

  fetch('./version').then(function(res) {
    return res.text();
  }).then(function(text) {
    debug(text, 'version');
  });
}

if (navigator.serviceWorker.controller) {
  var url = navigator.serviceWorker.controller.scriptURL;
  console.log('serviceWorker.controller', url);
  debug(url, 'onload');
  fetchServiceWorkerUpdate();
} else {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  }).then(function(registration) {
    debug('REFRESH for the Service Worker to control this client', 'onload');
    debug(registration.scope, 'register');
  });
}

navigator.serviceWorker.addEventListener('controllerchange', function() {
  var scriptURL = navigator.serviceWorker.controller.scriptURL;
  console.log('serviceWorker.onControllerchange', scriptURL);
  debug(scriptURL, 'oncontrollerchange');
  fetchServiceWorkerUpdate();
});

document.querySelector('#update').addEventListener('click', function() {
  navigator.serviceWorker.ready.then(function(registration) {
    registration.update().then(function() {
      console.log('Checked for service worker update');
    }).catch(function(err) {
      console.error('Service worker update failed', err);
    });
  });
});

function debug(msg, el) {
  var target = document.querySelector('#' + el || 'log');
  target.textContent = msg;
}
