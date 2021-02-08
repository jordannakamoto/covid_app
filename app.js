const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
const connection = require('./config/database');
const schedule = require('node-schedule');
const User = connection.models.User;

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


// setup midnight event
// const job = schedule.scheduleJob('0 0 * * *', () => {
    // var today = new Date().getDay();

    // var result = [];
    // if(today == '1'){
        // User.find({'Schedule.M': true})
            // .then((users) => {
                // testfn(users);
            // });
    // }
    // else if(today=='2'){User.find({'Schedule.T':true}).then((users)=>{testfn(users)});}
    // else if(today=='3'){User.find({'Schedule.W':true}).then((users)=>{testfn(users)});}
    // else if(today=='4'){User.find({'Schedule.Th':true}).then((users)=>{testfn(users)});}
    // else if(today=='5'){User.find({'Schedule.F':true}).then((users)=>{testfn(users)});}
    // else if(today=='6'){User.find({'Schedule.S':true}).then((users)=>{testfn(users)});}
    // else if(today=='7'){User.find({'Schedule.Su':true}).then((users)=>{
        // testfn(users)});}

    // function testfn(prom){
        // for(i = 0; i < prom.length; i++){
            // prom[i].state = "expected";
            // prom[i].save();
        // }
    // }

// }) // run everyday at midnight

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// passport authentication
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.user);
    next();
});

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
