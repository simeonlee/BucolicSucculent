var Game = require('./db-config').Game;
var Location = require('./db-config').Location;
var Status = require('./db-config').Status;
var User = require('./db-config').User;
var Utils = require('./utils');
var express = require('express');
var jwtauth = require('./jwt');
var md5 = require('md5');
var jwt = require('jwt-simple');

module.exports = function(app, express) {

  var requireAuth = function(req, res, next) {
    //jwt adds user struct to req - if not there user was not validated
    if (!req.user.username) {
      res.end('Not authorized', 401);
    } else {
      next();
    }
  }

  app.get('/api/game', jwtauth, requireAuth, function(req, res) {   // for production with authentication
  // app.get('/api/game', function(req, res) {                      // bypass auth for testing with postman

    // do a query for pathUrl and username
    // return the game info for username

    if (req.query.path && req.query.username) {
      //Looks in usergame table to see if player is in game
      Game.findOne({
        where: { path: req.query.path },
        include: {
          model: User,
          where: { username: req.query.username },
        }
      }).then(function (gameFound) {
        if (!gameFound) {
          //if the user is new to game, have player join the game and generate statuses
          generateStatuses(req, res);
        } else {
          // if user already started the game, return their saved statuses
          returnStatuses(req, res, gameFound);
        }
      });
    } else {
      // if query only includes the username
      if (req.query.username) {
        // return all the games and game info associated to that user
        returnGamesforUser(req, res);
      } else {
        if (req.query.path) {
          // if query only includes the path, return game info on all other users in the game
          returnOtherPlayers(req, res);
        } else {
          // if path or username is not provided, it is an invalid query
          res.status(400).send('Invalid query');
        }
      }
    }
  });

  app.put('/api/game', jwtauth, requireAuth, function (req, res) {  // for production with authentication
    User.findOne({ where: { username: req.user.username } })        // for production with authentication
  // app.put('/api/game', function (req, res) {                     // bypass auth for testing with postman
    // User.findOne({ where: { username: req.body.username } })     // bypass auth for testing with postman
    .then(function (currentUser) {
      Status.findOne({
        where: {
          userId: currentUser.id,
          locationId: req.body.locationId
        }
      })
      .then(function(currentStatus) {
        currentStatus.update({ status: true })
        .then(function(result) {
          res.send(result);
        });
      });
    })
  });

  app.post('/api/game/create', jwtauth, requireAuth, function (req, res) {  // for production with authentication
  // app.post('/api/game/create', function (req, res) {                     // bypass auth for testing with postman

    // Example Data Structure
    // { 'username': 'beth',
    //   'markers': [
    //     { latitude: 1.23, longitude: 2.34, sequence: 1},
    //     { latitude: 3.45, longitude: 4.56, sequence: 2},
    //     { latitude: 5.67, longitude: 6.78, sequence: 3},
    //     { latitude: 7.89, longitude: 8.90, sequence: 4} ]
    // };

    var creator = req.user.username;                                        // for production with authentication
    // var creator = req.body.username;                                     // bypass auth for testing with postman

    // generate pathUrl Hash
    var pathUrl = md5(JSON.stringify(req.body)).slice(0,5)

    var locations = req.body.markers;

    User.findOne({ where: { username: creator } })
    // Find the creator in the User table
    .then(function(currentUser) {
      // then create a Game and its locations
      Game.create({
        path: pathUrl,
        locations: locations
      }, { include: [Location] })
      .then(function(game) {
        // then set the creatorId foreign key for the Game
        game.setCreator(currentUser)
        .then(function(){
          // when finished, send back the pathUrl
          res.send(pathUrl);
        })
      });
    });

  });

  app.post('/api/users/signup', function(req, res) {

    if (req.headers.username && req.headers.password) {   
       var user = {
        username : req.headers.username.toLowerCase(),
        password : req.headers.password
      };
      
      // create it
      Utils.encryptPassword(user, function(err, user) {
         User.create(user)
        .then(function(user, created) {
          // create token and return
          var secret = 'teambsAThackreactor47';
          Utils.createToken(user, secret, function(token) {
            if ( token.token ) {
              res.status(201).send(token);
            } else {
              res.status(401).send('Token error');
            }
          });  
        })
        .catch(function(err) {
          res.status(409).send('Username already exists or other err: '+ err);
        });
      });
    } else {
      // missing username or password
      res.status(401).send('missing username or password');
    }
  }); // end of signup

  app.post('/api/users/login', function(req, res) {
    if (req.headers.username && req.headers.password) {      
      // Fetch the appropriate user, if they exist

      User.findOne({where: { username: req.headers.username }})
      .then(function(user) {
        if(user) {
          Utils.comparePassword(req.headers.password, user, function(err, isMatch) {
            if (err) {            
              // bad password
              res.status(401).send('Authentication error');
            } else if (isMatch) {  
              // has successfully authenticated, send a token
              var secret = 'teambsAThackreactor47';
              Utils.createToken(user, secret, function(token) {
                if ( token.token ) {
                  res.status(200).send(token);
                } else {
                  res.status(401).send('Token error');
                }
              });   
            } else {            
              res.status(401).send('Authentication error');
            }
          }); // comparePassword
        }
        else { // User does not exist in db.
          res.status(401).send('Authentication error');
        }
      }) // .then findOne
      .error(function(err) {   
        res.status(401).send('Authentication error');
      }); // .error findOne
    } else {
      res.status(401).send('Authentication error');
    }
  });
};

var generateStatuses = function(req, res) {
  // Find the current User in the User Table...
  User.findOne({ where: { username: req.query.username } })
  .then(function(currentUser) {
    // Then find the current Game in the Game Table via the given Path
    Game.findOne({ where: { path: req.query.path } })
    .then(function(currentGame){
      // If a game at the path exists...
      if (currentGame) {
        // Add the current User to the current Game
        currentUser.addGame(currentGame);

        // Then find all the locations associated to the current Game...
        Location.findAll({
          include: {
            model: Game,
            where: { path: req.query.path },
          }
        }).then(function(allLocs) {
          // And initialize the status of each location for the User
          currentUser.addLocations(allLocs, { status: false })
          .then(function() {
            // When complete, return Statuses to client.
            returnStatuses(req, res, currentGame);
          });
        });
      } else {
        // return an 422 error.
        res.status(422).send('Game at URL path does not exist.')
      }
    });
  });
};

var returnStatuses = function(req, res, gameFound) {
  // Find the current User in the User Table
  // With it's associated game and location statuses
  User.findOne({
    attributes: [],
    where: { username: req.query.username },
    include: {
      model: Location,
      attributes: ['id', 'sequence', 'latitude', 'longitude'],
      where: { gameId: gameFound.id },
      through: { attributes: ['status']}
    }
  }).then(function(result) {
    res.send(result);
  });
};

/****** Example data for returnStatuses *****/
// {
//   "locations": [
//     {
//       "id": 117,
//       "sequence": 1,
//       "latitude": 1.243,
//       "longitude": 2.334,
//       "statuses": {
//         "status": false,
//       }
//     },
//     {
//       "id": 118,
//       "sequence": 2,
//       "latitude": 3.345,
//       "longitude": 4.564,
//       "gameId": 29,
//       "statuses": {
//         "status": true,
//       }
//     }
//   ]
// }

var returnGamesforUser = function(req, res) {
  // Find the current User in the User Table
  // and return all the games associated to the user.
  User.findOne({
    attributes: ['username'],
    where: { username: req.query.username },
    include: {
      model: Game,
      through: {attributes: []},
      attributes: ['id', 'path']
    }
  }).then(function(allGames) {
    res.send(allGames);
  });
}

/****** Example data for returnGamesforUser *****/
// {
//   "username": "beth",
//   "games": [
//     {
//       "id": 14,
//       "path": "9ef63"
//     },
//     {
//       "id": 15,
//       "path": "3ece8"
//     }
//   ]
// }

var returnOtherPlayers = function(req, res) {
  // Find all the users/players in the game specified by the path
  // and return each of their locations and statuses.
  User.findAll({
    attributes: ['username'],
    include: {
      model: Location,
      attributes: ['sequence', 'latitude', 'longitude'],
      through: { attributes: ['status'] },
      include: {
        model: Game,
        attributes: [],
        where: { path: req.query.path }
      }
    },
    order: [['username', 'ASC'], [Location, 'sequence', 'ASC']],
  }).then(function(allPlayers) {
    res.send(allPlayers);
  });
};

/****** Example data for returnOtherPlayers *****/
// [
//   {
//     "username": "beth",
//     "locations": [
//       {
//         "sequence": 1,
//         "latitude": 37.78631777032694,
//         "longitude": -122.42096275091171,
//         "statuses": {
//           "status": true
//         }
//       },
//       {
//         "sequence": 2,
//         "latitude": 37.778991539440696,
//         "longitude": -122.44156211614609,
//         "statuses": {
//           "status": false
//         }
//       }
//     ]
//   },
//   {
//     "username": "derek",
//     "locations": [
//       {
//         "sequence": 1,
//         "latitude": 37.78631777032694,
//         "longitude": -122.42096275091171,
//         "statuses": {
//           "status": false
//         }
//       },
//       {
//         "sequence": 2,
//         "latitude": 37.778991539440696,
//         "longitude": -122.44156211614609,
//         "statuses": {
//           "status": true
//         }
//       }
//     ]
//   }
// ]