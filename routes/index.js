const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const Alert = connection.models.Alert;
const nameList = require('../lists/namelist.js');

var express = require('express');
var router = express.Router();
var sheet = require('../lib/spreadsheet.js');

/* POST */
router.post('/login', passport.authenticate('local' , {failureRedirect: '/login', successRedirect: '/dst'}));

// register
// Create new user with uname, pw, name from request body
router.post('/register-*', function(req,res,next) {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    var newUser;
    
    
    var key = req.originalUrl;   // employee code from url
    key = key.split('-')[1];
    var name = nameList.validateRegister(key);
    
    if (name){
        User.findOne({ username: req.body.uname})
                .then((user) => {
                    
                    if (!user) {
                        newUser = createUser(req, name, hash, salt);
                        newUser.save()
                        .then((user) => {
                            console.log(user);
                        });
                        nameList.clearEntry(key);
                        res.redirect('/login');
                    }
                    else{
                        console.log("Error: User " + req.body.uname +" already exists");
                        res.header('Error', "User exists"); // this isn't handled, need to make the request through ajax
                        res.redirect('/registration-error');
                    }
                });
    }
});

/* GET */

// render register page at index
router.get('/register-*',function(req,res,next){
    var key = req.originalUrl;   // employee code from url
    key = key.split('-')[1];
    var name = nameList.validateRegister(key);
    
    console.log(name);
    if (name){
        res.render('register', {title:'Daily Screening Tool'});
    }   else{
        res.redirect('registration-error');
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
    // initial terms and conditions
   if(req.user.state == "new"){
       res.send("blah blah blah");
   }
  res.render('index', { title: 'Daily Screening Tool' });
});

// -- Client AJAX -- //

// Get username from session data
// To-Do set as protected path
router.get('/user', function(req,res){
    var info = {"name": req.user.name, "language": req.user.language}
    res.send(info);
});

// Get username from session data
// To-Do set as protected path
router.post('/changelanguage', function(req,res){
    var foo = req.user.username;
    var test = req.body["language"];
    (async function (){
        connection.collections.users.updateOne({"username":foo}, { $set: {"language": test}});
    }());
    
});

// Post alert to database
// requires name and date parameters
router.post('/newAlert', function (req,res,next){
    User.findOne({ "_id": req.user._id})
                .then((user) => {
                    var foo = new Alert({
                        msg: "Covid Signs",
                        user: user._id,
                        date: req.body.date,
                        state: "new"
                    })
                    foo.save();
                    console.log(foo);
    });
});

// Post completed form data to Google Sheets
router.post('/toGoogle', function(req, res) {
  var row = req.body
  sheet.postRow(row);
});

function createUser(req, name, hash, salt){
    user = new User({
                    username: req.body.uname,
                    name: name,
                    language: "English",
                    hash: hash,
                    state: "new", 
                    phone: "123-456-7891",
                    salt: salt,
                    isActive: true,
                    group: "unassigned",
                        Schedule: {  // store time as float
                            Mon: 0.0,
                            Tue: 0.0,
                            Wed: 0.0,
                            Thu: 0.0,
                            Fri: 0.0,
                            Sat: 0.0,
                            Sun: 0.0
                        }
                    });
     return user;
}


module.exports = router;