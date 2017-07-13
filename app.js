const express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promise = require("bluebird");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const errorHandler = require('errorhandler');
const chalk = require('chalk')
const dotenv = require('dotenv');
const expressValidator = require('express-validator');
// const lusca = require('lusca'); // security middleware

// Models
const User = require('./models/user')

// Setup
Promise.promisifyAll(require("mongoose"));
dotenv.load({ path: '.env' });

// Create Express Server
const app = express();



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { config: { autoIndex: false }});
mongoose.Promise = Promise;

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.once('connected', () => console.log('%s db connected to ' + process.env.MONGODB_URI, chalk.green('✓')))
// If the connection throws an error
mongoose.connection.on('error', (err) => console.log('%s MongoDB connection error: ' + err, chalk.red('✗')))
// When disconnected
mongoose.connection.once('disconnected', () => console.log('db disconnected'))

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => mongoose.connection.close(() => {
    console.log('db disconnected through app termination');
    process.exit(0);
}))



// Port number
app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, // don't create session until something stored 
    resave: false, //don't save session if unmodified 
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 1 * 24 * 60 * 60 // = 14 days. Default 
    })
}))
app.use(flash());


// Passport Config
require('./config/passport')(passport); // pass passport for configuration
// Passport init
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));

// Pass 'req.user' as 'user' to ejs templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})


// Routes
app.use('/api/clubs', require('./routes/api-clubs'))
app.use('/api/events', require('./routes/api-events'))
app.use('/api/posts', require('./routes/api-posts'))
app.use('/api/users', require('./routes/api-users'))
app.use('/auth', require('./routes/auth'))
app.use('/', require('./routes/index'))


// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
    app.use(errorHandler())
}

app.listen(app.get('port'), () => {
    console.log('%s App is running on port %d in %s mode...', chalk.green('✓'), app.get('port'), app.get('env'))
});

module.exports = app;
