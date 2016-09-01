module.exports = function(db) {
  var User = db.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
  });

  return User;
};