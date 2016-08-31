self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.pathname === '/urlshortener/v1/url' &&
      event.request.headers.has('X-Mock-Response')) {

    var response = {
      body: {
        kind: 'urlshortener#url',
        id: 'https://goo.gl/KqR3lJ',
        longUrl: 'https://www.packtpub.com/books/info/packt/about'
      },
      init: {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
          'X-Mock-Response': 'yes'
        }
      }
    };

    var mockResponse = new Response(JSON.stringify(response.body), response.init);

    console.log('Mock Response: ', response.body);
    event.respondWith(mockResponse);
  }
});
