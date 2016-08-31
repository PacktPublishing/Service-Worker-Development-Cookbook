'use strict';

var worker = new ServiceWorkerWare(),
  root = (function() {
    var tkns = (self.location + '').split('/');
    tkns[tkns.length - 1] = '';
    return tkns.join('/');
  })();

worker.get(root + 'api/todos', function(request, response) {
  return new Response(JSON.stringify(todos.filter(function(item) {
    return item !== null;
  })));
});

worker.delete(root + 'api/todos/:id', function(request, response) {
  var id = parseInt(request.parameters.id, 10) - 1;
  if (!todos[id].isSticky) {
    todos[id] = null;
  }
  return new Response({ status: 204 });
});

worker.post(root + 'api/todos', function(request, response) {
  return request.json().then(function(quote) {
    quote.id = todos.length + 1;
    todos.push(quote);
    return new Response(JSON.stringify(quote), { status: 201 });
  });
});

worker.init();
