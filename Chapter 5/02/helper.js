function getZipFileReader(data) {
  return new Promise(function(fulfill, reject) {
    var arrayBufferReader = new zip.ArrayBufferReader(data);
    zip.createReader(arrayBufferReader, fulfill, reject);
  });
}

function getFileLocation(filename) {
  return location.href.replace(/service-worker\.js$/, filename || '');
}

function getContentType(filename) {
  var tokens = filename.split('.');
  var extension = tokens[tokens.length - 1];
  return contentTypes[extension] || 'text/plain';
}
