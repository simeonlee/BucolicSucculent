angular.module('app.createGame', [])

.controller('createGameController', function($scope, uiGmapGoogleMapApi) {
  $scope.submitWaypoints = function() {
    // get waypoints from map and submit to server to create createGame
    $scope.gamePath = 'http://www.reddit.com';
  };

  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  uiGmapGoogleMapApi.then(function(maps) { //<------- create map (promise) and after

  });

})