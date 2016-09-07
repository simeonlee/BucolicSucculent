angular.module('app.createGame', ['uiGmapgoogle-maps', 'app.services', 'app'])

.controller('createGameController', function($scope, uiGmapGoogleMapApi, Requests, $rootScope, $window, isAuth, $location) {
  if (!isAuth) {
    $location.path('/login');
  }



  $scope.showMap = true;
  $scope.submitWaypoints = function() {
    $scope.user = $window.localStorage.getItem('user')
    // get waypoints from map and submit to server to create createGame
    Requests.createGame($scope.user, $scope.map.markers) 
      .then(function(res) {
        console.log(res);
        var gameUrl = res.data;
        $scope.gamePath = 'http://' + $rootScope.host + ':4200/#/game/' + gameUrl + '/map'; //<------ to be game url
      });

      $scope.showMap = false;
  };

  $scope.map = { 
    center: { 
      latitude: 37.7836881,                 //<------- set this to current location
      longitude: -122.40904010000001 
    }, 
    zoom: 13
  };

  $scope.map.markers = []; //<--------- save marker coords here

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
        visible: false
        // draggable: true, //<------------- fix draggable marker coords saving and uncomment
        // label: sequence.toString(), //<---------- add z-index and label to marker (doesn't work as is)
        // zIndex: sequence
      },
    }
    var sequence = 1;
    google.maps.event.addListener($scope.createOptions, 'overlaycomplete', function(event) {
      console.log(event)
      var marker = {
        sequence: sequence,
        latitude: event.overlay.position.lat(),
        longitude: event.overlay.position.lng(),
        options: {
          label: sequence.toString()
        }
      };
      $scope.map.markers.push(marker); //<---------- push coords to markers array
      console.log($scope.map.markers);
      $scope.$apply(); //<----- apply changes to digest loop (probably unnecessary if not rendering marker coords)

      // This works without draggable markers only. TODO: fix draggableness.
      sequence++; //<--- incrememnt sequence prop
    });
  });




})