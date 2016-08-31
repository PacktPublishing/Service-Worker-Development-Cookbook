importScripts('injector.js');
importScripts('default-mapping.js');

mapping['utils/dialogs'] = 'fake-dialogs.js';

self.onfetch = onFetch;
self.oninstall = onInstall;
self.onactivate = onActivate;
