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
    res.render('userDashboard', {cities: user.cities, username: user.username});
  });
});

router.post('/', function(req, res, next) {
  User.findOne({ _id: req.user._id}, function(err, user) {
    user.cities.push(req.body.newZip);
    user.save();
    console.log("req body new zip", req.body.newZip);
    console.log("user", user);
    res.render('userDashboard', {cities: user.cities, username: user.username});
  });
});


module.exports = router;
