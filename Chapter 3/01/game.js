'use strict';

var attempts = 0,
images = [
  'apple',
  'google',
  'adobe',
  'facebook',
  'amazon'
];

document.getElementById('tryButton').addEventListener('click', function() {
  var imageElement = document.getElementById('logo'),
    choice = document.querySelector('#choice').value,
    attemptsEl =  document.querySelector('#attempts'),
    result = document.querySelector('#result'),
    currentIndex = imageElement.getAttribute('data-image'),
    newIndex = getRandomIndex();

  do {
    newIndex = getRandomIndex();
  } while(newIndex === currentIndex);

  imageElement.src = images[newIndex]  + '-logo.png';
  imageElement.setAttribute('data-image', newIndex);

  result.className = '';
  attempts++;

  if(newIndex == choice) {
    result.innerText = "Yay! Well done! You did it in " + attempts + " attempt(s)";
    result.classList.add('success');
    attemptsEl.innerText = attempts;
    attempts = 0;
  } else {
    result.innerText = "Boo! Try again..";
    result.classList.add('fail');
    attemptsEl.innerText = attempts;
  }

});

function getRandomIndex() {
  return Math.floor(Math.random() * 5);
}
