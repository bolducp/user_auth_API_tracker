var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');
var request = require('request');
var User = require('../models/user');
var moment = require('moment');

router.use(authMiddleware);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   User.findById(req.user._id, function(err, user) {
//     console.log(user.cities);
//     res.render('userDashboard', {cities: user.cities, username: user.username});
//   });
// });


router.get('/', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    var cities = [];
    var iterator = 0;

    for (var index in user.cities){
      if (index != "_schema"){
        var zip = user.cities[index];
        console.log("ZIP", zip);

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
            console.log("CITITES", cities);
            console.log(user.cities);

            if (iterator == user.cities.length){
              console.log("CITITES", cities);
              console.log(user.cities);
              res.render('userDashboard', {cities: cities, username: user.username});
            }
          }
        });
      }
    }
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
