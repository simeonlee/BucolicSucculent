angular.module('app.createGame', ['uiGmapgoogle-maps'])

.controller('createGameController', function($scope, uiGmapGoogleMapApi) {
  $scope.submitWaypoints = function() {
    // get waypoints from map and submit to server to create createGame
    $scope.gamePath = 'http://www.reddit.com';
  };

  $scope.map = { 
    center: { 
      latitude: 37.7836881,                 //<------- set this to current location
      longitude: -122.40904010000001 
    }, 
    zoom: 13,
    events: {
      click: function(map, eventName, originalEventArgs) {
            console.log(this.data)

      }
    }
  };

  uiGmapGoogleMapApi.then(function(maps) { //<------- create map (promise) and after
    $scope.createOptions = {
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
        ]
      },
      markerOptions: {
        draggable: true
      },
    }
  });

  $scope.consoleMarker = function() {
    console.log($scope.map.data)
  }



})