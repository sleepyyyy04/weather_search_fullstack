var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var request=require('request');
var axios=require('axios');
var fs=require('fs');
var cors=require('cors');

var app = express();
app.use(cors())

// http://127.0.0.1:3000/auto?loc=New York
app.get('/auto',cors(), (req, res) => {
  // res.send('Hello!!!')
  var loc=req.query.loc;
  console.log(loc);
  auto_url1='https://maps.googleapis.com/maps/api/place/autocomplete/json?input=';
  auto_url2='&types=%28cities%29&key=AIzaSyAp3S2F2HGiXRNsaLzYmDZjms5j3LiLsq0';
  auto_url=auto_url1+loc+auto_url2;
  console.log(auto_url);

  //!!!replace
  axios.get(auto_url)
      .then(response => {
        console.log(response.data);
        res.send(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });

});

// http://127.0.0.1:3000/back?lat=34&lon=-118
// lat=-73.98529171943665&lon=40.75872069597532
app.get('/back', (req, res) => {
  // res.send('Hello!!!')
  var lon=req.query.lon;
  var lat=req.query.lat;
  var location_pair=lat+','+lon;
  console.log(location_pair);
  var skey='QeymnnP7sAPhyDHx4YuqzICNXQkTEPZi';
  var field_all = 'temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover'
  var all_url='https://api.tomorrow.io/v4/timelines?location='+location_pair+'&fields='+field_all+'&timesteps=1h,1d&units=imperial&timezone=America/Los_Angeles&apikey='+skey
  console.log(all_url);

  // !!!replace
  axios.get(all_url)
      .then(response => {
        // console.log(response.data);
        res.send(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  // fs.readFile('tomorro.json', 'utf-8', function (err, data) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     res.send(data);
  //     console.log('ok!');
  //   }
  // })


});

module.exports = app;


