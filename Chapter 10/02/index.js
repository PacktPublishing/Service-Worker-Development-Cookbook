'use strict';

var CACHE_NAME = 'network-only';
var SOURCE_URL = 'https://cdn.rawgit.com/szaranger/szaranger.github.io/master/service-workers/03/02/events';
var networkDelayText  = document.getElementById('network-delay');
var networkDisabledCheckbox = document.getElementById('network-disabled-checkbox');
var networkStatus = document.getElementById('network-status');
var fetchButton = document.getElementById('fetch-btn');
var outlet = document.getElementById('data');
var networkDataReceived = false;
var networkFetchStartTime;

function clear() {
  outlet.textContent = '';
  networkStatus.textContent = '';
  networkDataReceived = false;
}

function disableEdit(enable) {
  fetchButton.disabled = enable;
  networkDelayText.disabled = enable;
  networkDisabledCheckbox.disabled = enable;

  if(!enable) {
    clear();
  }
}

function displayEvents(events) {

  events.forEach(function(event) {
    var tickets = event.ticket ?
      '<a href="' + event.ticket + '" class="tickets">Tickets</a>' : '';

    outlet.innerHTML = outlet.innerHTML +
      '<article>' +
      '<span class="date">' + formatDate(event.date)  + '</span>' +
      ' <span class="title">' + event.title + '</span>' +
      ' <span class="venue"> - ' + event.venue + '</span> ' +
      tickets +
      '</article>';
  });

}

function handleFetchComplete(response) {
  var shouldNetworkError = networkDisabledCheckbox.checked,
    cloned;

  if (shouldNetworkError) {
    throw new Error('Network error');
  }

  cloned = response.clone();
  caches.open(CACHE_NAME).then(function(cache) {
    cache.put(SOURCE_URL, cloned);
  });

  response.json().then(function(data) {
    displayEvents(data);
    networkDataReceived = true;
  });
}

function handleCacheFetchComplete(result) {
  result.json().then(function(data) {
    if (!networkDataReceived) {
      displayEvents(data);
    }
  });
}

fetchButton.addEventListener('click', function handleClick() {
  var now = Date.now(),
   headers = new Headers(),
   networkFetch;

  disableEdit(true);

  networkStatus.textContent = 'Fetching events...';
  networkFetchStartTime = Date.now();

  headers.append("Accept", "application/json");

  networkFetch = fetch(SOURCE_URL + '?cacheBuster=' + now, {
    mode: 'cors',
    cache: 'no-cache',
    headers: headers
  }).then(function(response) {
    var networkDelay = networkDelayText .value || 0;

    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        try {
          handleFetchComplete(response);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, networkDelay);
    });
  }).then(function() {
    networkStatus.textContent = 'Success after ' +
      getElapsedTime(networkFetchStartTime) + 'ms';
  }).catch(function(err) {
    networkStatus.textContent = err + ' after ' +
      getElapsedTime(networkFetchStartTime) + 'ms';
  });

  Promise.all([networkFetch]).then(disableEdit(false));
});

function getElapsedTime(sourceFetchStartTime) {
  var now = Date.now(),
    elapsed = now - sourceFetchStartTime;

  return elapsed;
}

function formatDate(date) {
  var d = new Date(date),
      month = (d.getMonth() + 1).toString(),
      day = d.getDate().toString(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
}
