var Sequelize = require('sequelize');

module.exports = function(db) {
  var Location = db.define('locations', {
  	location: Sequelize.STRING,
  	photo: Sequelize.STRING,
  	name: Sequelize.STRING,
  	rating: Sequelize.DOUBLE
  });

  return Location;
};