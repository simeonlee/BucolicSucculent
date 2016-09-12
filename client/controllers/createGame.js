angular.module('app.createGame', ['uiGmapgoogle-maps', 'app.services', 'app'])

.controller('createGameController', ['$scope', 'uiGmapGoogleMapApi', 'Requests', '$rootScope', '$window', 'isAuth', '$location', function($scope, uiGmapGoogleMapApi, Requests, $rootScope, $window, isAuth, $location) {

  //check for JWT
  if (!isAuth) {
    $location.path('/login');
  }

  $scope.showMap = true;

  // call when game is to be created
  $scope.submitWaypoints = function() {

    //get user for ajax request
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

  $scope.map = { 
    center: { 
      latitude: 37.7836881,                 //<------- Default SF map
      longitude: -122.40904010000001 
    }, 
    zoom: 13
  };

  $scope.map.markers = []; //<--------- save marker coords here

  uiGmapGoogleMapApi.then(function() { //<------- create map (promise) and after

    //API marker creation tool
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
        // draggable: true, //<------------- WISHLIST fix draggable marker coords saving and uncomment
      },
    };
    //for each game, the first marker gets labelled '1'
    var sequence = 1;

    // on each marker addition
    google.maps.event.addListener($scope.createOptions, 'overlaycomplete', function(event) {

      var marker = {
        sequence: sequence,
        latitude: event.overlay.position.lat(),
        longitude: event.overlay.position.lng(),
        options: {
          label: sequence.toString()
        }
      };
      $scope.map.markers.push(marker); //<---------- push coords to markers array
      $scope.$apply(); //<----- apply changes to digest loop in order to render labelled markers

      sequence++; //<--- incrememnt sequence prop for next label
    });
  });
}]);