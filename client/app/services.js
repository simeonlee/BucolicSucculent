angular.module('app.services', ['ngGeolocation'])

.factory('Requests', function($http, $window) {
  return {
    getGameData: function(path) {
      var params = {
        username: $window.localStorage.getItem('user'), 
        path: path
      }
      return $http({
        method: 'GET',
        url: '/api/game',  
        params: params
      });
    },
    createGame: function(user, markers) {
      var data = {
        username: user,
        markers: markers, 
      }
      return $http({
        method: 'POST',
        url: '/api/game/create',
        data: data
      });
    },
    updateLocStatus: function(user, loc) {
      var data = {
        username: user,
        locationId: loc
      };
      return $http({
        method: 'PUT',
        url: '/api/game',
        data: data
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
      headers: {
        "Content-Type": 'application/json; charset=utf-8',
        "username": user.username,
        "password": user.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('user', resp.data.user);
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      headers: {
        "Content-Type": 'application/json; charset=utf-8',
        "username": user.username,
        "password": user.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('user', resp.data.user);
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
