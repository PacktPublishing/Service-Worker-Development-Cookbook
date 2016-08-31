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
  document.body.appendChild(document.createTextNode(Array.prototype.join.call(arguments, ", ") + '\n'));
  console.log.apply(console, arguments);
}

document.querySelector('#resetButton').addEventListener('click',
  function() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.unregister();
      window.location.reload();
    });
  }
);
