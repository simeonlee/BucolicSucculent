var Sequelize = require('sequelize');

var config = {
  username: 'root',
  password: 'root'
};

var db = new Sequelize('Scavenger', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
});

var Game = require('../games/games')(db);
var Location = require('../locations/locations')(db);
var Status = require('../status/status')(db);
var User = require('../users/users')(db);

User.belongsToMany(Game, {through: 'usergame', foreignKey: 'userId'});
Game.belongsToMany(User, {through: 'usergame', foreignKey: 'gameId'});

Location.belongsToMany(User, {through: 'statuses', foreignKey: 'locationId'});
User.belongsToMany(Location, {through: 'statuses', foreignKey: 'userId'});

// Might not like the double-relationship
// Game.belongsTo(User, {as: 'creatorId'});

Location.belongsTo(Game);
Game.hasMany(Location); // needed?

module.exports = {
  db: db,
  Game: Game,
  Location: Location,
  Status: Status,
  User: User
};