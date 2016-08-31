var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var webPush = require('web-push');

var privateKey  = fs.readFileSync('/private/etc/apache2/localhost-key.pem', 'utf8');
var certificate = fs.readFileSync('/private/etc/apache2/localhost-cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);
var port = 3012;

webPush.setGCMAPIKey('AIzaSyCC3YXfz4w2j3-HcXvwBQ0B_JddR95d3wo'/*process.env.GCM_API_KEY*/);

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

app.post('/register', function(req, res) {
  res.sendStatus(201);
});

app.post('/sendNotification', function(req, res) {
  setTimeout(function() {
    webPush.sendNotification(req.query.endpoint, {
      TTL: req.query.ttl,
    })
    .then(function() {
      res.sendStatus(201);
    });
  }, req.query.delay * 1000);
});

httpsServer.listen(port, function () {
  console.log('App listening on port ' + port);
});
