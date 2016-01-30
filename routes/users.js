'use strict';

var Firebase = require('firebase');
var express = require('express');
var request = require('request');

var router = express.Router();

var authMiddleware = require('../config/auth');
var User = require('../models/user');

var ref = new Firebase('https://userscrud.firebaseio.com/');

/* POST to create new user */
router.post('/register', function(req, res, next) {
  ref.createUser(req.body, function(err, userData) {
    if(err) return res.status(400).send(err);
    var user = new User({
      uid: userData.uid,
      username: req.body.email,
      cities: []
    });
     user.save(function(err, savedUser) {
      res.send(savedUser);
    });
  });
});

/* POST to log in */
router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    if(err) return res.status(400).send(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      var token = user.generateToken();
      res.cookie('mytoken', token).send();
    });
  });
});

/* POST request to reset password */
router.post('/resetPassword', function(req, res, next){
  ref.resetPassword({
    email: req.body.email
  }, function(error) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send();
    }
  });
});

/* POST request to change user password */
router.post('/changePassword', function(req, res, next){
  ref.changePassword({
    email: req.body.email,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  }, function(error) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send();
    }
  });
});

/* GET request to display user profile */
router.get('/profile', authMiddleware, function(req, res) {
  User.findById(req.user._id, function(err, user) {
    var cities = [];
    var iterator = 0;
    for (var index in user.cities){
      if (index != "_schema"){
        var zip = user.cities[index];
        request('http://api.wunderground.com/api/fcb373f2e2380e25/conditions/q/' + zip + '.json',
          function(error, response, body){
            var city = {};
            if (!error && response.statusCode == 200){
              var body = JSON.parse(body);
              city.name = body.current_observation.display_location.full;
              city.zipcode = body.current_observation.display_location.zip;
              cities.push(city);
              iterator += 1;
              if (iterator == user.cities.length){
                res.render('profile', {cities: cities, username: user.username});
              }
            }
          });
        }
      }
    });
});

/* GET request to clear cookies to log a user out */
router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});


module.exports = router;
