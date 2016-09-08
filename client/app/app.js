
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps', 'app.services', 'app.game'])


.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $httpProvider)  {

    $urlRouterProvider.otherwise('/login'); // <-------------- default view TODO: SET TO DASHBOARD!

    $stateProvider
      .state('login', {
          url: '/login',
          templateUrl: '../views/login.html',
          controller: 'AuthController'
        })
      .state('signup', {
        url: '/signup',
        templateUrl: '../views/signup.html',
        controller: 'AuthController'
      })
      .state('createGame', {
        url: '/createGame',
        templateUrl: '../views/createGame.html',
        controller: 'createGameController',
        resolve: {
          isAuth: function(Auth) {
            return Auth.isAuth();
          }
        }
      })
      .state('game', {
        url: '/game/:path',
        templateUrl: '../views/game.html',
        controller: 'gameController',
        resolve: {
          data: function($stateParams, Requests) {
            return Requests.getGameData($stateParams.path).then(function(res) {
              console.log(res.data)
              return res.data.locations;
            }); 
          },
          isAuth: function(Auth) {
            return Auth.isAuth();
          }
        }
      })
      .state('game.map', { //child view of game view ---- link to here on game join
        url: '/map',
        templateUrl: '../views/game.map.html',
        controller: 'gameMapController'
      })
      .state('game.stats', { //child view of game view
        url: '/stats',
        templateUrl: '../views/game.stats.html',
        controller: 'gameStatsController'
      });


      //////////////////// 

      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDgVf-KYpLw0vF1kUlPK3eZc9clchmpRbM', //<----- configure map... should live serverside
        libraries: 'drawing,geometry,visualization'
    });
}])
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

  $rootScope.host = '127.0.0.1';
  //$rootScope.host = '138.68.53.22';

  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/login');
    }
  });
}]);
