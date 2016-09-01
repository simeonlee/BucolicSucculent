module.exports = function(db) {
  var Game = db.define('game', {
    creatorId: Sequelize.INTEGER,
    path: Sequelize.STRING
  });

  return Game;
};