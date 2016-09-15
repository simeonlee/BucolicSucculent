var Sequelize = require('sequelize');

module.exports = function(db) {
  var Game = db.define('games', {
    path: Sequelize.STRING,
    public: Sequelize.BOOLEAN
  });

  return Game;
};