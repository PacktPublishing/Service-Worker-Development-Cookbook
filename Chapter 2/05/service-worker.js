var cookFetchHandler = function(event) {
  console.log('DEBUG: Inside the /cook handler.');
  if (event.request.url.indexOf('/cook/') > 0) {
    event.respondWith(new Response('Fetch handler for /cook'));
  }
};

var cookBookFetchHandler = function(event) {
  console.log('DEBUG: Inside the /cook/book handler.');
  if (event.request.url.endsWith('/cook/book')) {
    event.respondWith(new Response('Fetch handler for /cook/book'));
  }
};

var fetchHandlers = [cookBookFetchHandler, cookFetchHandler];

fetchHandlers.forEach(function(fetchHandler) {
  self.addEventListener('fetch', fetchHandler);
});
