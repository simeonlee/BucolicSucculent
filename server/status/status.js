module.exports = function(db) {
  var Status = db.define('Status', {
    status: Sequelize.BOOLEAN
  });

  return Status;
};