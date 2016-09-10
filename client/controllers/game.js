angular.module('app.game', ['uiGmapgoogle-maps', 'app.services', 'ngGeolocation'])

.controller('gameController', ['$scope', '$window', 'isAuth', '$location', function($scope, $window, isAuth, $location) {
  //Check for JWT
  if (!isAuth) {
    var redir = $location.$$path;
    $window.localStorage.setItem('redir', redir);
    $location.path('/login');
  }


}])
.controller('gameMapController', ['$scope', 'data', 'uiGmapGoogleMapApi', '$geolocation', 'Requests', '$window', function($scope, data, uiGmapGoogleMapApi, $geolocation, Requests, $window) {
 
  //Get user and markers data
  $scope.user = $window.localStorage.getItem('user');
  $scope.markers = data;

    // $scope.players = res.data.players; //<----------------- wishlist

  //Add labels to markers according to sequence number
  $scope.markers.forEach(function(marker, ind){
    var label = marker.sequence.toString();
    $scope.markers[ind].options = {
      label: label
    };
  });
  
  $scope.map = { 
    center: { 
      latitude: 37.7836881,                 //<------- SF default map
      longitude: -122.40904010000001 
    }, 
    zoom: 13
  };
  //init map
  uiGmapGoogleMapApi.then(function(map) {
    // post rendering tasks....
  });
  
  //create position on map
  var createMyPosition = function() {$geolocation.watchPosition({
        timeout: 60000,
        maximumAge: 250,
        enableHighAccuracy: true
    });
  };

  createMyPosition();
  //watch for position change
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

      // create gmap latLng object for calculating distance
      $scope.myLatLng = new google.maps.LatLng($geolocation.position.coords.latitude, $geolocation.position.coords.longitude);  
  });


  $scope.validateLocation = function(locationId) { 

    if ($scope.myLatLng) {
      $scope.locationError = false;
      console.log('checking location: ', locationId);
      var pointToCheck;
      $scope.markers.forEach(function(location) {
        if (location.id === locationId) { // get specific marker data
          pointToCheck = new google.maps.LatLng(location.latitude, location.longitude);

          var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween($scope.myLatLng, pointToCheck);

          if (distanceBetween <= 100) { //<---------- ok within 100 meters

            // make call to server to update location status for player
            Requests.updateLocStatus($scope.user, locationId).then(function(res) {    
              // adjust local location data
              location.statuses.status = true;
              $scope.verifyFailed = false;
            }); 
          } else {
            // location not close enough... display notification
            $scope.verifyFailed = true;     
          }
        }
      });
    } else {
      createMyPosition();
      $scope.locationError = true;
    }
  };
}])
.controller('gameStatsController', ['$scope', function($scope) {
  

}]);