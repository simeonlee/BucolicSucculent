var Sequelize = require('sequelize');

module.exports = function(db) {
  var Game = db.define('games', {
    path: Sequelize.STRING
  });

  return Game;
};