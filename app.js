var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

require('./config/passport');

var app = express();

// Connect to MongoDB
var db = process.env.DB || 'mongodb://localhost:27027/club';
mongoose.connect(db, { config: { autoIndex: false } });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('db connected to ' + db);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('db connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('db disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('db disconnected through app termination'); 
    process.exit(0); 
  }); 
});

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'foo',
  saveUninitialized: false, // don't create session until something stored 
  resave: false, //don't save session if unmodified 
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 1 * 24 * 60 * 60 // = 14 days. Default 
  })
}));
// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Global Vars
app.use(function (req, res, next) {
  // res.locals.success_msg = req.flash('success_msg');
  // res.locals.error_msg = req.flash('error_msg');
  // res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Fire Controllers
require('./controllers/pages')(app);
require('./controllers/admin')(app);
require('./controllers/user')(app);
require('./controllers/api')(app);


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
