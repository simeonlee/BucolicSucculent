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
    // User.destroy({
    //   where: {
    //     username: 'beth'
    //   }
    // });
  });

  describe('POST /api/users/signup', function() {
    it('should create a user', function(done) {
      request(app)
        .post('/api/users/signup')
        .set('username', 'beth')
        .set('password', 'beth')
        .expect(function() {
          User.findOne({ where: { 'username': 'beth' } })
            .then(function(user) {
              expect(user.username).to.equal('beth');
            });
        })
        .end(done);
    });
  });

  // describe('POST /api/users/login', function() {
  //   it('should login a user', function(done) {

  //   })
  // })

});