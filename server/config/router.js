var Game = require('./db-config').Game;
var Location = require('./db-config').Location;
var Status = require('./db-config').Status;
var User = require('./db-config').User;

module.exports = function(app, express) {

  app.get('/api/game', function (req, res) {

    res.send('Hello World! This is the game route.');
  });

  app.get('/api/game/map', function (req, res) {

    res.send('Hello World! This is the game map.');
  });

  app.post('/api/users', function(req, res) {

    var username = req.body.username.toLowerCase();
    var password = req.body.password;

    User.create({username: username, password: password})
    .then(function() {
      res.status(201).send('New user added.');
    })
    .catch(function(err) {
      res.status(409).send('Username already exists');
    });

    console.log('REQUEST', req.body);

  });
};