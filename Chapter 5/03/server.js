var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var privateKey  = fs.readFileSync('/private/etc/apache2/localhost-key.pem', 'utf8');
var certificate = fs.readFileSync('/private/etc/apache2/localhost-cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);

var sessions = {};
var port = 3011;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello service worker!');
});

app.put('/server-loads', function(req, res) {
  var loads = req.body;
  sessions[req.query.session] = loads;
  console.log('REQUEST: ' + loads);

  res.status(201).json(loads);
});

app.get('/server-loads', function(req, res) {
  var loads = sessions[req.query.session] || [25, 65, 15];
  res.json(loads);
});

httpsServer.listen(port, function () {
  console.log('App listening on port ' + port);
});
