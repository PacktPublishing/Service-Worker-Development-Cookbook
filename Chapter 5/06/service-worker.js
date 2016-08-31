importScripts('./vendor/ServiceWorkerWare.js');
importScripts('./worker.js');

var todos = [
  {
    text: 'Buy Milk',
    priority: 'high'
  },
  {
    text: 'Refill Car',
    priority: 'medium'
  },
  {
    text: 'Return loaned book',
    priority: 'low'
  }
].map(function(todo, index) {
  todo.id = index + 1;
  todo.isSticky = true;

  return todo;
});
