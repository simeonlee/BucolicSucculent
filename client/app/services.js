angular.module('app.services', ['ngGeolocation'])

.factory('Requests', function($http) {
  return {
    getGameData: function(gameId) {
      var params = {
        username: '', //<----- this needs to come from auth logic?
        gameId: gameId
      }
      return $http({
        method: 'GET',
        url: 'http://localhost:4200/api/game',  //<-------------- server end point
        params: params
      });
    },
    createGame: function(user, markers) {
      var data = {
        userId: user,
        markers: markers, //<---- array of locations
      }
      return $http({
        method: 'POST',
        url: 'http://localhost:4200api/game/create',
        data: data
      });
    },
    updateLocStatus: function(user, loc) {
      var data = {
        userId: user,
        locationId: loc
      };
      return $http({
        method: 'PUT',
        url: 'http://localhost:4200api/game',
        data: data
      });
    }
  };
})
.factory('GeoLoc', ['$geolocation', '$q', function($geolocation, $q) {
  return {
    setMyLocation: function() {
      return $q(function(resolve, error) {
        $geolocation.getCurrentPosition({
          timeout: 60000
        })
        .then(function(position) {
          resolve(position);
        });
      });
    }
  }
}]);