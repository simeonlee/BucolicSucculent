var express = require('express');
var jwt = require('jwt-simple');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

//hi
app.use(bodyParser.json());
var parser = bodyParser.json();
app.use(express.static('./dist'));

// initialize tokens
app.set('jwtTokenSecret', 'teambsAThackreactor47');

var db = require('./config/db-config').db;
require('./config/router')(app, express);


app.listen(4200, function () {
  console.log('Example app listening on port 4200!');
  db.sync().then(function() {
    console.log('Synced with mySql');
  });
});

module.exports = app;
