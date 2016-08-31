(function() {

  if (navigator.serviceWorker) {
    var message = document.querySelector('#message');
    var received = document.querySelector('#received');
    var status = document.querySelector('#status');
    var inbox = {};

    status.textContent = 'supported';

    navigator.serviceWorker.register('service-worker.js');

    navigator.serviceWorker.addEventListener('message', function(evt) {

      var userId = evt.data.client;
      var node;

      if (!inbox[userId]) {
        node = document.createElement('div');
        received.appendChild(node);
        inbox[userId] = node;
      }

      node = inbox[userId];
      node.textContent = 'User ' + userId + ' says: ' + evt.data.message;
    });

    message.addEventListener('input', function() {
      if (!navigator.serviceWorker.controller) {
        status.textContent = 'ERROR: no controller';
        return;
      }

      navigator.serviceWorker.controller.postMessage(message.value);
    });
  }
})();
