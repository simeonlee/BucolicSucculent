angular.module('app.createGame', ['uiGmapgoogle-maps'])

.controller('createGameController', function($scope, uiGmapGoogleMapApi) {
  $scope.submitWaypoints = function() {
    // get waypoints from map and submit to server to create createGame
    $scope.gamePath = 'http://www.reddit.com'; //<------ to be game url
  };

  $scope.map = { 
    center: { 
      latitude: 37.7836881,                 //<------- set this to current location
      longitude: -122.40904010000001 
    }, 
    zoom: 13
  };

  $scope.map.markers = []; //<--------- save marker coords here

  // var sequence = 1;
  uiGmapGoogleMapApi.then(function(map) { //<------- create map (promise) and after
    $scope.createOptions = {
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
        ]
      },
      markerOptions: {
        // draggable: true, //<------------- fix draggable marker coords saving and uncomment
        // label: sequence.toString(), //<---------- add z-index and label to marker (doesn't work as is)
        // zIndex: sequence
      },
    }
    var id = 1;
    google.maps.event.addListener($scope.createOptions, 'overlaycomplete', function(event) {
      var marker = {
        id: id,
        coords: {
          latitude: event.overlay.position.lat(),
          longitude: event.overlay.position.lng()
        },
        options: {
          label: id.toString(),
          visible: true
        }
      };
      $scope.map.markers.push(marker); //<---------- push coords to markers array
      console.log($scope.map.markers);
      $scope.$apply(); //<----- apply changes to digest loop (probably unnecessary if not rendering marker coords)

      // This works without draggable markers only. TODO: fix draggableness.
      id++;
    });
  });




})