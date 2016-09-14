angular.module('app.createGame', ['uiGmapgoogle-maps', 'app.services', 'app'])

.controller('createGameController', ['$scope', 'uiGmapGoogleMapApi', 'Requests', '$rootScope', '$window', 'isAuth', '$location', function($scope, uiGmapGoogleMapApi, Requests, $rootScope, $window, isAuth, $location) {

  //check for JWT
  if (!isAuth) {
    $location.path('/login');
  }

  $scope.showMap = true;

  $scope.map = {
    // Default San Francisco
    center: {
      latitude: 37.7836881,                 
      longitude: -122.4090401 
    }, 
    zoom: 14,
    events: {
      tilesloaded: function (map, eventName, originalEventArgs) {
        // Once map is loaded and ready, this callback is hit
      },
      click: function (mapModel, eventName, originalEventArgs) {
        var e = originalEventArgs[0];
        $scope.findNearbyPlaces(e.latLng);
      }
    },
    markers: []
  };

  // Find nearby places using Google API based on location
  // https://developers.google.com/maps/documentation/javascript/places#place_search_requests
  $scope.findNearbyPlaces = function(latLng) {
    var request = {
      location: latLng,
      radius: '50', // meters
      types: ['establishment']
    };
    service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        var sequence = 0;
        for (var i = 0; i < 5; i++) {
          var place = results[i];
          var marker = {
            sequence: sequence,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            markerOptions: {
              // visible: false,
              animation: google.maps.Animation.BOUNCE
            }
          };
          $scope.map.markers.push(marker);
          sequence++;
        }
        // Apply changes to digest loop in order to render labeled markers
        $scope.$apply();
      }
    });
  }

  $scope.searchbox = {
    // GET template from when we saved in $templateCache in app.js
    template: 'searchbox.tpl.html',
    position: 'TOP_RIGHT',
    options: {
      autocomplete: true,
      types: ['point_of_interest', 'establishment']
    },
    events: {
      place_changed: function (autocomplete){

        place = autocomplete.getPlace();

        if (place.address_components) {
          
          newMarkers = [];
          // var bounds = new google.maps.LatLngBounds();

          var marker = {
            idKey: place.place_id,
            place_id: place.place_id,
            name: place.address_components[0].long_name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            // templateurl:'window.tpl.html',
            // templateparameter: place,
            // events: {
            //   click: function (marker) {
            //     $scope.window.coords = {
            //       latitude: marker.model.latitude,
            //       longitude: marker.model.longitude
            //     };
            //     $scope.window.templateparameter = marker.model.templateparameter;
            //     $scope.window.show = true;
                
            //   }
            // }
          };
          
          newMarkers.push(marker);

          // bounds.extend(place.geometry.location);

          // $scope.map.bounds = {
          //   northeast: {
          //     latitude: bounds.getNorthEast().lat(),
          //     longitude: bounds.getNorthEast().lng()
          //   },
          //   southwest: {
          //     latitude: bounds.getSouthWest().lat(),
          //     longitude: bounds.getSouthWest().lng()
          //   }
          // };

          $scope.map.markers = newMarkers;
        } else {
          console.log('do something else with the search string: ' + place.name);
        }
      }
    }
  }

  // Create map (promise) and after
  uiGmapGoogleMapApi.then(function() { 

    // // API marker creation tool
    // $scope.createOptions = {
    //   drawingMode: google.maps.drawing.OverlayType.MARKER,
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.TOP_CENTER,
    //     drawingModes: [
    //       google.maps.drawing.OverlayType.MARKER,
    //     ]
    //   },
    //   markerOptions: {
    //     visible: false,
    //     animation: google.maps.Animation.BOUNCE
    //   },
    // };

    // When user clicks on map to find locations, use API to find nearby places of interest
    // var el = document.getElementsByClassName('angular-google-map');
    // console.log(el);
    // var map = angular.element(document.getElementsByClassName('angular-google-map')[1]);
    // console.log(document.getElementsByClassName('angular-google-map')[1]);
    // google.maps.event.addListener(document.getElementsByClassName('angular-google-map')[1], 'click', function(e) {
    //   console.log(e.latLng);
    //   $scope.findNearbyPlaces(e.latLng);
    // });
  });

  // call when game is to be created
  $scope.submitWaypoints = function() {

    // get user for ajax request
    $scope.user = $window.localStorage.getItem('user');
    // get waypoints from map and submit to server to create createGame
    Requests.createGame($scope.user, $scope.map.markers)
      .then(function(res) {

        // get back hashed game url and display
        var gameUrl = res.data;
        $scope.gamePath = gameUrl; //<------ to be game url
      });

      // hide map on game creation
      $scope.showMap = false;

  };
}]);