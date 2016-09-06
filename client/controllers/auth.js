angular.module('app.auth', [])

.controller('AuthController', function( $scope, Auth ) {
  $scope.user = {};

  $scope.login = function() {
    // once we login, we have a token we need to store and use in subsequent calls
    Auth.login($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('token', token);
        if (token) {
          $.ajaxSetup({
            headers: {
              'x-access-token': token
            }
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function() {

    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('token', token);
        // set in in ajax headers for automatic inclusion
        if (token) {
          $.ajaxSetup({
            headers: {
              'x-access-token': token
            }
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });

  };
});
