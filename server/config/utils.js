// placeholder for server utility functions
// that are not related to database
var bcrypt = require('bcrypt-nodejs');

exports.encryptPassword = function(user, cb) {

  var SALT_WORK_FACTOR = 10;

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return cb(err, user);

        // override the cleartext password with the hashed one
        user.password = hash;
        cb(err, user);
    });
  });
};

// compare to encrypted password
exports.comparePassword = function(pwd, user, cb) {
  console.log('compare Password', pwd, 'to', user.password)
  bcrypt.compare(pwd, user.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// get user from database
exports.findByUsername = function (username, cb) {
  User.findOne({ username: username }, cb);
};


