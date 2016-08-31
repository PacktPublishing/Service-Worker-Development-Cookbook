'use strict';

var scope = {
  scope: './'
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    'service-worker.js',
    scope
  ).then(function(registration) {
    var serviceWorker;
    
    if (registration.installing) {
      serviceWorker = registration.installing;
      document.querySelector('#control-status').textContent = 'Installing';
    } else if (registration.waiting) {
      serviceWorker = registration.waiting;
      document.querySelector('#control-status').textContent = 'Waiting';
    } else if (registration.active) {
      serviceWorker = registration.active;
      document.querySelector('#control-status').textContent = 'Active';
    }

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
