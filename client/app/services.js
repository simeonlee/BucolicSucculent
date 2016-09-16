angular.module('app.services', ['ngGeolocation', 'btford.socket-io'])

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
    },
    updateFacebookData: function() {
      console.log('updateFacebookData');
      var params = {
        username: $window.localStorage.getItem('user')
      }
      var token = $window.localStorage.getItem('token');
      $http.defaults.headers.common['x-access-token'] = token;
      return $http({
        method:'GET',
        url: '/user/facebook',
        params: params
      });
      // .then(function(data){
      //   console.log(data);
      // })
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
.factory('socket2', function ($rootScope) {
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})
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
      console.log(resp, 'does response now have fb info?');
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
    makePlayerObject: function(user, lat, lng, avatar, content){
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
});
.factory('Map', ['$rootScope', '$http', function($rootScope, $http) {
  var initialize = function() {
    var defaultLocation = {
      lat: 37.783697,
      lng: -122.408966
    };

    return $http.get('styles/map/style.json').then(function(mapStyle) {
      $rootScope.map = new google.maps.Map(document.getElementById('map'), {
        center: $rootScope.userLocation || defaultLocation,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle.data,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });
    })
  };

  var createDestinationMarker = function(location) {
    var icon = new google.maps.MarkerImage('images/marker/marker-black-36x36@2x.png', null, null, null, new google.maps.Size(36, 36))
    var marker = new google.maps.Marker({
      position: location,
      icon: icon,
      title: 'Destination',
      // animation: google.maps.Animation.DROP
    });
    marker.setMap($rootScope.map);
    // marker.setAnimation(google.maps.Animation.BOUNCE);  
  }

  return {
    initialize: initialize,
    createDestinationMarker: createDestinationMarker
  }
}]);