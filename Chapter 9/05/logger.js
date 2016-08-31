var Logger = {

  newSection: function newSection() {
    var separator = '----------------------------------------------------' +
      '-------------------------------------------';
    var newLine = document.createElement('div');

    newLine.innerHTML = separator;
    this.logDOM.appendChild(newLine);
    console.log(separator);
  },

  printLog: function printLog(msg, level) {
    var logMsg = document.createElement('div');

    if (msg) {
      logMsg.innerHTML = msg;
    } else {
      if (msg === null) {
        logMsg.innerHTML = 'null';
      } else if (msg === undefined) {
        logMsg.innerHTML = 'undefined';
      }
    }

    if (level) {
      switch(level) {
        case level.error:
          logMsg.setAttribute('class', 'error');
          console.error(msg);
          break;
        case level.debug:
          logMsg.setAttribute('class', 'debug');
          console.debug(msg);
          break;
        case level.info:
          logMsg.setAttribute('class', 'info');
          console.info(msg);
          break;
        case level.warn:
          logMsg.setAttribute('class', 'warning');
          console.warn(msg);
          break;
      }
    } else {
      console.log(msg);
    }

    this.logDOM.appendChild(logMsg);
    this.logDOM.scrollTop = this.logDOM.scrollHeight;
  },

  logDOM: document.getElementById('log'),

  debug: function debug(msg) {
    this.printLog(msg, { debug: true });
  },

  info: function info(msg) {
    this.printLog(msg, { info: true });
  },

  log: function log(msg) {
    this.printLog(msg);
  },

  warn: function warn(msg) {
    this.printLog(msg, { warn: true });
  },

  error: function error(msg) {
    this.printLog(msg, { error: true });
  }
};

Logger.newSection();
