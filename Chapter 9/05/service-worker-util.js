function ServiceWorkerUtil() {
}

ServiceWorkerUtil.prototype.isServiceWorkerControllingThisApp = function() {
  Logger.newSection();
  Logger.log('Are Service Workers in control?');
  Logger.debug('checking navigator.serviceWorker.controller');

  if (navigator.serviceWorker.controller) {
    Logger.info('SERVICE WORKER: Controls this app');
    Logger.debug('The following service worker controls this app: ');
    Logger.debug(navigator.serviceWorker.controller.scriptURL +
                ' <= navigator.serviceWorker.controller.scriptURL');

    Logger.info('Please enable and check the browser logs for the oninstall' +
                ', onactivate, and onfetch events');

    return true;
  }

  Logger.warn('SERVICE WORKER: There is no service worker controlling this app');
  return false;
};

ServiceWorkerUtil.prototype.isServiceWorkerSupported = function() {
  Logger.newSection();
  Logger.log('Are Service Workers Supported?');

  Logger.debug('checking navigator.serviceWorker');

  if (navigator.serviceWorker) {
    Logger.info('SERVICE WORKER: Supported by this browser');
    return true;
  }

  Logger.warn('SERVICE WORKER: Not supported by this browser');
  Logger.debug(navigator.userAgent);
  return false;
};

ServiceWorkerUtil.prototype.registerServiceWorker = function(scriptURL, scope) {
  var registerSecondParam = {};

  Logger.newSection();
  Logger.log('SERVICE WORKER: Registering');
  Logger.info('SERVICE WORKER: Registering with serviceWorker.register()');

  Logger.debug('navigator.serviceWorker.register(scriptURL, scope)');
  Logger.debug('scriptURL: ' + scriptURL);

  if (scope) {
    registerSecondParam.scope = scope;
    Logger.debug('options.scope: ' + registerSecondParam.scope);
  }

  return new Promise(
    function then(resolve, reject) {

      navigator.serviceWorker.register(
        scriptURL,
        registerSecondParam
      ).then(

        function registrationSuccess(registration) {
          Logger.debug('registrationSuccess(registration)');
          Logger.debug(registration);

          if (registration.active) {
            Logger.debug('SERVICE WORKER: Registering again');
            Logger.debug(registration.active.scriptURL +
                         ' <= registration.active.scriptURL');
          }

          if (registration.installing) {
            Logger.debug('SERVICE WORKER: Registering for the first time: ');
            Logger.debug(registration.installing.scriptURL +
                         ' <= registration.installing.scriptURL');
          }

          if (registration.scope) {
            Logger.debug('with scope: ' + registration.scope +
                         ' <= registration.scope');
          }


          Logger.info('SERVICE WORKER: Successfully registered');
          Logger.info('LOGS: Enable/check the browser logs for' +
                      ' the oninstall, onactivate, and onfetch events');
          Logger.info('SERVICE WORKER: is in control, when the document is reloaded');

          resolve();
        },
        function registrationError(reason) {
          Logger.debug('ERROR: registrationError(reason)');
          Logger.info('SERVICE WORKER: Not registered');
          Logger.error(reason);

          reject();
        }
      );
    }
  );
};

ServiceWorkerUtil.prototype.unregisterServiceWorker = function() {
  Logger.newSection();

  Logger.log('SERVICE WORKER: Unregistering..');
  Logger.debug('SERVICE WORKER: Unregister, if something goes wrong');

  return new Promise(
    function then(resolve, reject) {
      Logger.debug('navigator.serviceWorker.getRegistration()' +
                   '.then(success, error)');

      navigator.serviceWorker.getRegistration()
      .then(function getRegistrationSuccess(registration) {
        Logger.debug('getRegistrationSuccess(registration)');
        Logger.debug(registration);
        Logger.debug('Unregistering the following service worker: ' +
          registration.active.scriptURL +
          ' <= registration.active.scriptURL');
        Logger.debug('with scope ' + registration.scope +
                     ' <= registration.scope');

        Logger.debug('registration.unregister().then()');
        registration.unregister()
          .then(

            function unregisterSuccess() {
              Logger.debug('unregisterSuccess()');
              Logger.info('SERVICE WORKER: Unregistered successfully');

              resolve();
            },

            function unregisterError(reason) {
              Logger.debug('unregisterError(reason)');
              Logger.error('SERVICE WORKER: Has not been unregistered');
              Logger.error(reason);

              reject();
            }
          );
      },

      function getRegistrationError(reason) {
        Logger.debug('getRegistrationError(reason)');
        Logger.error(reason);
        Logger.warn('SERVICE WORKER: Failed to unregister');
      }
    );
    }
  );
};
