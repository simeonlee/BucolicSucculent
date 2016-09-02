var Sequelize = require('sequelize');

module.exports = function(db) {
  var Status = db.define('statuses', {
    status: Sequelize.BOOLEAN
  });

  return Status;
};