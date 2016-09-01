var Sequelize = require('sequelize');

var config = {
  username: 'root',
  password: 'root'
};

var db = new Sequelize('Scavenger', config.username, config.password);

var User = require('../games/games')(db);
var Locations = require('../locations/locations')(db);
var Status = require('../status/status')(db);
var User = require('../users/users')(db);

User.belongsToMany(Game, {through: UserGame});
Game.belongsToMany(User, {through: UserGame});

Location.belongsToMany(User, {through: Status});
User.belongsToMany(Location, {through: Status});

Game.belongsTo(User, {as: creatorId});

Location.belongsTo(Game);

module.exports = db;