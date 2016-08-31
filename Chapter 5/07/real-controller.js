'use strict';

document.querySelector('#alert').onclick =
  dialogs.alert.bind(dialogs, 'This is an alert');

document.querySelector('#confirm').onclick =
  dialogs.confirm.bind(dialogs, 'This is a dialog');

document.querySelector('#prompt').onclick =
  dialogs.prompt.bind(dialogs, 'This is a prompt');
