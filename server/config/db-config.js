var Sequelize = require('sequelize');

var config = {
  username: 'root',
  password: 'root'
};

var db = new Sequelize('Scavenger', config.username, config.password);

var User = db.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

var Game = db.define('game', {
  creatorId: Sequelize.INTEGER,
  path: Sequelize.STRING
});

var Location = db.define('location', {
  sequence: Sequelize.INTEGER,
  lat: Sequelize.DOUBLE,
  lng: Sequelize.DOUBLE
});

var LocStatus = db.define('locStatus', {
  status: Sequelize.BOOLEAN
});

User.belongsToMany(Game, {through: UserGame});
Game.belongsToMany(User, {through: UserGame});

Location.belongsToMany(User, {through: LocStatus});
User.belongsToMany(Location, {through: LocStatus});

Game.belongsTo(User, {as: creatorId});

Location.belongsTo(Game);

module.exports = db;