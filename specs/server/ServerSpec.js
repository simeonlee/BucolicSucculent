var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server');

var db = require('../../server/config/db-config').db;
var Game = require('../../server/config/db-config').Game;
var Location = require('../../server/config/db-config').Location;
var Status = require('../../server/config/db-config').Status;
var User = require('../../server/config/db-config').User;


xdescribe ('Signup/Login for Users', function() {

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

describe('New Game Creation', function() {

  var token;
  var user;
  var pathUrl;
  var locations = {
    markers: [
      { latitude: 1.23, longitude: 2.34, sequence: 1},
      { latitude: 3.45, longitude: 4.56, sequence: 2},
      { latitude: 5.67, longitude: 6.78, sequence: 3},
      { latitude: 7.89, longitude: 8.90, sequence: 4} ]
  };

  before(function(done) {
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
  });

  after(function() {
    User.destroy({ where: { username: 'test1' } });
  });

  xdescribe('POST request /api/game/create', function() {
    it('create a new game with valid credentials', function(done) {
      request(app)
        .post('/api/game/create')
        .set('username', user)
        .set('X-ACCESS-TOKEN', token)
        .send(locations)
        .end(function(err, res) {

          expect(res.text).to.exist;
          pathUrl = res.text.substring(res.text.length-9, res.text.length-4);

          Game.findOne({ where: { path: pathUrl } })
          .then(function(gameFound) {
            expect(gameFound).to.exist;
            return Location.findAll({ include: { model: Game, where: { path: pathUrl } }});
          })
          .then(function(locationsFound) {
            expect(locationsFound).to.exist;
            expect(locationsFound.length).to.equal(4);
          })
          .then(done)
          .catch(function(err) { throw err; });
        });
    });
  });

  describe('GET request /api/game', function() {

    describe('When given both the game Path and the Username', function() {
      it('generates Statuses for each Location if initial join', function() {

      });
      it('initializes all Statuses as false', function() {

      });
      it('returns the statuses when player has joined the game', function() {

      });
      it('returns the saved statuses if game has been previously joined', function() {

      });
    });

  });
});