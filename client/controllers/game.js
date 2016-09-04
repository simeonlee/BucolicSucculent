angular.module('app.game', ['uiGmapgoogle-maps'])

.controller('gameController', function($scope, data, uiGmapGoogleMapApi) {
  $scope.data = data;

  $scope.map = data.map;


  uiGmapGoogleMapApi.then(function(map) {
    
    $scope.markers = data.map.markers
    console.log($scope.markers)

  })


});