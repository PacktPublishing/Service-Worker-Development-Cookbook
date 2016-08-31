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

document.querySelector('#resetButton').addEventListener('click',
  function() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.unregister();
      window.location.reload();
    });
  }
);

function printStatus(status) {
  document.querySelector('#status').innerHTML = status;
}

document.getElementById('watch-later').addEventListener('click', function(event) {
  event.preventDefault();

  caches.open('video').then(function(cache) {
    fetch('video.mp4').then(function(response) {
      return response.url;
    }).then(function(url) {
      cache.add(url);
    });
  });
});
