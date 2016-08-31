'use strict';

var cacheName = 'window-cache-v1';

var articles = document.querySelector('#articles'),
    form = document.querySelector('form'),
    newBookmark = document.querySelector('#new-bookmark');

function initializeBookmarks() {
  form.addEventListener('submit', function( event ) {
    var text = newBookmark.value;
    if (text !== '') {
      articles.innerHTML += '<li>' + text + '</li>';
      addUrlToCache(text);
      newBookmark.value = '';
      newBookmark.focus();
    }
    event.preventDefault();
  }, false);
  showBookmarks();
}

articles.addEventListener( 'click', function( event ) {
  var target = event.target;
  if ( target.tagName === 'LI' ) {
    target.parentNode.removeChild( target );
  };

  event.preventDefault();
}, false);

function showBookmarks() {
  while (articles.firstChild) {
    articles.removeChild(articles.firstChild);
  }

  window.caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      window.caches.open(cacheName).then(function(cache) {
        cache.keys().then(function(requests) {
          requests.forEach(function(request) {
            addRequestToBookmarks(cacheName, request);
          });
        });
      });
    });
  });
}

function addUrlToCache(url) {
  window.fetch(url, { mode: 'no-cors' }).then(function(response) {
    if (response.status < 400) {
      caches.open(cacheName).then(function(cache) {
        cache.put(url, response).then(showBookmarks);
      });
    }
  }).catch(function(error) {
    document.querySelector('#status').textContent = error;
  });
}

function addRequestToBookmarks(cacheName, request) {
  var url = request.url,
    span = document.createElement('span'),
    button = document.createElement('button'),
    li = document.createElement('li');

  span.textContent = url;

  button.textContent = '✔';
  button.dataset.url = url;
  button.dataset.cacheName = cacheName;
  button.classList.add('done');
  button.addEventListener('click', function() {
    removeCachedBookmark(this.dataset.cacheName, this.dataset.url).then(function() {
      var parent = this.parentNode,
        grandParent = parent.parentNode;

      grandParent.removeChild(parent);
    }.bind(this));
  });

  li.appendChild(span);
  li.appendChild(button);

  articles.appendChild(li);
}

function removeCachedBookmark(cacheName, url) {
  return window.caches.open(cacheName).then(function(cache) {
    return cache.delete(url);
  });
}

function waitUntilInstalled(registration) {
  return new Promise(function(resolve, reject) {
    if (registration.installing) {
      registration.installing.addEventListener('statechange', function(event) {
        if (event.target.state === 'installed') {
          resolve();
        } else if(event.target.state === 'redundant') {
          reject();
        }
      });
    } else {
      resolve();
    }
  });
}

if ('serviceWorker' in navigator && 'caches' in window) {
  navigator.serviceWorker.register('./service-worker.js', { scope: './' })
    .then(waitUntilInstalled)
    .then(initializeBookmarks)
    .catch(function(error) {
      document.querySelector('#bookmark-status').textContent = error;
    });
} else {
  var a = document.createElement('a');
  a.href = 'http://www.chromium.org/blink/serviceworker/service-worker-faq';
  a.textContent = 'Your browser does not support service workers and window.caches';
  document.querySelector('#status').appendChild(a);
}
