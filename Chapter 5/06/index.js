'use strict';

var scope = {
  scope: './'
};
var endPoint = 'api/todos';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    'service-worker.js',
    scope
  ).then( function(serviceWorker) {
    printStatus('successful');
  }).catch(function(error) {
    printStatus(error);
  });
} else {
  printStatus('unavailable');
}

function printStatus(status) {
  document.querySelector('#status').innerHTML = status;
}

document.querySelector('#resetButton').addEventListener('click',
  function() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.unregister();
      window.location.reload();
    });
  }
);

if (navigator.serviceWorker.controller) {
  loadTodos();
} else {
  navigator.serviceWorker.oncontrollerchange = function() {
    this.controller.onstatechange = function() {
      if (this.state === 'activated') {
        loadTodos();
      }
    };
  };
}

document.getElementById('add-form').onsubmit = function(event) {
  var newTodo,
    todoPriority,
    todo,
    headers;

  event.preventDefault();

  newTodo = document.getElementById('new-todo').value.trim();
  if (!newTodo) { return; }

  todoPriority = document.getElementById('priority').value.trim() ||
                    'Not specified';
  todo = { text: newTodo, priority: todoPriority };
  headers = { 'content-type': 'application/json' };

  fetch(endPoint, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: headers
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(addedQuote) {
    document.getElementById('todos').appendChild(getRowFor(addedQuote));
  });
};


function loadTodos() {
  fetch(endPoint)
    .then(function(response) {
      return response.json();
    })
    .then(showTodos);
}

function showTodos(collection) {
  var table = document.getElementById('todos'),
    max = collection.length,
    customEvent = new CustomEvent('iframeresize');

  table.innerHTML = '';
  for (var i = 0, todo; i < max; i++) {
    todo = collection[i];
    table.appendChild(getRowFor(todo));
  }

  if (window.parent !== window) {
    window.parent.document.body.dispatchEvent(customEvent);
  }
}

function getRowFor(todo) {
  var tr = document.createElement('tr'),
    id = todo.id;

  tr.id = id;
  tr.appendChild(getCell(todo.text));
  tr.appendChild(getCell('(' + todo.priority + ')' ));
  tr.appendChild(todo.isSticky ? getCell('') : getCompleteButton(id));

  return tr;
}

function getCell(text) {
  var td = document.createElement('td');
  td.textContent = text;

  return td;
}

function getCompleteButton(id) {
  var td = document.createElement('td'),
    button = document.createElement('button');

  button.textContent = 'X';
  button.classList.add('complete');
  button.onclick = function() {
    completeTodo(id).then(function() {
      var tr = document.getElementById(id);
      tr.parentNode.removeChild(tr);
    });
  };

  td.appendChild(button);
  return td;
}

function completeTodo(id) {
  return fetch(endPoint + '/' + id, { method: 'DELETE' });
}
