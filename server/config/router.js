var Game = require('./db-config').Game;
var Location = require('./db-config').Location;
var Status = require('./db-config').Status;
var User = require('./db-config').User;

module.exports = function(app, express) {

  app.get('/api/game', function (req, res) {

    res.send('This is the GET for /game');

  });

  app.post('/api/game', function (req, res) {

    res.send('This is the POST for /game');

  });

  app.post('/api/game/create', function (req, res) {
    //This is when the creator makes a game and clicks create game
    var creator = 'sam';
    //somehow we create the code;
    var pathUrl = 'abcde';

    var locations = [
      {lat: 1, lng: 1},
      {lat: 2, lng: 3},
      {lat: 4, lng: 5},
      {lat: 6, lng: 7}
    ];

    User.find({
      where: {
        username: creator
      }
    }).then(function(user) {
      Game.create({
        creatorId: user.id,
        path: pathUrl,
    }).then(function(game) {
      // iterate through locations(waypoints)
    });



    res.send('Should send url(path) to game here');

  });

  app.post('/api/users/signup', function(req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;

    User.create({username: username, password: password})
    .then(function() {
      res.status(201).send('New user added.');
    })
    .catch(function(err) {
      res.status(409).send('Username already exists');
    });
  });

  app.post('/api/users/login', function(req, res) {
    // Login users

    res.send('Should pass');


  });
};