function App() {
  var self = this;

  Logger.log('App started');

  this.serviceWorkerUtil = new ServiceWorkerUtil();

  document.getElementById('reloadapp').addEventListener('click', function() {
    window.location.reload();
  });

  if (this.serviceWorkerUtil.isServiceWorkerSupported()) {
    document.getElementById('swinstall').addEventListener('click',
      function() {
        self.enableFeatures();
      }
    );

    document.getElementById('swuninstall').addEventListener('click',
      function() {
        self.disableFeatures();
      }
    );

    if (this.serviceWorkerUtil.isServiceWorkerControllingThisApp()) {
      Logger.info('App code run as expected');

      this.disableServiceWorkerRegistration();
    } else {
      this.enableServiceWorkerRegistration();
    }
  } else {
    Logger.error('This browser does not support the service worker feature');
  }
}

App.prototype.enableFeatures = function enableFeatures() {
  var scriptURL;
  var scope;

  Logger.newSection();
  Logger.log('ENABLE: Features enabled.');

  scriptURL = document.getElementById('swscripturl');
  scope = document.getElementById('swscope');

  Logger.debug(
    'Configuring the following service worker ' + scriptURL.value +
    ' with scope ' + scope.value
  );

  if (scriptURL.value !== '') {
    Logger.debug('scriptURL: ' + scriptURL.value);
  } else {
    Logger.error('No SW scriptURL specified');
    return;
  }

  if (scope.value !== '') {
    Logger.debug('SCOPE: ' + scope.value);
  } else {
    Logger.warn('SCOPE: not specified');
  }

  this.serviceWorkerUtil.registerServiceWorker(scriptURL.value, scope.value).then(
      this.disableServiceWorkerRegistration,
      this.enableServiceWorkerRegistration
  );
};

App.prototype.disableFeatures = function disableFeatures() {
  Logger.newSection();
  Logger.log('Disabling cool features...');

  this.serviceWorkerUtil.unregisterServiceWorker().then(
      this.enableServiceWorkerRegistration,
      this.disableServiceWorkerRegistration
  );
};

App.prototype.enableServiceWorkerRegistration = function() {
  document.getElementById('swinstall').disabled = false;
  document.getElementById('swuninstall').disabled = true;
};

App.prototype.disableServiceWorkerRegistration = function() {
  document.getElementById('swinstall').disabled = true;
  document.getElementById('swuninstall').disabled = false;
};

var app = new App();

console.debug(app);
