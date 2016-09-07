angular.module('app.auth', [])

.controller('AuthController', function( $scope, Auth ) {

  $scope.login = function() {
    console.log($scope.user);
    // once we login, we have a token we need to store and use in subsequent calls
    Auth.login($scope.user)
      .then(function (token) {
        console.log('recieved', token);
        if (token) {
          $scope.user.token = token;
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
        if (token) {
          $scope.token = token;
          // set in in ajax headers for automatic inclusion
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
