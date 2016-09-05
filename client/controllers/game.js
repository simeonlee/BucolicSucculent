angular.module('app.game', ['uiGmapgoogle-maps'])

.controller('gameController', function($scope, data) {
  $scope.map = data.map;
  $scope.markers = data.map.markers;
  $scope.players = data.players; //<-----------------property in data json for player info
  

})
.controller('gameMapController', function($scope, uiGmapGoogleMapApi) {
  uiGmapGoogleMapApi.then(function(map) {
    // post rendering tasks....
  })

  $scope.user = {"name": 'Brian', "locations": [{"id": 1, "status": true},{"id": 2, "status": false},{"id": 3, "status": false}]};  //<--------- TODO: figure out matching logged-in user with appropriate user from game data

  $scope.validateLocation = function(locationId) { //TODO: validate location with browser geolocation api
    console.log(locationId)
  }

})
.controller('gameStatsController', function($scope) {


});