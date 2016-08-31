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
    navigator.serviceWorker.ready.then(enableRequestLinks);
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

function enableRequestLinks() {
  var validButton = document.querySelector('#valid-call');
  validButton.addEventListener('click', function() {
    fetchApiRequest('https://raw.githubusercontent.com/szaranger/szaranger.github.io/master/service-workers/05/09/brands.json');
  });
  validButton.disabled = false;

  var invalidButton = document.querySelector('#invalid-call');
  invalidButton.addEventListener('click', function() {
    fetchApiRequest('https://raw.githubusercontent.com/szaranger/szaranger.github.io/master/service-workers/05/09/blah.json');
  });
  invalidButton.disabled = false;
}

function fetchApiRequest(url) {
  fetch(url).then(function(res) {
    return res.json();
  }).then(function(res) {
    var brands = res.brands.map(function(brand) {
      return '<li>' + brand.name + '</li>';
    }).join('');

    brands = '<ol>' + brands+ '</ol>';

    document.querySelector('#output').innerHTML = '<h1>Brands</h1>' + brands;
  });
}
