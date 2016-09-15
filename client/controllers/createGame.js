angular.module('app.createGame', ['uiGmapgoogle-maps', 'app.services', 'app'])

.controller('createGameController', ['Map', '$scope', 'uiGmapGoogleMapApi', 'Requests', '$rootScope', '$window', 'isAuth', '$location', '$compile', function(Map, $scope, uiGmapGoogleMapApi, Requests, $rootScope, $window, isAuth, $location, $compile) {

  var transparent = './images/marker/falseMarker/transparent-200x350.png';

  //check for JWT
  if (!isAuth) {
    $location.path('/login');
  }

  $scope.markers = [];

  Map.initialize().then(function(map) {
    $scope.map = map;
    Map.initializeMarkerLayer($scope.map);
    $scope.center = Map.getCenter($scope.map);
    $scope.map.addListener('click', function(e) {
      $scope.map.setCenter({
        lat: e.latLng.lat() + 0.00075,
        lng: e.latLng.lng()
      });
      $scope.map.setZoom(18);
      Map.findNearbyPlaces(e.latLng, $scope.map).then(function(places) {
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          console.log($scope.markers.length, place);
          var marker = Map.createDestination(place, $scope.markers.length.toString(), $scope.map)
          $scope.markers.push(marker);
        }
      });
    });
  });
}])