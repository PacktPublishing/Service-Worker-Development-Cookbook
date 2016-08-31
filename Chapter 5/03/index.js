'use strict';

var serverLoads = [
  document.querySelector('#load-1'),
  document.querySelector('#load-2'),
  document.querySelector('#load-3')
];

var baseURL = 'https://localhost:3011';

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

navigator.serviceWorker.register('service-worker.js');
navigator.serviceWorker.ready.then(displayUI);

function displayUI() {
  getServerLoads().then(function(loads) {
    serverLoads.forEach(function(input, index) {
      input.value = loads[index];
      input.disabled = false;
    });
    document.querySelector('#image-selection').disabled = false;
  });
}

function getServerLoads() {
  return fetch(setSession(baseURL + '/server-loads/')).then(function(response) {
    return response.json();
  });
}

document.querySelector('#load-configuration').onsubmit = function(event) {
  event.preventDefault();

  var loads = serverLoads.map(function(input) {
    return parseInt(input.value, 10);
  });

  fetch(setSession(baseURL + '/server-loads'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loads)
  }).then(function(res) {
    return res.json();
  }).then(function(result) {
    document.querySelector('#server-label').textContent = result;
  });
};

document.querySelector('#image-selection').onchange = function() {
  var imgUrl = document.querySelector('select').value,
    img = document.querySelector('img');

  if (imgUrl) {
    img.src = setSession(imgUrl) + '&_b=' + Date.now();

    img.onload = function() {
      if (window.parent !== window) {
        window.parent
          .document.body.dispatchEvent(new CustomEvent('iframeresize'));
      }
    };
  }
};

function setSession(url) {
  return url + '?session=' + getSession();
}

function getSession() {
  var session = localStorage.getItem('session');
  if (!session) {
    session = '' + Date.now() + '-' + Math.random();
    localStorage.setItem('session', session);
  }
  return session;
}
