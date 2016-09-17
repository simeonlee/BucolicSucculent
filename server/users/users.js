var Sequelize = require('sequelize');

module.exports = function(db) {
  var User = db.define('users', {
    username: { type: Sequelize.STRING, unique: true },
    password: Sequelize.STRING,
    facbookid: Sequelize.STRING, 
    facebookavatar: Sequelize.STRING,
    facebookemail: Sequelize.STRING,
    facebookname: Sequelize.STRING
  });

  return User;
};
