angular.module('app.game', ['uiGmapgoogle-maps', 'app.services', 'ngGeolocation'])
.run(function(){

})

.controller('gameController', function($scope, data) {
  $scope.map = data.map;
  $scope.markers = data.map.markers;
  $scope.players = data.players; //<-----------------property in data json for player info
  

})
.controller('gameMapController', function($scope, uiGmapGoogleMapApi, $geolocation, GeoLoc, Requests) {
 

  uiGmapGoogleMapApi.then(function(map) {
    // post rendering tasks....
  })
  
  $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 250,
      enableHighAccuracy: true
  })
  $scope.myPosition = $geolocation.position;

  $scope.$on('$geolocation.position.changed', function(newValue) {
    $scope.circle = {
        center: {
          latitude: $geolocation.position.coords.latitude,
          longitude: $geolocation.position.coords.longitude
        },
        radius: $geolocation.position.coords.accuracy,
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
      $scope.myLatLng = new google.maps.LatLng($geolocation.position.coords.latitude, $geolocation.position.coords.longitude);  
  })

  $scope.user = {"name": 'Brian', "locations": [{"id": 1, "status": true},{"id": 2, "status": false},{"id": 3, "status": false}]};  //<--------- TODO: figure out matching logged-in user with appropriate user from game data

  $scope.validateLocation = function(locationId) { //TODO: validate location with browser geolocation api
    console.log(locationId)
    // get lat and lng from locationId
    var point2 = new google.maps.LatLng(37.7837646, -122.40909429999999); //<-- Dummy point... loc to be checked
    
    var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween($scope.myLatLng, point2);
    console.log(distanceBetween)
    if (distanceBetween <= 250) { //<---------- ok within 250 meters

      // make call to server to update location status for player
      Requests.updateLocStatus(user, locationId).then(function(res) {     //<----- adjust function args
        // after res gets back from put request
      }) 


      $scope.user.locations.forEach(function(location) { //<---- works on dummy data but probably needs some work with the real thing
        if (location.id === locationId) {
          console.log(location.id, locationId, 'logcation')
          location.status = true;
        }
        console.log($scope.user, 'user');
        // $scope.$apply();
      })
      $scope.verifyFailed = false;
    } else {
      $scope.verifyFailed = true;
    }

  }

})
.controller('gameStatsController', function($scope) {


});