angular.module('app.services', ['ngGeolocation'])

.factory('Requests', ['$http', '$window', function($http, $window) {
  return {
    getGameData: function(path) {
      var params = {
        //setItem and getItem 
        username: $window.localStorage.getItem('user'), 
        path: path
      };
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method: 'GET',
        url: '/api/game',  
        params: params
      });
    },
    getGameStats: function(path) {
      var params = {
        path: path
      };
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method: 'GET',
        url: '/api/game',  
        params: params
      });
    },
    createGame: function(user, markers) {
      var data = {
        username: user,
        markers: markers, 
      };
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method: 'POST',
        url: '/api/game',
        data: data
      });
    },

    createPublicGame: function(user, markers) {
      var data = {
        username: user,
        markers: markers, 
      };
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method: 'POST',
        url: '/api/public',
        data: data
      });
    },

    updateLocStatus: function(user, loc) {
      var data = {
        username: user,
        locationId: loc
      };
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method: 'PUT',
        url: '/api/game',
        data: data
      });
    },
    getUserData: function() {
      var params = {
        username: $window.localStorage.getItem('user')
      };
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method: 'GET',
        url: '/api/game',
        params: params
      });
    },
    getPublicGames: function() {
      console.log('i hit getPublicGames');
      return $http({
        method: 'GET',
        url: '/api/public',

      });
    }
  };
}])
// new factory to provide socket connects
// .factory('socket', ['btford.socket-io'], function(socketFactory){
//   return socketFactory({
//     prefix: 'foo~',
//     ioSocket: io.connect('/bar')
//   });
// })
.factory('socket', function (socketFactory) {
    return socketFactory();
})
// .factory('socket', function ($rootScope) {
//   var socket = io.connect();
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () {  
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       })
//     }
//   };
// })
.factory('Auth', ['$http', '$location', '$window', function ($http, $location, $window) {
  // Auth service is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'token'
  // after you login/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var login = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/login',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': user.username,
        'password': user.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('user', resp.data.user);
      return resp.data.token;
    });
  };
  
  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': user.username,
        'password': user.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('user', resp.data.user);
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('token');
  };

  var signout = function () {
    $window.localStorage.removeItem('token');
    $location.path('/login');
  };


  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}])
.factory('gameFactory', function(){
  return {
    makePlayerObject: function(user, lat, lng, avatar, content, ){
      return {
        user: user,
        window: {
          options: { content: content},
          show: false
        },
        longitude: lat,
        latitude: lng,
        radius: 100,
        stroke: {
              color: color || 'red',
              weight: 1,
              opacity: 0.4
            },
        fill: {
          color: color || 'red',
          opacity: 0.3
        }
      }
    }
  }

 //   // ======= roberts code ====== //
 //   $scope.wind = {
 //     options: {
 //       // content: '<div><span>Challenges Completed: \ {{completed}} \</span></div>'
 //       content: '<div id= "bulba"><img src= \'http://pldh.net/media/pokemon/shuffle/001.png\'/></div>'
 //     },
 //     show: false
 //   };
  
 //  $scope.mark = {

 //   events: {
 //     // click: function() {
 //     //   $scope.wind.show = !$scope.wind.show;
 //     // },
 //     mouseover: function() {
 //       console.log('hitting my mouseover event');
 //       $scope.wind.show = true;
 //     },
 //     mouseout: function() {
 //       console.log('hitting my mouseOUT event yo!');
 //       $scope.wind.show = false;
 //     }

 //   },

 //   options: {
 //     icon:'http://pldh.net/media/pokemon/gen3/frlg/007.png',
 //     title: 'squirtle!!!!'
 //   }
 // };
});
