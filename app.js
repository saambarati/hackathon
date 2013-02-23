// USAGE:
//
// If you have foreman (you should!) set you .env file with
// SINGLY_CLIENT_ID and SINGLY_CLIENT_SECRET and then run:
//
// $ foreman start
//
// Otherwise set SINGLY_CLIENT_ID and SINGLY_CLIENT_SECRET and run:
//
// $ node app

var express = require('express');
var querystring = require('querystring');
var request = require('request');
var sprintf = require('sprintf').sprintf;
var partials = require('express-partials');
var config = require('./config')
var util = require('util')

// The port that this express app will listen on
var port = config.port

// Your client ID and secret from http://dev.singly.com/apps
var clientId = config.clientId
var clientSecret = config.clientSecret

var hostBaseUrl = (process.env.HOST || 'http://localhost:' + port)
var apiBaseUrl = process.env.SINGLY_API_HOST || 'https://api.singly.com'

// Create an HTTP server
var app = express();

// Require and initialize the singly module
var expressSingly = require('express-singly')(app, clientId, clientSecret, hostBaseUrl, hostBaseUrl + '/callback')

// Pick a secret to secure your session storage
var sessionSecret = '5132-dfsu812341jhfa:;ad;-231'

// Setup for the express web framework
app.configure(function() {
  // Use ejs instead of jade because HTML is easy
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.logger());
  app.use(express['static'](__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: sessionSecret
  }));
  expressSingly.configuration();
  app.use(app.router);
});

expressSingly.routes();

// We want exceptions and stracktraces in development
app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.get('/', function(req, res) {
  // Render out views/index.ejs, passing in the session
  res.render('index', {
    session: req.session
  });
});

//TODO, set up oauth callback ourselves
app.get('/:service/:endpoint', function(req, res) {
  var token = req.session.accessToken
    , url = 'https://api.singly.com/services/'+ req.params.service + '/' + req.params.endpoint + '?access_token=' + token
    , resText = ''

  res.setHeader('Content-Type', 'application/json')

  if (!token) return res.end(JSON.stringify([{error:'no token'}]))

  request.get({url : url, json : true}).pipe(res)
  //request.get({url : url, json : true}, handleReq)
  //function handleReq(err, response, body) {
  //  console.log('body -> ' + body)
  //  console.log('typeof body -> ' + typeof body)

  //  if (err) return res.end('error in request to singly API')

  //  body.forEach(function (obj) {
  //    resText += '<p>' + JSON.stringify(obj) + '</p>'
  //  })

  //  res.end(resText || 'nothing returned from singly')
  //}
})

app.listen(port)

console.log(sprintf('Listening at %s using API endpoint %s.', hostBaseUrl, apiBaseUrl))





