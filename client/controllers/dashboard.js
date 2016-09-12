angular.module('app.dashboard', [])

.controller('dashboardController', ['$scope', 'data', 'isAuth', '$location', '$window', function($scope, data, isAuth, $location, $window) {
  if (!isAuth) {
    var redir = $location.$$path;
    $window.localStorage.setItem('redir', redir);
    $location.path('/login');
  }

  $scope.user = data.username;
  $scope.games = data.games;

  $scope.goToGame = function(path) {
    $location.path('/game/' + path + '/map');
  };
}]);

