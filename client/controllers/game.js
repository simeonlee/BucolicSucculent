// console.log('updating ' + data.user + '\'s' + ' location');
//     if($scope.playersPlaying[data.user] === undefined){
//       $scope.playersPlaying[data.user] = true;
//       $scope.players = $scope.players.push(data)
//     } else {
//       var $newPlayerLocations = $scope.players //(might need to make copy instead of reference)
//       var playersLength = $newPlayerLocations.length;
//       for (var i = 0; i < playersLength; i++) {
//         if($newPlayerLocations[i].user === data.user){
//           $newPlayerLocations[i].latitude = data.latitude;
//           $newPlayerLocations[i].longitude = data.longitude;
//           return $scope.players = $newPlayerLocations;
//         } 
//       }
//     }

angular.module('app.game', ['uiGmapgoogle-maps', 'app.services', 'ngGeolocation'])

.controller('gameController', ['$scope', '$window', 'isAuth', '$location', function($scope, $window, isAuth, $location) {
  //Check for JWT
  if (!isAuth) {
    var redir = $location.$$path;
    $window.localStorage.setItem('redir', redir);
    $location.path('/login');
  }


}])
.controller('gameMapController', ['$scope', 'data', 'uiGmapGoogleMapApi', '$geolocation', 'Requests', '$window', 'socket','gameFactory', function($scope, data, uiGmapGoogleMapApi, $geolocation, Requests, $window, socket, gameFactory) {
  console.log('inside gameMapController');
  //testing socket connection. remove later
  socket.on('send:time', function (data) {
        console.log(data);
    });
  //update other player locations
  socket.on('updateLocation', function(data){
      console.log(data, 'data data data')
      if($scope.playersPlaying[data.user] === undefined){
        console.log('new user! add to $scope.players');
        $scope.playersPlaying[data.user] = data;
        $scope.players.push(data);
      } else {
        console.log('user exists! update location');
        var playersCount = $scope.players.length;
        for(var i = 0; i < playersCount; i++) {
          if($scope.players[i].user === data.user){
            $scope.players[i] = data;
            return;
          }
        }
      }
    });
  //Get user and markers data
  $scope.user = $window.localStorage.getItem('user');
  $scope.markers = data;
  //Get other player data
  $scope.playersPlaying = {};
  $scope.players = []; //<------- TODO. HOW TO GET OTHER PLAYER LOCATION VIA SOCKETS TO APPEND TO USER MAP
  // $scope.player2 = {};
  // var makePlayerObject = function(user, lat, lng, color){
  //   return {
  //     user: user,
  //     longitude: lat,
  //     latitude: lng,
  //     radius: 100,
  //     stroke: {
  //           color: color || 'red',
  //           weight: 1,
  //           opacity: 0.4
  //         },
  //     fill: {
  //       color: color || 'red',
  //       opacity: 0.3
  //     }
  //   }
  // }

  //working iteration of player two movement below
  // $scope.player2 = {
  //   center: $scope.position,
  //   radius: 100,
  //   stroke: {
  //         color: 'red',
  //         weight: 1,
  //         opacity: 0.4
  //       },
  //   fill: {
  //     color: 'red',
  //     opacity: 0.3
  //   }
  //   };

    // $scope.players = res.data.players; //<----------------- wishlist

  //Add labels to markers according to sequence number
  $scope.markers.forEach(function(marker, ind) {
    var label = marker.sequence.toString();
    $scope.markers[ind].options = {
      label: label
    };
  });

  $scope.position= {
    latitude: 37.7836881,
    longitude: -122.40904010000001
  }
  // $watch will rebind new location position to map center when user location changes
  // in '$geolocation.position.changed' $on listener below
  $scope.$watch('position', function(newloc){
    $scope.map.center = newloc;
  });

  $scope.$watch('players', function(updatedPlayersArray){
    console.log(typeof updatedPlayersArray, updatedPlayersArray, 'updatedPlayersArray');
    $scope.players = updatedPlayersArray;
    console.log($scope.players, 'updated Players Array');
  }, true);

  // $scope.$watch('player2', function(newPlayer2){
  //   console.log(typeof newPlayer2, newPlayer2, 'newPlayer2')
  //   $scope.player2 = newPlayer2;
  // });
  //necessary to watch players object? --- check later
  $scope.$watch('playersPlaying', function(updatePlayersPlaying){
    console.log(updatePlayersPlaying, 'updatePlayersPlaying');
    $scope.playersPlaying = updatePlayersPlaying;
    console.log($scope.playersPlaying, 'new updated Players playing object')
  }, true)


  $scope.map = { 
    center: $scope.position, 
    zoom: 13,
    events: {                               //<--------- add click event to google map
      click: function(mapModel, eventName, originalEventArgs) {
        console.log(originalEventArgs[0].latLng.lat(), originalEventArgs[0].latLng.lng()); // <=== find latLng of click on map
     }
    }
  };
  //init map
  uiGmapGoogleMapApi.then(function(maps) {
    // post rendering tasks....
    // console.log(map);
  });


  // $scope.map.markerEvents = {
  //   dblclick: function () {
  //     console.log('i hit my click event for the map');
  //   }
  


  //create position on map
  var createMyPosition = function() {
    $geolocation.watchPosition(function(success){
      console.log(success, 'watchPosition')
    }, null, {
      timeout: 3000,
      maximumAge: 250,
      enableHighAccuracy: true
    });
  };

  createMyPosition();

  //watch for position change
  $scope.$on('$geolocation.position.changed', function() {
    var lat = $geolocation.position.coords.latitude;
    var lng = $geolocation.position.coords.longitude;

    var pos = {
        latitude: lat,
        longitude: lng
      };
    //update $scope.position so $scope.$watch('position') can re-register new location for map to render!  
    $scope.position = pos; 
    //emit changed position to broadcast from serverside to all users 
    //broadcast color as red so user knows what color to render you on their map!
    socket.emit('updateLocation', {
      //in order for ui-gmap-markers within view to render correctly, keep the object formatting below
      // user:$scope.user, <== bring this back later for ui markers
      // latitude: lat,
      // longitude: lng
      user: $scope.user, 
      latitude: lat, 
      longitude: lng,
      radius: 100,
      stroke: {
        color: 'red',
        weight: 1,
        opacity: 0.4
      },
      fill: {
        color: 'red',
        opacity: 0.3
      }
    }); 
    // my location
    $scope.circle = {
      center: pos,
      radius: 100,
      stroke: {
        color: 'red',
        weight: 1,
        opacity: 0.4
      },
      clickable: true,
      events: {
        click: function() {
          console.log('i hit my circle yoLOOOOOOO!');
        },
        mouseover: function() {
          console.log('its hovering over my circle yay!!!!');
        }
      },
      fill: {
        color: 'red',
        opacity: 0.3
      }
    };




      // create gmap latLng object for calculating distance
    $scope.myLatLng = new google.maps.LatLng($geolocation.position.coords.latitude, $geolocation.position.coords.longitude);  
  });

  //window for marker
  $scope.wind = {
    options: {
      content: '<div id= "bulba"><img src= \'http://pldh.net/media/pokemon/shuffle/001.png\'/></div>'
    },
    show: false
  };

  //the actual user marker
  $scope.mark = {

    events: {
      click: function() {
        $scope.wind.show = !$scope.wind.show;
      },
      // mouseover: function() {
      //   console.log('hitting my mouseover event');
      //   $scope.wind.show = true;
      // },
      // mouseout: function() {
      //   console.log('hitting my mouseOUT event yo!');
      //   $scope.wind.show = false;
      // }

    },

    options: {
      icon:'http://pldh.net/media/pokemon/gen3/frlg/007.png',
      title: 'squirtle!!!!'
    }
  };



  $scope.validateLocation = function(locationId) { 
    console.log('hello');
    if ($scope.myLatLng) {
      $scope.locationError = false;
      // console.log('checking location: ', locationId);
      var pointToCheck;
      $scope.markers.forEach(function(location) {
        if (location.id === locationId) { // get specific marker data
          pointToCheck = new google.maps.LatLng(location.latitude, location.longitude);

          var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween($scope.myLatLng, pointToCheck);

          if (distanceBetween <= 100) { //<---------- ok within 100 meters

            // make call to server to update location status for player
            Requests.updateLocStatus($scope.user, locationId).then(function() {    
              // adjust local location data
              location.statuses.status = true;
              $scope.verifyFailed = false;
            }); 
          } else {
            // location not close enough... display notification
            $scope.verifyFailed = true;     
          }
        }
      });
    } else {
      createMyPosition();
      $scope.locationError = true;
    }
  };
}])
.controller('gameStatsController', ['$scope', 'data', function($scope, data) {
  $scope.players = data;
}])
.controller('publicController', ['$scope', 'data', '$location', '$window', function($scope, data, $location, $window) {

  $scope.list = function() {
    console.log('what is this data thingie i have here????', data);
  };

  $scope.games = data;

  $scope.goToGame = function(path) {
    $location.path('/game/' + path + '/map');
  };

}]);



    // <ui-gmap-marker id="playermarker" idKey="254" options="mark.options"coords="circle.center" events='mark.events' clickable=true>

