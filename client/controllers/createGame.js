angular.module('app.createGame', [])

.controller('createGameController', function($scope) {
  $scope.submitWaypoints = function() {
    // get waypoints from map and submit to server to create createGame
    $scope.gamePath = 'http://www.reddit.com';
  }
})