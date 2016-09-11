var Sequelize = require('sequelize');
var settings = require('../../settings').db;

var db = new Sequelize('Scavenger', settings.username, settings.password, {
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

Game.belongsTo(User, {foreignKey: 'creatorId', as: 'creator', onDelete: 'cascade'}); // on User delete, cascade delete all games User created

Location.belongsTo(Game, { onDelete: 'cascade' }); // on Game delete, cascade delete all Locations in that game
Game.hasMany(Location); 

module.exports = {
  db: db,
  Game: Game,
  Location: Location,
  Status: Status,
  User: User
};
