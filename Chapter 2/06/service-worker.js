self.onfetch = function(event) {
  if (event.request.url.indexOf('proxy') > -1) {
    var init = { method: 'GET',
                 mode: event.request.mode,
                 cache: 'default' };
    var url = event.request.url.split('proxy/')[1];
    console.log('DEBUG: proxying', url);
    event.respondWith(fetch(url, init));
  } else {
    event.respondWith(fetch(event.request));
  }
};
