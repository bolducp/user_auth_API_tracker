'use strict';

var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');
var User = require('../models/user');

var ref = new Firebase('https://userscrud.firebaseio.com/');

router.post('/register', function(req, res, next) {
  console.log(req.body);
  ref.createUser(req.body, function(err, userData) {
    if(err) return res.status(400).send(err);
    console.log("userData ", userData);
    var user = new User({
      uid: userData.uid,
      username: req.body.email,
      cities: []
    });
     user.save(function(err, savedUser) {
      console.log(savedUser);
      res.send(savedUser);
    });
  });
});




router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    if(err) return res.status(400).send(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      var token = user.generateToken();
      res.cookie('mytoken', token).send();
    });
  });
});

router.get('/profile', authMiddleware, function(req, res) {
  //// logged in,   req.user
  User.findById(req.user._id, function(err, user) {
    res.send(user.cities);
  });
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});


module.exports = router;
