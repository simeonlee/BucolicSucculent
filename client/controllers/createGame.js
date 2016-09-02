angular.module('app.createGame', ['uiGmapgoogle-maps'])

.controller('createGameController', function($scope, uiGmapGoogleMapApi) {
  $scope.submitWaypoints = function() {
    // get waypoints from map and submit to server to create createGame
    $scope.gamePath = 'http://www.reddit.com';
  };

  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  uiGmapGoogleMapApi.then(function(maps) { //<------- create map (promise) and after
    $scope.createOptions = {
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      markerOptions: {
        draggable: true
      },
      drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
        ]
    },
    }
  });



})