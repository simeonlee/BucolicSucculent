angular.module('app.services', ['ngGeolocation'])

.factory('Requests', function($http, $rootScope) {
  return {
    getGameData: function(path) {
      console.log('in gamedats')
      var params = {
        username: $rootScope.user.username, //<----- this needs to come from auth logic?
        path: path
      }
      return $http({
        method: 'GET',
        url: 'http://localhost:4200/api/game',  //<-------------- server end point
        params: params
      });
    },
    createGame: function(user, markers) {
      var data = {
        username: user.username,
        markers: markers, //<---- array of locations
      }
      return $http({
        method: 'POST',
        url: 'http://localhost:4200api/game/create',
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
        url: 'http://localhost:4200api/game',
        data: data
      });
    }
  };
<<<<<<< 363208688b6d89007f93008239356cb00db4d459
<<<<<<< ba60a180b378b38a14499c9f79744fa8e6eb584b
})
<<<<<<< e894955b2186010ba6de90ec095e3d488ebcf781
.factory('Auth', function ($http, $location, $window) {
  // Auth service is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'token'
  // after you login/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var login = function (user) {
    console.log('factory Auth login', user );    
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
      return resp.data.token;
    });
  };

  var signup = function (user) {
    console.log('factory Auth signup');
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
      return resp.data.token;
    });
  };

  var isAuth = function () {
    console.log('isAuth');
    return !!$window.localStorage.getItem('token');
  };

  var signout = function () {
    console.log('isAuth');
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
