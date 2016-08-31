window.onhashchange = function() {
  var newInjector = window.location.hash.substr(1) || 'production',
    lastInjector = getLastInjector();

  if (newInjector !== lastInjector) {
    navigator.serviceWorker.oncontrollerchange = function() {
      this.controller.onstatechange = function() {
        if (this.state === 'activated') {
          window.location.reload();
        }
      };
    };
    registerNewInjector(newInjector);
  }
};

window.onhashchange();

function registerNewInjector(newInjector) {
  var newInjectorUrl = newInjector + '-sw.js';
  return navigator.serviceWorker.register(newInjectorUrl);
}

function getLastInjector() {
  var newInjector,
    ctr = navigator.serviceWorker.controller;

  if (ctr) {
    newInjector = ctr.scriptURL.endsWith('production-sw.js')
                 ? 'production' : 'development';
  }
  return newInjector;
}
