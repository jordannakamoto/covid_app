const passport = require('passport');
const connection = require('../config/database');
const User = connection.models.User;
const Alert = connection.models.Alert;
const UserList = connection.models.UserList;
const sUtil = require('../lib/scheduleUtil.js');
const isAdmin = require('./authMiddleware').isAdmin;

var express = require('express');
var router = express.Router();
var sheet = require('../lib/spreadsheet.js');

/* check for admin */
router.use(isAdmin);

/* GET */
router.get('/', function(req, res, next) {
    res.render('admin_home', {title:'DST Dashboard'});
});

router.get('/users', function(req, res, next) {
    res.render('admin_users', {title:'DST Dashboard'});
});

router.get('/alerts', function(req, res, next) {
    res.render('admin_alerts', {title:'DST Dashboard'});
});

// Alerts API

// updates alert
router.post('/alerts/update',function(req,res){
    Alert.findOne({_id: req.body["_id"]})
        .then((found)=>{
            found.state = req.body["state"];
            found.save();
        })
});

// returns new alerts
router.get('/alerts/new', function(req,res){
    Alert.find({ "state":  "new"}).populate('user', 'name phone')
                .then((alerts) => {
                    res.send(alerts);
    });
});

// returns inprogress alerts
router.get('/alerts/inprogress', function(req,res){
    Alert.find({ "state":  "inprogress"}).populate('user', 'name phone')
                .then((alerts) => {
                    res.send(alerts);
    });
});

// returns completed alerts
router.get('/alerts/completed', function(req,res){
    Alert.find({ "state":  "completed"}).populate('user', 'name phone')
                .then((alerts) => {
                    res.send(alerts);
    });
});

// get list of today's expected Users
router.get('/users/expected', function(req,res){
    UserList.findOne({name:"expectedList"}).populate({path:"list"})
        .then((expectedList)=>{
            res.send(expectedList.list);
    });
});

// get list of users by group
router.get('/users/group/:group', function(req,res){
    var group = req.params.group;
    if(group){
        console.log(group);
        User.find({'group':group}).then((users)=> {res.send(users)});
    }
});

//get list of groups
router.get('/users/groups', function(req,res){
    User.distinct('group').then((list)=> res.send(list));
});

// search users
router.post('/users/search', async function(req,res){
    var query = req.body.query;
    var result = {"First":[],"Last":[]}
    // var result = {first: [], last: []} // arrays to hold first name matches and last name matches
    result["First"] = await User.find({'name.First': {"$regex": "^" + query, "$options": "ix"}}).select('name , _id'); // starts with query and ignore case and whitespace | then select only name and id fields
    result["Last"] = await User.find({'name.Last': {"$regex": "^" + query, "$options": "ix"}}).select('name , _id'); ; // starts with query and ignore case and whitespace | then select only name and id fields

    res.send(result);
});

// get list of today's scheduled Users (active and inactive)
router.get('/users/scheduled/:day', function(req,res){
    var key = req.params.day;
    
    if(key){
        var day;
        if(key == 'today'){
            day = new Date().getDay();
        }
        else
            day = key;
        if(day == '1'){ User.find({'Schedule.M': true}).then((users) => {res.send(users);});}     // if-else block of all Day options. query Users[] with all who are scheduled for that day of the week
        else if(day=='2'){User.find({'Schedule.T':true}).then((users)=> {res.send(users);});}
        else if(day=='3'){User.find({'Schedule.W':true}).then((users)=> {res.send(users);});}
        else if(day=='4'){User.find({'Schedule.Th':true}).then((users)=> {res.send(users);});}
        else if(day=='5'){User.find({'Schedule.F':true}).then((users)=> {res.send(users);});}
        else if(day=='6'){User.find({'Schedule.S':true}).then((users)=> {res.send(users);});}
        else if(day=='0'){User.find({'Schedule.Su':true}).then((users)=> {res.send(users);});}
    }
});

/* Application API */

// Set Expected for the day
router.get('/test/setExpected',function(req,res){
    sUtil.setExpected();
})

// Set Expected for the day
router.get('/test/setIdle',function(req,res){
    sUtil.setIdle();
})

// Add users from Google Sheet
router.get('/addFromSheet', function(req, res) {
  var row = req.body;
  sheet.createUsers();
});


module.exports = router;    