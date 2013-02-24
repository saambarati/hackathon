var express = require('express')
  , config = require('./config')
  , port = config.port
  , app
  , sessionSecret = '5132-dfsu812341jhfa:;ad;-231'
  , server

app = express()
app.configure(function() {
  // Use ejs instead of jade because HTML is easy
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express['static'](__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: sessionSecret
  }));
  app.use(app.router);
});

server = app.listen(port)
require('./sockets').initialize(server)
require('./post').initialize(app)

app.get('/', function(req, res) {
  console.log('get /')
  res.render('home')
})

