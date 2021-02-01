const passport = require('passport');
const connection = require('../config/database');
const User = connection.models.User;
// const adminList = require('../lists/adminlist.json');

var express = require('express');
var router = express.Router();
var sheet = require('../lib/spreadsheet.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

function isAdmin(user){
    
}