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

// I’ve updated my PR

// [9:26]  
// The /api/game endpoint will now take the ‘username’ params and give back all the joined games for that ‘username'

// [9:27]  
// the ‘path’ params will give back all the active users and their statuses in that particular game

// [9:27]  
// and if the ‘username'

// [9:27]  
// and the ‘path’ are both provided, it will provide the user’s status in that particular game

// [9:27]  
// All functionality should have been retained

// [9:28]  
// Also included example data for the way the server should be returning that data