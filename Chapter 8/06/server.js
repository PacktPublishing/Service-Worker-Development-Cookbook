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

var subscriptions = [];
var pushInterval = 10;

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

setInterval(function() {
  subscriptions.forEach(sendNotification);
}, pushInterval * 1000);

function isSubscribed(endpoint) {
  return (subscriptions.indexOf(endpoint) >= 0);
}

function sendNotification(endpoint) {
  webPush.sendNotification(endpoint).then(function() {
    console.log('Push Application Server - Notification sent to ' + endpoint);
  }).catch(function() {
    console.log('ERROR in sending Notification, endpoint removed ' + endpoint);
    subscriptions.splice(subscriptions.indexOf(endpoint), 1);
  });
}

app.post('/register', function(req, res) {
  var endpoint = req.body.endpoint;
   if (!isSubscribed(endpoint)) {
     console.log('Subscription registered ' + endpoint);
     subscriptions.push(endpoint);
   }
   res.type('js').send('{"success":true}');
});

app.post('/unregister', function(req, res) {
  var endpoint = req.body.endpoint;
    if (isSubscribed(endpoint)) {
      console.log('Subscription unregistered ' + endpoint);
      subscriptions.splice(subscriptions.indexOf(endpoint), 1);
    }
    res.type('js').send('{"success":true}');
});

httpsServer.listen(port, function () {
  console.log('App listening on port ' + port);
});
