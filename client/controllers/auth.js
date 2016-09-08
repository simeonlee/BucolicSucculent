angular.module('app.auth', [])

.controller('AuthController', ['$window', '$http', '$scope', '$location', 'Auth', function( $window, $http, $scope, $location, Auth ) {

  $scope.login = function() {
    console.log($scope.user);
    // once we login, we have a token we need to store and use in subsequent calls
    Auth.login($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('token', token)
          //set in in http default headers for automatic inclusion
          $http.defaults.headers.common['x-access-token'] = token;
          $location.path('/createGame');
        }
      })
      .catch(function (error) {
        console.error(error);

      });
  };

  $scope.signup = function() {

    Auth.signup($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('token', token)
          console.log(token, 'thistoke');
          // set in in http default headers for automatic inclusion
          $http.defaults.headers.common['x-access-token'] = token;
          $location.path('/createGame');
        }
      })
      .catch(function (error) {
        console.error(error);
      });

  };
}]);
