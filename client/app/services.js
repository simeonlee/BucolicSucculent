angular.module('app.services', [])

.factory('Requests', function($http) {
  return {
    getGameData: function(gameId) {
      var params = {
        username: '', //<----- this needs to come from auth logic?
        gameId: gameId
      }
      return $http({
        method: 'GET',
        url: '/api/game',  //<-------------- server end point
        params: params
      });
    }
  };
})
.factory('Auth', function ($http, $location, $window) {
  // Auth service is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'token'
  // after you login/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var login = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('token');
  };

  var signout = function () {
    $window.localStorage.removeItem('token');
    $location.path('/login');
  };


  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
