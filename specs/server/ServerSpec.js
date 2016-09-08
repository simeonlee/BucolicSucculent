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

  beforeEach(function() {
    User.destroy({where: { username: 'beth' }});
    User.destroy({where: { username: 'kani' }});
  });

  describe('POST /api/users/signup', function() {

    it('should create a new user if it does not exist', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'beth')
        .set('password', 'beth')
        .expect(201)
        .expect(function() {
          User.findOne({ where: { 'username': 'beth' } })
            .then(function(user) {
              expect(user.username).to.equal('beth');
            });
        })
        .end(done);
    });

    it('should return a token if signup was successful', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'kani')
        .set('password', 'kani')
        .expect(201)
        .expect(function(res) {
          expect(res.body.token).to.exist;
          expect(res.body.user).to.equal('kani');
        })
        .end(done);
    });

    it('should not let you create the same username', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'beth')
        .set('password', 'beth')
        .expect(201)
        .expect(function(res) {
          request(app)
          .post('/api/users/signup')
          .set('username', 'beth')
          .set('password', '1234')
          .expect(409)
        })
        .end(done);
    });
  });

  describe('POST /api/users/login', function() {

    beforeEach(function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'beth')
        .set('password', 'beth')
        .expect(201)
        .end(done)
    });

    it('should return a token if login is successful', function(done) {
      request(app)
        .post('/api/users/login')
        .set('username', 'beth')
        .set('password', 'beth')
        .expect(200)
        .expect(function(res) {
          expect(res.body.token).to.exist;
          expect(res.body.user).to.equal('beth');
        })
        .end(done);
    })

    it('should return 401 "Authentication error" if password is wrong', function(done) {
      request(app)
        .post('/api/users/login')
        .set('username', 'beth')
        .set('password', '1234')
        .expect(401)
        .expect(function(res) {
          expect(res.text).to.equal('Authentication error');
        })
        .end(done);
    })

    it('should return 401 "Authentication error" if user does not exist', function(done) {
      request(app)
        .post('/api/users/login')
        .set('username', 'kani')
        .set('password', 'kani')
        .expect(401)
        .expect(function(res) {
          expect(res.text).to.equal('Authentication error');
        })
        .end(done);
    })
  })
});