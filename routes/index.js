var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "API Tracker" });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/resetPassword', function(req, res, next) {
  res.render('resetPassword');
});

router.get('/changePassword', function(req, res, next) {
  res.render('changePassword');
});

router.get('/secret', authMiddleware, function(req, res, next) {
  res.send('Wooo!  Secret stuff!!!');
});

module.exports = router;
