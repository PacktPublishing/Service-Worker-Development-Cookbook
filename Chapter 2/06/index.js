'use strict';

var protocols = {
  'https-acao': 'https://i942.photobucket.com/albums/ad261/szaranger/Packt/packt-logo.png',
  'https': 'https://dz13w8afd47il.cloudfront.net/sites/all/themes/packt_v4/images/packtlib-logo-dark.png',
  'http': 'http://seanamarasinghe.com/wp-content/uploads/2015/06/icon-128x128.jpg'
};

navigator.serviceWorker.getRegistration().then(function(registration) {
  var fetchModes = ['cors', 'no-cors'];

  if (!registration || !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('./service-worker.js').then(function() {
      console.log('Service worker registered, reloading the page');
      window.location.reload();
    });
  } else {
    console.log('Client is under service worker\'s control');

    for (var protocol in protocols) {
      if (protocols.hasOwnProperty(protocol)) {
        buildImage(protocol, protocols[protocol]);

        for (var i = 0; i < fetchModes.length; i++) {
          var fetchMode = fetchModes[i],
            init = {
              method: 'GET',
              mode: fetchMode,
              cache: 'default'
            };

          fireRequest(fetchMode, protocol, init)();
        }
      }
    }
  }
});

function buildImage(protocol, url) {
  var element = protocol + '-image',
    image = document.createElement('img');

  image.src = url;
  document.getElementById(element).appendChild(image);
}

function fireRequest(fetchMode, protocol, init) {
  return function() {
    var section = protocol + '-' + fetchMode,
      url = protocols[protocol];

    fetch(url, init).then(function(response) {
      printSuccess(response, url, section);
    }).catch(function(error) {
      printError(error, url, section);
    });

    fetch('./proxy/' + url, init).then(function(response) {
      url = './proxy/' + url;
      printSuccess(response, url, section);
    }).catch(function(error) {
      section = 'service-' + section;

      console.log(section, 'ERROR: ', url, error);
      log(section, 'ERROR: ' + error, 'error');
    });
  };
}

function printSuccess(response, url, section) {
  if (response.ok) {
    console.log(section, 'SUCCESS: ', url, response);
    log(section, 'SUCCESS');
  } else {
    console.log(section, 'FAIL:', url, response);
    log(section, 'FAIL: response type: ' + response.type +
                 ', response status: ' + response.status, 'error');
  }
}

function printError(error, url, section) {
  console.log(section, 'ERROR: ', url, error);
  log(section, 'ERROR: ' + error, 'error');
}

function log(id, message, type) {
  var type = type || 'success',
    sectionElement = document.getElementById(id),
    logElement = document.createElement('p');

  if (type) {
    logElement.classList.add(type);
  }
  logElement.textContent = message;
  sectionElement.appendChild(logElement);
}
