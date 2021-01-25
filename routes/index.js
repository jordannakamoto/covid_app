var express = require('express');
var router = express.Router();
var sheet = require('../spreadsheet.js');

/* GET home page. */
router.get('/id?', function(req, res, next) {
  res.render('index', { title: 'Daily Screening Tool' });
  console.log(req.query.name)
});

router.post('/test', function(req, res) {
  var row = req.body
  sheet.postRow(row);
  console.log(row);
});


module.exports = router;