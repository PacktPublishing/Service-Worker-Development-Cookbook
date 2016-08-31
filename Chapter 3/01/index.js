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

navigator.serviceWorker.addEventListener('controllerchange',
  function(event) {
    console.log('EVENT: controllerchange', event);

    navigator.serviceWorker.controller
      .addEventListener('statechange',
        function() {
          console.log('EVENT: statechange', this.state);
          if (this.state === 'activated') {
            document.querySelector('#notification').classList.remove('hidden');
          } 
        }
      );
  }
);

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
