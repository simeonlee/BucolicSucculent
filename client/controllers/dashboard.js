angular.module('app.dashboard', [])

.controller('dashboardController', ['$scope', 'data', 'isAuth', '$location', '$window', 'Requests', function($scope, data, isAuth, $location, $window, Requests) {
  if (!isAuth) {
    var redir = $location.$$path;
    $window.localStorage.setItem('redir', redir);
    $location.path('/login');
  }
  console.log(data, 'token token token');
  $scope.user = data.userdata.username;
  $scope.games = data.userdata.games;

  //update facebook stuffs
  $scope.facebook = Requests.updateFacebookData;

  $scope.goToGame = function(path) {
    $location.path('/game/' + path + '/map');
  };
}]);

