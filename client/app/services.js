angular.module('app.services', ['ngGeolocation'])

.factory('Requests', function($http, $rootScope) {
  return {
    getGameData: function(path) {
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
        url: 'http://localhost:4200/api/game/create',
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
        url: 'http://localhost:4200/api/game',
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
})
.factory('GeoLoc', ['$geolocation', '$q', function($geolocation, $q) {
  return {
    setMyLocation: function() {
      return $q(function(resolve, error) {
        $geolocation.getCurrentPosition({
          timeout: 60000
        })
        .then(function(position) {
          resolve(position);
        });
      });
    }
  }
}]);
