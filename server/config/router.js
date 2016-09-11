var helpers = require('./helpers');
var jwtauth = require('./jwt');

module.exports = function(app, express) {

  var requireAuth = function(req, res, next) {
    //jwt adds user struct to req - if not there user was not validated
    if (!req.user.username) {
      res.end('Not authorized', 401);
    } else {
      next();
    }
  };

  var detectEnvironment = function(req, res) {
    var env = app.get('env')
    var host = env === 'development' ? '127.0.0.1' : '138.68.53.22';
    var fullUrl = 'http://' + host + ':4200/#/game/' + req.pathUrl + '/map';
    res.send(fullUrl);
  };

  app.get('/api/game', jwtauth, requireAuth, helpers.joinGame); // for production with authentication
  // app.get('/api/game', helpers.joinGame);                    // bypass auth for testing with postman

  app.put('/api/game', jwtauth, requireAuth, helpers.updateStatus); // for production with authentication
  // app.put('/api/game', helpers.updateStatus);                    // bypass auth for testing with postman

  app.post('/api/game/create', jwtauth, requireAuth, helpers.createGame, detectEnvironment);  // for production with authentication
  // app.post('/api/game/create', helpers.createGame);                                        // bypass auth for testing with postman

  app.post('/api/users/signup', helpers.createUser);

  app.post('/api/users/login', helpers.loginUser);
};

