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
  $scope.markers.forEach(function(marker, ind) {
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
    zoom: 13,

    events: {
      click: function() {
        console.log('i hit my event yo!');
      }
    }
  };
  //init map
  uiGmapGoogleMapApi.then(function() {
    // post rendering tasks....
  });


  // $scope.map.markerEvents = {
  //   dblclick: function () {
  //     console.log('i hit my click event for the map');
  //   }
  


  //create position on map
  var createMyPosition = function() {
    $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 250,
      enableHighAccuracy: true
    });
  };

  createMyPosition();
  //watch for position change
  $scope.$on('$geolocation.position.changed', function() {
    $scope.circle = {
      center: {
        latitude: $geolocation.position.coords.latitude,
        longitude: $geolocation.position.coords.longitude
      },
      radius: 500,
      stroke: {
        color: 'red',
        weight: 1,
        opacity: 0.4
      },
      clickable: true,

      events: {
        click: function() {
          console.log('i hit my circle yoLOOOOOOO!');
        },
        mouseover: function() {
          console.log('its hovering over my circle yay!!!!');
        }
      },
      fill: {
        color: 'red',
        opacity: 0.3
      }
    };




      // create gmap latLng object for calculating distance
    $scope.myLatLng = new google.maps.LatLng($geolocation.position.coords.latitude, $geolocation.position.coords.longitude);  
  });

  //window for marker
  $scope.wind = {
    options: {
      content: '<div id= "bulba"><img src= \'http://pldh.net/media/pokemon/shuffle/001.png\'/></div>'
    },
    show: false
  };

  //the actual user marker
  $scope.mark = {

    events: {
      click: function() {
        $scope.wind.show = !$scope.wind.show;
      },
      // mouseover: function() {
      //   console.log('hitting my mouseover event');
      //   $scope.wind.show = true;
      // },
      // mouseout: function() {
      //   console.log('hitting my mouseOUT event yo!');
      //   $scope.wind.show = false;
      // }

    },

    options: {
      icon:'http://pldh.net/media/pokemon/gen3/frlg/007.png',
      title: 'squirtle!!!!'
    }
  };


  $scope.validateLocation = function(locationId) { 

    if ($scope.myLatLng) {
      $scope.locationError = false;
      // console.log('checking location: ', locationId);
      var pointToCheck;
      $scope.markers.forEach(function(location) {
        if (location.id === locationId) { // get specific marker data
          pointToCheck = new google.maps.LatLng(location.latitude, location.longitude);

          var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween($scope.myLatLng, pointToCheck);

          if (distanceBetween <= 100) { //<---------- ok within 100 meters

            // make call to server to update location status for player
            Requests.updateLocStatus($scope.user, locationId).then(function() {    
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
.controller('gameStatsController', ['$scope', 'data', function($scope, data) {
  $scope.players = data;
}])
.controller('publicController', ['$scope', 'data', function($scope, data) {
  $scope.players = data;
}]);



    // <ui-gmap-marker id="playermarker" idKey="254" options="mark.options"coords="circle.center" events='mark.events' clickable=true>

