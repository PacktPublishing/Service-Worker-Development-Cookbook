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

navigator.serviceWorker.getRegistration().then(function(reg) {
  if (reg && reg.active) {
    displayImages();
  }
});

navigator.serviceWorker.oncontrollerchange = function() {
  if (navigator.serviceWorker.controller) {
    printInstall('INSTALL: Completed');
    displayImages();
  }
};

document.querySelector('#install').onclick = function() {
  navigator.serviceWorker.register('worker.js').then(function() {
    printInstall('INSTALL: In progress...');
  }).catch(function(err) {
    printInstall('INSTALL: Error while service worker installation :');
    printInstall(err.message);
  });
};

document.querySelector('#uninstall').onclick = function() {
  navigator.serviceWorker.getRegistration().then(function(reg) {
    if (!reg) {
      return;
    }
    reg.unregister().then(function() {
        printUninstall('UNINSTALL: Completed');
        setTimeout(function() { location.reload(); }, 1000);
      }).catch(function(err) {
        printUninstall('UNINSTALL: Error while service worker uninstallation :');
        printUninstall(err.message);
      });
  });
};

document.querySelector('#load-image').onclick = function() {
  document.querySelector('img').src = document.querySelector('select').value;
};

function displayImages() {
  document.querySelector('#logos').hidden = false;
  document.querySelector('#install-notice').hidden = true;
}

function printInstall(msg) {
  print(msg, 'Install');
}

function printUninstall(status) {
  print(status, 'Uninstall');
}

function print(msg, result) {
  console.log(status, msg);
  document.querySelector('#results').textContent += msg + '\n';
}
