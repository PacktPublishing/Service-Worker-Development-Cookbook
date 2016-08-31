var helloFetchHandler = function(event) {
  if (event.request.url.indexOf('/hello') > 0) {
    console.log('DEBUG: Inside the /hello handler.');
    event.respondWith(new Response('Fetch handler for /hello'));
  }
};

var helloWorldFetchHandler = function(event) {
  if (event.request.url.endsWith('/hello/world')) {
    console.log('DEBUG: Inside the /hello/world handler.');
    event.respondWith(new Response('Fetch handler for /hello/world'));
  }
};

var fetchHandlers = [helloWorldFetchHandler, helloFetchHandler];

fetchHandlers.forEach(function(fetchHandler) {
  self.addEventListener('fetch', fetchHandler);
});
