module.exports = function(db) {
  var Location = db.define('location', {
    sequence: Sequelize.INTEGER,
    lat: Sequelize.DOUBLE,
    lng: Sequelize.DOUBLE
  });

  return Location;
};