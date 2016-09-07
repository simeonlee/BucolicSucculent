
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps', 'app.services', 'app.game'])

.run(function($rootScope) {
  $rootScope.user = { //<=-========= dummy user data
    username: 'beth',
    password: '123'
  }
})

.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider)  {

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
        controller: 'createGameController'
      })
      .state('game', {
        url: '/game/:path',
        templateUrl: '../views/game.html',
        controller: 'gameController',
        resolve: {
          data: function($stateParams, Requests) {
            return Requests.getGameData($stateParams.path).then(function(res) {
              return res.data.locations;
            }); 
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
})
