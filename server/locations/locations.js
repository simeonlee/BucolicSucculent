var Sequelize = require('sequelize');

module.exports = function(db) {
  var Location = db.define('locations', {
    sequence: Sequelize.INTEGER,
    latitude: Sequelize.DOUBLE,
    longitude: Sequelize.DOUBLE
  });

  return Location;
};