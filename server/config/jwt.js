var url = require('url')
var User = require('./db-config').User;
var jwt = require('jwt-simple');

module.exports = function(req, res, next){
  var parsed_url = url.parse(req.url, true)

  // token is passed in the x-access-token header
  var token = req.headers["x-access-token"];

  if (token) {
    var decoded = jwt.decode(token, app.get('jwtTokenSecret'))
    if (decoded) {
      // check exirpation date
      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }
      // get user data and attach
      User.findOne({ '_id': decoded.iss }, function(err, user){
        if (!err) {         
          req.user = user;
          return next();
        }
      })
    } else {     
      // token didn't decode
      return next();
    }
  } else {
    // no token recieved
    next();
  }
}
