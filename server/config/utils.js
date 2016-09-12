var bcrypt = require('bcrypt-nodejs');

exports.encryptPassword = function(user, cb) {

  var SALT_WORK_FACTOR = 10;

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) { return cb(err); }

        // override the cleartext password with the hashed one
        user.password = hash;
        cb(null, user);
    });
  });
};

// compare to encrypted password
exports.comparePassword = function(pwd, user, cb) {
  bcrypt.compare(pwd, user.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};