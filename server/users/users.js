var Sequelize = require('sequelize');

module.exports = function(db) {
  var User = db.define('users', {
    username: { type: Sequelize.STRING, unique: true },
    password: Sequelize.STRING
  });

  return User;
};
