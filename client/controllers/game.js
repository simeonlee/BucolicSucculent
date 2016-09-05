angular.module('app.game', ['uiGmapgoogle-maps', 'app.services', 'ngGeolocation'])

.controller('gameController', function($scope, data) {
  $scope.map = data.map;
  $scope.markers = data.map.markers;
  $scope.players = data.players; //<-----------------property in data json for player info
  

})
.controller('gameMapController', function($scope, uiGmapGoogleMapApi, $geolocation, GeoLoc) {
 

  uiGmapGoogleMapApi.then(function(map) {
    // post rendering tasks....
  })
  
  $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 250,
      enableHighAccuracy: true
    })
  $scope.myPosition = $geolocation.position;

  $scope.$watch('myPosition', function (newValue, oldValue) {
    if (newValue) {
      $scope.circle = {
        center: {
          latitude: newValue.coords.latitude,
          longitude: newValue.coords.longitude
        },
        radius: newValue.coords.accuracy,
        stroke: {
          color: 'blue',
          weight: 1,
          opacity: 0.4
        },
        clickable: false,
        fill: {
          color: 'blue',
          opacity: 0.3
        }
      };                      
    }
  }, true);


  $scope.user = {"name": 'Brian', "locations": [{"id": 1, "status": true},{"id": 2, "status": false},{"id": 3, "status": false}]};  //<--------- TODO: figure out matching logged-in user with appropriate user from game data

  $scope.validateLocation = function(locationId) { //TODO: validate location with browser geolocation api
    console.log(locationId)
  }

})
.controller('gameStatsController', function($scope) {


});