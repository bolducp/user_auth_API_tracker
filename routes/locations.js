var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');
var request = require('request');

var User = require('../models/user');

router.use(authMiddleware);

/* GET home page. */
router.get('/', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    console.log(user.cities);
    res.render('userDashboard', {cities: user.cities});
  });
});

router.post('/', function(req, res, next) {
  // add pokemon to user
});

module.exports = router;
