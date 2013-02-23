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

var express = require('express')
  , querystring = require('querystring')
  , request = require('request')
  , sprintf = require('sprintf').sprintf
  , partials = require('express-partials')
  , config = require('./config')
  , util = require('util')
  , url = require('url')
// The port that this express app will listen on
  , port = config.port
// Your client ID and secret from http://dev.singly.com/apps
  , clientId = config.clientId
  , clientSecret = config.clientSecret
  , hostBaseUrl = (process.env.HOST || 'http://localhost:' + port)
  , apiBaseUrl = process.env.SINGLY_API_HOST || 'https://api.singly.com'
// Create an HTTP server
  , app = express()
// Require and initialize the singly module
  , expressSingly = require('express-singly')(app, clientId, clientSecret, hostBaseUrl, hostBaseUrl + '/callback')
// Pick a secret to secure your session storage
  , sessionSecret = '5132-dfsu812341jhfa:;ad;-231'

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
app.get('/:service/:endpoint?', function(req, res) {
  var token = req.session.accessToken
    , reqUrl
    , resText = ''
    , service = req.params.service
    , endpoint = req.params.endpoint || ''

  reqUrl = {
      protocol : 'https'
    , host : 'api.singly.com'
    , pathname : '/services/' + service + (endpoint ? '/' + endpoint : '')
    , query : {access_token : token}
  }
  reqUrl = url.format(reqUrl)
  console.log('url -> ' + reqUrl)

  res.setHeader('Content-Type', 'application/json')
  if (!token) return res.end(JSON.stringify([{error:'no token'}]))
  request.get({url : reqUrl, json : true}).pipe(res)
})

app.listen(port)

console.log(sprintf('Listening at %s using API endpoint %s.', hostBaseUrl, apiBaseUrl))





