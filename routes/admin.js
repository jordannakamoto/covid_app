const passport = require('passport');
const connection = require('../config/database');
const User = connection.models.User;
const Alert = connection.models.Alert;

var express = require('express');
var router = express.Router();
var sheet = require('../lib/spreadsheet.js');

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


// returns new alerts
router.get('/alerts/new', function(req,res){
    Alert.find({ "state":  "new"}).populate('user', 'name phone')
                .then((alerts) => {
                    console.log(alerts);
                    res.send(alerts);
    });
});

// returns new alerts
router.get('/alerts/inprogress', function(req,res){
    Alert.find({ "state":  "inprogress"})
                .then((alerts) => {
                    res.send(alerts);
    });
});

// returns new alerts
router.get('/alerts/completed', function(req,res){
    Alert.find({ "state":  "completed"})
                .then((alerts) => {
                    res.send(alerts);
    });
});

module.exports = router;

function isAdmin(user){
    
}