'use strict';

console.debug('service-worker.js: this is a service worker');

this.addEventListener('install', function oninstall(event) {
  printLog(
    'Service worker installed, oninstall fired',
    event,
    'Use oninstall to install app dependencies'
  );
});

this.addEventListener('activate', function onactivate(event) {
  printLog(
    'Service worker activated, onactivate fired',
    event,
    'Use onactivate to cleanup old resources'
  );
});

this.addEventListener('fetch', function onfetch(event) {
  printLog(
    'onfecth fired',
    event,
    'Modify requests, do whatever you want'
  );
});

function printLog(info1, debug, info2) {
  console.info(info1);
  console.debug(debug);
  console.info(info2);
}
