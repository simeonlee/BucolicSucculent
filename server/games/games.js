var Sequelize = require('sequelize');

module.exports = function(db) {
  var Game = db.define('games', {
    creatorId: Sequelize.INTEGER,
    path: Sequelize.STRING
  });

  return Game;
};