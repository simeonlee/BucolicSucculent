angular.module('app.game', ['uiGmapgoogle-maps', 'app.services', 'ngGeolocation'])

.controller('gameController', function($scope, data) {
  $scope.map = data.map;
  $scope.markers = data.map.markers;
  $scope.players = data.players; //<-----------------property in data json for player info
  $scope.myPosition = data.map.center; 
  

})
.controller('gameMapController', function($scope, uiGmapGoogleMapApi, $geolocation) {
  uiGmapGoogleMapApi.then(function(map) {
    // post rendering tasks....
  })

  $geolocation.getCurrentPosition({
        timeout: 60000
      }).then(function(position) {
      // console.log(position);
      $scope.myPosition = position;
    });

  $geolocation.watchPosition({
    timeout: 60000,
    maximumAge: 1000,
    enableHighAccuracy: true
  });

  $scope.$watch('myPosition', function(newVal, oldVal) {
    if (newVal) {
      console.log(newVal)
      $scope.map = {
        center: {
          latitude: newVal.coords.latitude,
          longitude: newVal.coords.longitude
        },
        zoom: 13
      }
      
    }
  }, true);


  $scope.user = {"name": 'Brian', "locations": [{"id": 1, "status": true},{"id": 2, "status": false},{"id": 3, "status": false}]};  //<--------- TODO: figure out matching logged-in user with appropriate user from game data

  $scope.validateLocation = function(locationId) { //TODO: validate location with browser geolocation api
    console.log(locationId)
  }

})
.controller('gameStatsController', function($scope) {


});