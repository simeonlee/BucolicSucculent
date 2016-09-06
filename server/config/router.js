var Game = require('./db-config').Game;
var Location = require('./db-config').Location;
var Status = require('./db-config').Status;
var User = require('./db-config').User;
var Utils = require('./utils');
var express = require('express');
var jwtauth = require('./jwt');

module.exports = function(app, express) {

  var requireAuth = function(req, res, next) {
    if (!req.user) {
      res.end('Not authorized', 401);
    } else {
      next();
    }
  }

  app.get('/api/game', jwtauth, requireAuth, function(req, res) {

    // console.log(req.query);
    if (req.query.username) {
      if (req.query.gameId) {
        // do a query for gameId and username
        // return game info for username

        //Looks in usergame table to see if player is in game
        Game.findOne({
          where: {id: req.query.gameId},
          include: [{
            model: User,
            where: { username: req.query.username },
          }]
        }).then(function (gameFound) {
          //if the user was not in the game, have player join the game
          if (!gameFound) {
            // function (User, req.query.username) 
            User.findOne({
              where: { username: req.query.username }
            })
            .then( function (currentUser) {
              Game.findOne({
                where: { id: req.query.gameId }
              })
              .then(function (currentGame) {
                if (currentGame) {
                  //Adds to the usergame relation table
                  currentUser.addGame(currentGame);
                  console.log('Joined the game');

                  // Find all locations of the Game
                  Location.findAll({
                    include: [{
                      model: Game,
                      where: {id: req.query.gameId}
                    }]
                  })
                  .then( function (allLoc) {
                    //force async of creation of locations for user
                    var asyncCounter = 0;
                    //For each location of each game, create a status row linked to both and set default status to false
                    allLoc.forEach(function (eachLoc) {
                      currentUser.addLocation(eachLoc)
                      .then( function (elem) {
                        Status.update({ status: false },
                        { where: {
                          locationId: elem[0][0].dataValues.locationId,
                          userId: elem[0][0].dataValues.userId,
                        }});
                        asyncCounter++;
                        if (asyncCounter === allLoc.length) {
                          User.findAll({
                            attributes: ['id'],
                            where: {
                              username: req.query.username
                            },
                            include: [{
                              model: Location,
                              where: {
                                gameId: req.query.gameId
                              }
                            }]
                          }).then(function(result) {
                            res.send(result);
                          });
                        }
                      });
                    });
                  });
                }
              });
            });
            // if (!gameFound)
          } else {
            User.findAll({
              attributes: ['id'],
              where: {
                username: req.query.username
              },
              include: [{
                model: Location,
                where: {
                  gameId: req.query.gameId
                }
              }]
            }).then(function(result) {
              res.send(result);
            });
          }

        });
      } else {  
        Game.findAll({
          include: [{
            model: User,
            where: { username: req.query.username },
          }],
          raw: true
        }).then(function(allGames) {
          res.send(allGames);
        });

      }
    }
  });

  app.put('/api/game', jwtauth, requireAuth, function (req, res) {
    Status.findOne({
      where: {
        userId: req.body.userId,
        locationId: req.body.locationId,
      }
    }).then(function(currentStatus) {
      currentStatus.update({
        status: req.body.status
      }).then(function(result) {
        res.send(result);
      });
    });
    // res.send('This is the POST for /game');

  });

  app.post('/api/game/create', jwtauth, requireAuth, function (req, res) {
    //This is when the creator makes a game and clicks create game
    var creator = 'beth';
    //somehow we create the code;

    // increment pathUrl
    var pathUrl = 'lol';
    // hash it?

    var locations = [
      {latitude: 2, longitude: 4, sequence: 1},
      {latitude: 2, longitude: 6, sequence: 2},
      {latitude: 4, longitude: 5, sequence: 3},
      {latitude: 6, longitude: 7, sequence: 4}
    ];

    User.findOne({
      where: {
        username: creator
      }
    })
    .then(function(currentUser) {
      Game.create({
        creatorId: currentUser.dataValues.id,
        path: pathUrl,
        // Locations: [
        //   {lat: 1.0, lng: 1.0, sequence: 1},
        // ]
      }
      // , { include: [Location] } 

      )
      .then(function(currentGame) {
        // currentUser.addGame(currentGame);
        locations.forEach(function (elem) {
          Location.create(elem)
          .then(function(loc) {
            loc.setGame(currentGame);
          });
        });
        // Location.bulkCreate(locations)
        // .then(function (arrLocations) {
        //   console.log(arrLocations);
        //   arrLocations.forEach(function (eachLoc) {
        //     console.log(eachLoc);
        //     eachLoc.setGame(currentGame);
        //   });
        // });
      // iterate through locations(waypoints)
      // for(var i = 0; i < locations.length; i++) {
      //   Location.create({

      //   })
      // }
      });
    });


    // {
    //   map: {
    //     center: {
    //       latitude: 37.7836881, //<------- dummy data
    //       longitude: -122.40904010000001
    //     },
    //     zoom: 13,
    //     markers: [{
    //       "id": 1,
    //       "coords": {
    //         "latitude": 37.76922210201123,
    //         "longitude": -122.46047973632812
    //       },
    //       "options": {
    //         "label": "Golden Gate Bridge",
    //         "visible": true
    //       }
    //     }, {
    //       "id": 2,
    //       "coords": {
    //         "latitude": 37.76392978442336,
    //         "longitude": -122.43318557739258
    //       },
    //       "options": {
    //         "label": "2",
    //         "visible": true
    //       }
    //     }, {
    //       "id": 3,
    //       "coords": {
    //         "latitude": 37.7897092979573,
    //         "longitude": -122.40589141845703
    //       },
    //       "options": {
    //         "label": "3",
    //         "visible": true
    //       }
    //     }]
    //   },
    //   players: [{

    //   }]
    // }


    res.send('Should send url(path) to game here');

  });

  app.post('/api/users/signup', function(req, res) {
  //Must be application/json content type;

    var username = req.body.username.toLowerCase();
    var password = req.body.password;

    User.create({username: username, password: password})
    .then(function() {
      // create token and return
      
      res.status(201).send('New user added.');
    })
    .catch(function(err) {
      res.status(409).send('Username already exists');
    });
  });

  app.post('/api/users/login', function(req, res) {

    if (req.headers.username && req.headers.password) {   
      
      // Fetch the appropriate user, if they exist
      User.findOne({ username: req.headers.username }, function(err, user) {
        if (err) {    
          res.send('Authentication error', 401)
        }

        Utils.comparePassword(req.headers.password, user, function(err, isMatch) {
          if (err) {            
            // bad password
            res.send('Authentication error', 401)
          }
          if (isMatch) {  
            // has successfully authenticated, send a token
            var expires = moment().add('days', 7).valueOf()       
            var token = jwt.encode(
              {
                iss: user.id,
                exp: expires
              }, 
              app.get('jwtTokenSecret')
            );            
            res.json({
              token : token,
              expires : expires,
              user : user.toJSON()
            });
          } else {            
            res.send('Authentication error', 401)
          }
        });
      }); // end findOne callback
    } else {
      // missing username or password
      res.send('Authentication error', 401)
    }

  })
};
