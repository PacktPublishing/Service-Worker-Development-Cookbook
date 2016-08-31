'use strict';

var scope = {
  scope: './'
};
var consoleEl = document.getElementById('console');

function print(message) {
  var p = document.createElement('p');

  p.textContent = message;
  consoleEl.appendChild(p);
  console.log(message);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    'service-worker.js',
    scope
  ).then( function(registration) {
    return registration.sync.getTags();
  }).then(function(tags) {
    printStatus('successful');
    if (tags.includes('syncTest')) {
      print('A background sync is already pending');
    }
  }).catch(function(error) {
    printStatus(error);
    print('ERROR: Sync not supported or flag not enabled');
    print(err.message);
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

document.getElementById('register').addEventListener('click', function(event) {
      event.preventDefault();

      new Promise(function(resolve, reject) {
        Notification.requestPermission(function(result) {
          if (result !== 'granted') {
            return reject(Error('Notification permission denied'));
          }
          resolve();
        })
      }).then(function() {
        return navigator.serviceWorker.ready;
      }).then(function(reg) {
        return reg.sync.register('syncTest');
      }).then(function() {
        print('Sync registered');
      }).catch(function(err) {
        print('It broke');
        print(err.message);
      });
});

window.onerror = function(message) {
  print(message);
};
