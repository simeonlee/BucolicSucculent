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
    }
  };
})
// .factory('GetLoc', ['$geolocation', function($geolocation) {
//   return {
//     showLocation: function() {
//       $geolocation.getCurrentPosition({
//         timeout: 60000
//       }).then(function(position) {
//       console.log(position);
//       return position;
//     });;
//     }
//   };
// }]);