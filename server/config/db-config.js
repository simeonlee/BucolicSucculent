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

User.belongsToMany(Game, {through: 'usergame', foreignKey: 'userId'}); // on delete, cascade
Game.belongsToMany(User, {through: 'usergame', foreignKey: 'gameId'});

Location.belongsToMany(User, {through: 'statuses', foreignKey: 'locationId'});
User.belongsToMany(Location, {through: 'statuses', foreignKey: 'userId'}); // on delete, cascade 

Game.belongsTo(User, {foreignKey: 'creatorId', as: 'creator'});

Location.belongsTo(Game);
Game.hasMany(Location); // on delete, cascade

module.exports = {
  db: db,
  Game: Game,
  Location: Location,
  Status: Status,
  User: User
};
