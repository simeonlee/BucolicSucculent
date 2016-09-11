var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server');

var db = require('../../server/config/db-config').db;
var Game = require('../../server/config/db-config').Game;
var Location = require('../../server/config/db-config').Location;
var Status = require('../../server/config/db-config').Status;
var User = require('../../server/config/db-config').User;


describe ('Signup/Login for Users', function() {

  describe('POST request /api/users/signup', function() {

    beforeEach(function() {
      User.destroy({where: { username: 'test1' }});
      User.destroy({where: { username: 'test2' }});
    });

    after(function() {
      User.destroy({where: { username: 'test1' }});
      User.destroy({where: { username: 'test2' }});
    });

    it('should create a new user', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'test1')
        .set('password', 'test1')
        .expect(201)
        .end(function() {
          User.findOne({ where: { 'username': 'test1' } })
            .then(function(user) {
              expect(user.username).to.equal('test1');
            })
            .then(done)
            .catch(function(err) { throw err; })
        });
    });

    it('should return a token', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'test2')
        .set('password', 'test2')
        .expect(201)
        .expect(function(res) {
          expect(res.body.token).to.exist;
          expect(res.body.user).to.equal('test2');
        })
        .end(done);
    });

    it('should not let you create the duplicate username', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'test1')
        .set('password', 'test1')
        .expect(201)
        .expect()
        .end(function(res) {
          request(app)
          .post('/api/users/signup')
          .set('username', 'test1')
          .set('password', '1234')
          .expect(409)
          .end(done);
        });
    });
  });

  describe('POST /api/users/login', function() {

    before(function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'test1')
        .set('password', 'test1')
        .expect(201)
        .end(done)
    });

    after(function() {
      User.destroy({where: { username: 'test1' }});
    });

    it('should return a token', function(done) {
      request(app)
        .post('/api/users/login')
        .set('username', 'test1')
        .set('password', 'test1')
        .expect(200)
        .expect(function(res) {
          expect(res.body.token).to.exist;
          expect(res.body.user).to.equal('test1');
        })
        .end(done);
    })

    it('should return 401 if password is wrong', function(done) {
      request(app)
        .post('/api/users/login')
        .set('username', 'test1')
        .set('password', '1234')
        .expect(401)
        .expect(function(res) {
          expect(res.text).to.equal('Authentication error');
          expect(res.body.token).to.not.exist;
        })
        .end(done);
    })

    it('should return 401 if user does not exist', function(done) {
      request(app)
        .post('/api/users/login')
        .set('username', 'test2')
        .set('password', 'test2')
        .expect(401)
        .expect(function(res) {
          expect(res.text).to.equal('Authentication error');
          expect(res.body.token).to.not.exist;
        })
        .end(done);
    })
  })
});

describe('Creating and Joining Games', function() {

  var token;
  var user;
  var pathUrl;

  before(function(done) {
    User.destroy({ where: { username: 'test1' } })
    .then(function() {
      request(app)
        .post('/api/users/signup')
        .set('username', 'test1')
        .set('password', 'test1')
        .expect(201)
        .expect(function(res) {
          token = res.body.token;
          user = res.body.user;
        })
        .end(done)
    })
  });

  after(function() {
    User.destroy({ where: { username: 'test1' } });
    User.destroy({ where: { username: 'test2' } });
  });

  describe('POST request /api/game', function() {
    it('create a new game with valid credentials', function(done) {
      request(app)
        .post('/api/game')
        .set('username', user)
        .set('X-ACCESS-TOKEN', token)
        .send(locations)
        .expect(function(res) {
          pathUrl = res.text.substring(res.text.length-9, res.text.length-4);
        })
        .end(done);
    });

    it('should create a new game in the db', function(done) {
      Game.findOne({ where: { path: pathUrl } })
      .then(function(gameFound) {
        expect(gameFound).to.exist;
        done();
      });
    });

    it('should create a new location for each marker', function(done) {
      Location.findAll({
        include: {
          model: Game,
          where: { path: pathUrl }
        },
        raw: true
      }).then(function(result) {
        expect(result.length).to.equal(2);
        expect(result[0].latitude).to.equal(1.23);
        expect(result[0].longitude).to.equal(2.34);
        expect(result[0].sequence).to.equal(1);
        expect(result[1].latitude).to.equal(3.45);
        expect(result[1].longitude).to.equal(4.56);
        expect(result[1].sequence).to.equal(2);
        done();
      });
    });
  });

  describe('GET request /api/game', function() {

    describe('When given both the game Path and the Username', function() {

      before(function(done) {
        request(app)
          .get('/api/game')
          .set('username', user)
          .set('X-ACCESS-TOKEN', token)
          .query({ path: pathUrl })
          .query({ username: 'test1' })
          .end(done)
      });

      it('generates Statuses for each Location (creates relation between User/Game and User/Location)', function(done) {
        Location.findAll({
          include: [{
            model: User,
            where: { username: 'test1' }
          },{
            model: Game,
            where: { path: pathUrl }
          }]
        }).then(function(result) {
          expect(result.length).to.equal(2);
          done();
        });
      });

      it('returns the statuses (default is false) for players who joined the game', function(done) {
        request(app)
          .get('/api/game')
          .set('username', user)
          .set('X-ACCESS-TOKEN', token)
          .query({ path: pathUrl })
          .query({ username: 'test1' })
          .expect(function(res) {
            expect(res.body.locations[0].statuses.status).to.equal(false);
            expect(res.body.locations[1].statuses.status).to.equal(false);
          })
          .end(done);
      });
    });

    describe('When given the Username', function() {

      var locations2 = {
        markers: [
          { latitude: 4.56, longitude: 5.67, sequence: 1},
          { latitude: 6.78, longitude: 7.89, sequence: 2} ]
      };

      var pathUrl2;

      before(function(done) {
        // create a 2nd game
        request(app)
          .post('/api/game/create')
          .set('username', user)
          .set('X-ACCESS-TOKEN', token)
          .send(locations2)
          .expect(function(res) {
            pathUrl2 = res.text.substring(res.text.length-9, res.text.length-4);
          })
          .end(function() {
            // and have user join new game
            request(app)
              .get('/api/game')
              .set('username', user)
              .set('X-ACCESS-TOKEN', token)
              .query({ path: pathUrl2 })
              .query({ username: 'test1' })
              .end(done);
          });
      })

      it('returns all the games the User is playing', function(done) {
        request(app)
          .get('/api/game')
          .set('username', user)
          .set('X-ACCESS-TOKEN', token)
          .query({ username: 'test1' })
          .expect(function(res) {
            expect(res.body.username).to.equal('test1');
            expect(res.body.games.length).to.equal(2);
            expect(res.body.games[0].id).to.exist;
            expect(res.body.games[0].path).to.equal(pathUrl);
            expect(res.body.games[0].usergame).to.exist;
            expect(res.body.games[1].id).to.exist;
            expect(res.body.games[1].path).to.equal(pathUrl2);
            expect(res.body.games[1].usergame).to.exist;
          })
          .end(done);
      });

    });

    describe('When given the game Path', function() {

      var token2;
      var user2;

      before(function(done) {
        // create another user
        User.destroy({ where: { username: 'test2' } })
        .then(function() {
          request(app)
            .post('/api/users/signup')
            .set('username', 'test2')
            .set('password', 'test2')
            .expect(201)
            .expect(function(res) {
              token2 = res.body.token;
              user2 = res.body.user;
            })
            .end(function() {
              // have the both users join the game
              request(app)
                .get('/api/game')
                .set('username', user)
                .set('X-ACCESS-TOKEN', token)
                .query({ path: pathUrl })
                .query({ username: 'test1' })
                .end(function() {
                  request(app)
                    .get('/api/game')
                    .set('username', user2)
                    .set('X-ACCESS-TOKEN', token2)
                    .query({ path: pathUrl })
                    .query({ username: 'test2' })
                    .end(done);
                })
            })
          });
      });

      it('returns all the players in the game and their statuses', function(done) {
        request(app)
          .get('/api/game')
          .set('username', user2)
          .set('X-ACCESS-TOKEN', token2)
          .query({ path: pathUrl })
          .expect(function(res) {
            expect(res.body.length).to.equal(2);
            expect(res.body[1].username).to.equal('test2');
            expect(res.body[1].locations.length).to.equal(2);
            expect(res.body[1].locations[0].sequence).to.exist;
            expect(res.body[1].locations[0].latitude).to.equal(1.23);
            expect(res.body[1].locations[0].longitude).to.equal(2.34);
            expect(res.body[1].locations[0].statuses.status).to.exist;
            expect(res.body[1].locations[1].sequence).to.exist;
            expect(res.body[1].locations[1].latitude).to.equal(3.45);
            expect(res.body[1].locations[1].longitude).to.equal(4.56);
            expect(res.body[1].locations[1].statuses.status).to.exist;
          })
          .end(done);
      });
    });
  });
});

describe('Interacting with Game', function() {

  var token;
  var user;
  var pathUrl;
  var locationId;

  var locations = {
    markers: [
      { latitude: 9.87, longitude: 8.76, sequence: 1},
      { latitude: 7.65, longitude: 6.54, sequence: 2} ]
  };

  before(function(done) {
    User.destroy({ where: { username: 'test3' } })
    .then(function() {
      request(app)
        .post('/api/users/signup')
        .set('username', 'test3')
        .set('password', 'test3')
        .expect(201)
        .expect(function(res) {
          token = res.body.token;
          user = res.body.user;
        })
        .end(function(){
          request(app)
            .post('/api/game/create')
            .set('username', user)
            .set('X-ACCESS-TOKEN', token)
            .send(locations)
            .expect(function(res){
              pathUrl = res.text.substring(res.text.length-9, res.text.length-4);
            })
            .end(done);
        });
    })
  });

  after(function() {
    User.destroy({ where: { username: 'test3' } });
  });

  describe('PUT request /api/game', function() {

    before(function(done) {
      request(app)
        .get('/api/game')
        .set('username', user)
        .set('X-ACCESS-TOKEN', token)
        .query({ path: pathUrl })
        .query({ username: 'test3' })
        .expect(function(res) {
          locationId = res.body.locations[1].id;
        })
        .end(function() {
          request(app)
            .put('/api/game')
            .set('username', user)
            .set('X-ACCESS-TOKEN', token)
            .send({ locationId: locationId })
            .end(done)
        });
    });

    it('should update the status of the location', function(done) {
      request(app)
        .get('/api/game')
        .set('username', user)
        .set('X-ACCESS-TOKEN', token)
        .query({ path: pathUrl })
        .query({ username: 'test3' })
        .expect(function(res) {
          expect(res.body.locations[0].statuses.status).to.equal(false);
          expect(res.body.locations[1].statuses.status).to.equal(true);
        })
        .end(done);
    });

  });
});