// placeholder for server utility functions
// that are not related to database
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var jwt = require('jwt-simple');

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

exports.createToken = function (user, secret, cb) {
  // has successfully authenticated, send a token
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode(
    {
      iss: user.dataValues.id,
      exp: expires
    }, 
    secret
  );
  //    expires : expires,
  //    user : user.toJSON()        
  cb ({
    token : token,
    user: user.dataValues.username
  });
};


