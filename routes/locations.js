var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');
var request = require('request');
var User = require('../models/user');
var moment = require('moment');

router.use(authMiddleware);

/* GET user dashboard page. */
router.get('/', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    var cities = [];
    var iterator = 0;

    if (user.cities.length === 0){
      res.render('newUser', {username: user.username});
    }

    for (var index in user.cities){
      if (index != "_schema"){
        var zip = user.cities[index];

        request('http://api.wunderground.com/api/fcb373f2e2380e25/conditions/q/' + zip + '.json',
          function(error, response, body){
            var city = {};

            if (!error && response.statusCode == 200){
              var body = JSON.parse(body);
              city.name = body.current_observation.display_location.full;
              city.temperature = body.current_observation.temperature_string;
              city.time = body.current_observation.observation_time;
              city.weather = body.current_observation.weather;
              cities.push(city);
              iterator += 1;

              if (iterator == user.cities.length){
                res.render('userDashboard', {cities: cities, username: user.username});
              }
            }
          });
        }
      }
    });
  });

/* POST to add new zipcode to track */
router.post('/', function(req, res, next) {
  User.findOne({ _id: req.user._id}, function(err, user) {
    user.cities.push(req.body.newZip);
    user.save();
    res.render('userDashboard', {cities: user.cities, username: user.username});
  });
});


router.delete('/', function(req, res, next) {
  User.findOne({ _id: req.user._id}, function(err, user) {
    console.log("req.body.deleteZip ",req.body.deleteZip);
    var index = user.cities.indexOf(req.body.deleteZip);
    if (index > -1){
      user.cities.splice(index, 1);
    }
    user.save();
    res.render('userDashboard', {cities: user.cities, username: user.username});
  });
});





module.exports = router;
