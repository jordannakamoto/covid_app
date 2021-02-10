const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const Alert = connection.models.Alert;
const nameList = require('../lists/namelist.js');
const isAuth = require('./authMiddleware').isAuth;
const sUtil = require('../lib/scheduleUtil.js')

var express = require('express');
var router = express.Router();
var sheet = require('../lib/spreadsheet.js');

/* POST */
router.post('/login', passport.authenticate('local' , {failureRedirect: '/login', successRedirect: '/'}));

// register
// Create new user with uname, pw, name from request body
router.post('/register-*', function(req,res,next) {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    
    var _key = req.originalUrl;   // employee code from url
    _key = _key.split('-')[1];
    
    if (_key){
        User.findOne({ key: _key})
                .then((user) => {
                    console.log(user.key);
                    console.log(_key);
                    if (!user) {
                        res.redirect('/registration-error');
                    }
                    else if(user.activity != "inactive"){
                        console.log("Error: User " + user.username +" already exists");
                        res.header('Error', "User exists"); // this isn't handled, need to make the request through ajax
                        res.redirect('/registration-error');
                    }
                    else{
                        user.username = req.body.uname;
                        user.hash = hash;
                        user.salt = salt;
                        user.state = "new";
                        user.language = "English";
                        console.log(user.name.First + " " + user.name.Last + "  successfully updated with username" + user.username);
                        user.activity = "active";
                        user.save();
                        res.redirect('/login')
                    }
                });
    }
});

/* GET */

// Get Index Rules
router.get('',function(req,res,next){
    if(req.user){
        if(req.user.state == "new"){
            res.redirect('/terms');
        }
        res.redirect('/dst');
    }
    else{
        res.redirect('/login');
    }
    
    
});

router.get('/terms',function(req,res,next){
        res.render('terms',{title:'Acknowledgement'})
});

router.get('/activate',function(req,res,next){
        User.findOne({_id:req.user._id})
            .then((user)=> {
                sUtil.setOneExpected(user._id)
                });
        
        res.redirect('/');   
});


// render register page at index
router.get('/register-*',function(req,res,next){
    var _key = req.originalUrl;   // employee code from url
    _key = _key.split('-')[1];
     
     if (_key){
        User.findOne({ key: _key})
                .then((user) => {
                    if (!user) {
                        res.redirect('/registration-error');
                    }
                    else if(user.activity != "inactive"){
                        console.log("Error: User " + user.username +" already exists");
                        res.header('Error', "User exists"); // this isn't handled, need to make the request through ajax
                        res.redirect('/registration-error');
                    }
                    else{
                        res.render('register', {title:'Daily Screening Tool'});
                    }
                });
    }
});

// registration error if wrong url is requested
router.get('/registration-error',function(req,res,next){
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<div style = "margin: auto; padding-top 20px;">Registration Error, please use the original link provided via email or contact us for help</div>'));
});

// render login page at /login
router.get('/login', function(req,res,next){
    res.render('login', {title:'Daily Screening Tool'});
});

// render /dst page for questionnaire
router.get('/dst', function(req, res, next) {
  if(req.user.state == "idle"){
      res.send("Sorry, you are not scheduled to work today")
  }
  else
    res.render('index', { title: 'Daily Screening Tool' });
});

// -- Client AJAX -- //

// Get username from session data
// To-Do set as protected path
router.get('/user', function(req,res){
    var info = {"name": req.user.name, "language": req.user.language, "state": req.user.state}
    res.send(info);
});

// Get username from session data
// To-Do set as protected path
router.post('/changelanguage', function(req,res){
    var foo = req.user.username;
    var lang = req.body["language"];
    (async function (){
        connection.collections.users.updateOne({"username":foo}, { $set: {"language": lang}});
    }());
    
});

// Get username from session data
// To-Do set as protected path
router.post('/updateState', function(req,res){
    var foo = req.user.username;
    console.log(req.body)
    var newstate = req.body["state"];
    (async function (){
        connection.collections.users.updateOne({"username":foo}, { $set: {"state": newstate}});
    }());
    
});

// Post alert to database
// requires name and date parameters
router.post('/newAlert', function (req,res,next){
    User.findOne({ "_id": req.user._id})
                .then((user) => {
                    
                    // Create Alert with reference to user
                    var foo = new Alert({
                        msg: "Covid Signs",
                        user: user._id,
                        date: req.body.date,
                        state: "new"
                    })
                    foo.save();
                    
                    // Create reference to alert in User
                    user.alerts.push(foo._id);
                    console.log(foo);
                    console.log(user);
    });
});

// Post completed form data to Google Sheets
router.post('/toGoogle', function(req, res) {
  var row = req.body
  console.log(row);
  sheet.postRow(row);
});

module.exports = router;