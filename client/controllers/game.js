angular.module('app.game', ['uiGmapgoogle-maps', 'app.services', 'ngGeolocation'])

.controller('gameController', function($scope, data, $window) {
  $scope.user = $window.localStorage.getItem('user')
  console.log(data, 'thsibedata')
  $scope.markers = data;
    // $scope.players = res.data.players; //<-----------------property in data json for player info
  $scope.markers.forEach(function(marker, ind){
    var label = marker.sequence.toString();
    $scope.markers[ind].options = {
      label: label
    };
  })
  console.log($scope.markers, 'this is tslkfjsdflk');
  
  $scope.map = { 
    center: { 
      latitude: 37.7836881,                 //<------- SF default map
      longitude: -122.40904010000001 
    }, 
    zoom: 13
  };

})
.controller('gameMapController', function($scope, uiGmapGoogleMapApi, $geolocation, GeoLoc, Requests, $rootScope) {
 

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
        radius: 100,
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


  $scope.validateLocation = function(locationId) { 
    console.log(locationId)
    var pointToCheck;
    $scope.markers.forEach(function(location) {
      if (location.id === locationId) {
        pointToCheck = new google.maps.LatLng(location.latitude, location.longitude);

      }
    })
    // get lat and lng from locationId
     //<-- Dummy point... loc to be checked
    
    var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween($scope.myLatLng, pointToCheck);

    console.log(distanceBetween)

    if (distanceBetween <= 100) { //<---------- ok within 100 meters

      // make call to server to update location status for player
      Requests.updateLocStatus($scope.user, locationId).then(function(res) {     //<----- adjust function args
        // after res gets back from put request
      }) 


      $scope.markers.forEach(function(location) { //<---- works on dummy data but probably needs some work with the real thing
        if (location.id === locationId) {
          console.log(location.id, locationId, 'location')
          location.statuses.status = true;
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