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
        url: '/api/game',  //<-------------- server end point
        params: params
      });
    },
    createGame: function(markers) {
      
    }
  };
});
// .factory('GeoLoc', ['$geolocation', '$q', function($geolocation, $q) {
//   return {
//     setMyLocation: function() {
//       return $q(function(resolve, error) {
//         $geolocation.getCurrentPosition({
//           timeout: 60000
//         })
//         .then(function(position) {
//           resolve(position);
//         });
//       });
//     }
//   }
// }]);