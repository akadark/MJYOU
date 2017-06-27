var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var pages = require('./routes/pages');

var app = express();

var sessionStore = new session.MemoryStore;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// mongodb connection
mongoose.connect('mongodb://localhost/local');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB @" + 'port'+ "/local");
});
mongoose.connection.on("SIGINT",function(){
  console.log('MongoDB disconnected due to Application Exit');
  process.exit(0);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(session({
    cookie: {maxAge: 60000},
    store: sessionStore,
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));

app.use(function(req, res, next){
    res.locals.currentUser = req.session.user;
    res.locals.flashMessages = req.flash();
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});


app.use('/', routes); // var routes = require('./routes/index');
app.use('/users', users);
app.use('/pages', pages);

// app.get('/about', pages.about);
// app.get('/pages', pages.index);
// app.get('/pages/create', pages.createForm);
// app.post('/pages/create', pages.createSave);
// app.get('/pages/update/:id', pages.update);
// app.post('/pages/update/:id', pages.updateSave);
// app.get('/pages/view/:id', pages.view);
// app.get('/pages/delete/:id', pages.delete);
// app.post('/pages/search', pages.search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
