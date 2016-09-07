var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server');

var db = require('../../sevrver/config/db-config').db;
var Game = require('../../sevrver/config/db-config').Game;
var Location = require('../../sevrver/config/db-config').Location;
var Status = require('../../sevrver/config/db-config').Status;
var User = require('../../sevrver/config/db-config').User;