var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server');

var db = require('../../server/config/db-config').db;
var Game = require('../../server/config/db-config').Game;
var Location = require('../../server/config/db-config').Location;
var Status = require('../../server/config/db-config').Status;
var User = require('../../server/config/db-config').User;

describe ('', function() {

  beforeEach(function() {
    User.destroy({
      where: {
        username: 'derek'
      }
    });
  });

  describe('POST /api/users/signup', function() {
    it('should create a user', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'derek')
        .set('password', 'derek')
        .expect(function() {
          User.findOne({ where: { 'username': 'derek' } })
            .then(function(user) {
              expect(user.username).to.equal('derek');
            });
        })
        .end(done);
    })

  //   it('Successful signup logs in a new user', function(done) {
  //     request(app)
  //       .post('/api/users/signup')
  //       .set('username', 'beth')
  //       .set('password', 'beth')
  //       .expect(function(res) {
  //         expect(res.headers.location).to.equal('/#/createGame');
  //       })
  //       .end(done);
  //   })
  })

  // describe('POST /api/users/login', function() {
  //   it('should login a user', function(done) {

  //   })
  // })
});