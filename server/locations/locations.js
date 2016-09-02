var Sequelize = require('sequelize');

module.exports = function(db) {
  var Location = db.define('locations', {
    sequence: Sequelize.INTEGER,
    lat: Sequelize.DOUBLE,
    lng: Sequelize.DOUBLE
  });

  return Location;
};