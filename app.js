const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
const connection = require('./config/database');
const schedule = require('node-schedule');
const User = connection.models.User;
const sUtil = require('./lib/scheduleUtil.js');

const MongoStore= require('connect-mongo')(session);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();
global.__basedir = __dirname;

// session setup
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: "sessions" });


//setup midnight event
const job = schedule.scheduleJob('0 0 * * *', () => {

    sUtil.setIdle();                        // set yesterday's expected list to idle
    setTimeout(function(){        // after 5 minutes, reset and repopulate expected list
        sUtil.setExpected()
    }, 1000 * 60 * 5)

})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 100
    }
}));

// //HTTPS redirect
// app.use (requireHTTPS);

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

// passport authentication
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.user);
    // console.log(req)
    // next();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
